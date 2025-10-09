'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Music, Trash2, Info } from 'lucide-react';

import { Button } from '@/components/button';
import { Progress } from '@/components/progress';
import { useSession } from 'next-auth/react';
import {
  deleteUploadedTrack,
  uploadFileInChunks,
  createWorkspace,
} from '@/legacy/services/audioService';
import { subLookup } from '@/legacy/services/userService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/dialog';
import { signIn } from '@/legacy/services/authService';

const ACCEPTED_AUDIO_TYPES = ['audio/wav', 'audio/flac'];
const MAX_DURATION_SECONDS = 600;

type UploadedAudio = {
  file: File;
  previewUrl: string;
  progress: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
  trackMediaId?: string;
  error?: string;
};

export function AudioUploader() {
  const [audioFiles, setAudioFiles] = useState<UploadedAudio[]>([]);
  const [showRequirements, setShowRequirements] = useState(false);

  const { data: session } = useSession({
    required: true,
    onUnauthenticated: () => signIn(),
  });

  const simulateUpload = (file: File): Promise<void> =>
    new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setAudioFiles((prev) =>
          prev.map((f) =>
            f.file === file
              ? { ...f, progress: progress, status: 'uploading' }
              : f
          )
        );
        if (progress >= 100) {
          clearInterval(interval);
          setAudioFiles((prev) =>
            prev.map((f) =>
              f.file === file ? { ...f, progress: 100, status: 'success' } : f
            )
          );
          resolve();
        }
      }, 100);
    });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      if (!ACCEPTED_AUDIO_TYPES.includes(file.type)) {
        console.warn(`❌ Unsupported file type: ${file.name}`);
        return;
      }

      const audio = document.createElement('audio');
      audio.preload = 'metadata';

      audio.onloadedmetadata = async () => {
        URL.revokeObjectURL(audio.src);
        const duration = audio.duration;

        if (isNaN(duration) || duration <= 0) {
          console.warn(
            `⚠️ Skipping "${file.name}" — invalid or unreadable audio.`
          );
          return;
        }

        if (duration > MAX_DURATION_SECONDS) {
          console.warn(`⚠️ Skipping "${file.name}" — longer than 10 minutes.`);
          return;
        }

        const newFile: UploadedAudio = {
          file,
          previewUrl: URL.createObjectURL(file),
          progress: 0,
          status: 'uploading',
        };

        setAudioFiles((prev) => [...prev, newFile]);

        try {
          console.log(session);
          const accessToken = session?.accessToken || '';
          const userId = 1; // TODO Use a placeholder user ID for now; replace with actual logic as needed
          if (!userId) throw new Error('User ID is required for upload.');

          const { trackMediaId } = await uploadFileInChunks({
            file,
            userId,
            accessToken,
            onProgress: (percent) => {
              setAudioFiles((prev) =>
                prev.map((f) =>
                  f.file === file
                    ? { ...f, progress: percent, status: 'uploading' }
                    : f
                )
              );
            },
          });

          setAudioFiles((prev) =>
            prev.map((f) =>
              f.file === file ? { ...f, status: 'success', trackMediaId } : f
            )
          );
        } catch (error) {
          console.error(`❌ Upload failed for "${file.name}":`, error);
          const isDuplicate =
            error instanceof Error && error.message.includes('Duplicate');
          setAudioFiles((prev) =>
            prev.map((f) =>
              f.file === file
                ? {
                    ...f,
                    status: 'error',
                    error: isDuplicate ? 'Duplicate track' : 'Upload failed',
                  }
                : f
            )
          );
        }
      };

      audio.onerror = () => {
        console.warn(`⚠️ Could not load audio metadata for: ${file.name}`);
      };

      audio.src = URL.createObjectURL(file); // 💡 Attach source *after* defining `onloadedmetadata`
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: ACCEPTED_AUDIO_TYPES.reduce(
      (acc, type) => {
        acc[type] = [];
        return acc;
      },
      {} as Record<string, string[]>
    ),
    multiple: true,
    noClick: true,
    noKeyboard: true,
  });

  const removeFile = async (file: File) => {
    const target = audioFiles.find((f) => f.file === file);
    if (target?.trackMediaId) {
      try {
        await deleteUploadedTrack(
          target.trackMediaId,
          session?.accessToken || ''
        );
        console.log(`✅ Successfully deleted track: ${target.trackMediaId}`);
      } catch (err) {
        console.error('Failed to delete uploaded track:', err);
      }
    }

    setAudioFiles((prev) => prev.filter((f) => f.file !== file));
    URL.revokeObjectURL(file as unknown as string);
  };

  //TODO update this after setting orders and track titles
  const saveUploads = async () => {
    const trackMedias = audioFiles
      .filter((f) => f.trackMediaId)
      .map((f, index) => ({
        trackMediaId: f.trackMediaId!,
        trackId: '', // You’ll update this once a track is created
        trackOrder: index,
      }));

    try {
      const accessToken = session?.accessToken || '';
      const userId = 1;

      const res = await createWorkspace(userId, 1, trackMedias, accessToken);

      console.log('Workspace created:', res);
    } catch (err) {
      console.error('Failed to create workspace:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'hover:border-primary/50 border-gray-300'
        }`}
      >
        <input {...getInputProps()} className="hidden" />
        <div className="space-y-4">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="text-lg font-medium">
            Drag and drop your audio files here
          </h3>
          <p className="text-sm text-gray-400">or</p>
          <Button type="button" onClick={open}>
            Select Files
          </Button>
          <p className="text-sm text-gray-400">
            Audio files must be FLAC or WAV
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setShowRequirements(true);
            }}
            className="mx-auto mt-4 flex items-center justify-center text-sm"
          >
            <Info className="mr-1 h-4 w-4" />
            File Requirements & Guidelines
          </Button>
        </div>
      </div>

      {audioFiles.length > 0 && (
        <div className="space-y-6">
          {audioFiles.map(({ file, previewUrl, progress, status, error }) => (
            <div
              key={file.name}
              className="space-y-4 rounded-lg border p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Music className="text-primary" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(file)}
                  className="text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <Progress value={progress} className="h-2" />
              {status === 'uploading' && (
                <p className="text-sm text-gray-500">
                  Uploading... {progress}%
                </p>
              )}
              {status === 'error' && (
                <p className="mt-1 text-sm text-red-500">
                  {' '}
                  {error || 'Upload failed'}
                </p>
              )}
              {status === 'success' && (
                <p className="text-sm text-gray-500"> Completed</p>
                // <audio controls src={previewUrl} className="w-full mt-2" /> TODO for playback
              )}
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-between">
        <div>
          <Button variant="ghost">Back</Button>
        </div>
        <div>
          <Button>Continue</Button>
        </div>
      </div>

      <Dialog open={showRequirements} onOpenChange={setShowRequirements}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Audio requirements</DialogTitle>
          </DialogHeader>
          <div className="mb-2 space-y-4 text-sm">
            <div>
              <h4 className="mb-2">
                <span className="font-medium">Accepted File Formats: </span>{' '}
                FLAC or WAV
              </h4>
              <h4 className="mb-2 font-medium">Specifications: </h4>
              <ul className="list-disc space-y-1 pl-5">
                <li>DXD 352.8 kHz 24-bit</li>
                <li>
                  HD Audio: 192/176.4/96/88.2/48/44.1 kHz at 32-bit or 24-bit
                </li>
                <li>Audio: 48/44.1 kHz at 16-bit</li>
              </ul>
            </div>

            <div>
              <h4 className="mb-2 font-medium">Track Length:</h4>
              <ul className="list-disc space-y-1 pl-5">
                <li>Must be greater than 0 and not exceed 10 minutes</li>
              </ul>
            </div>
            <h4>
              <span className="mb-2 font-medium">Note: </span>Files not meeting
              these requirements may be rejected during upload.
            </h4>
          </div>

          <Button onClick={() => setShowRequirements(false)} className="mt-4">
            Got it
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AudioUploader;
