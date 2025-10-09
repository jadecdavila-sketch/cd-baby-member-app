'use client';

import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Cropper, { Area } from 'react-easy-crop';
import { useSession } from 'next-auth/react';
import {
  Upload,
  AlertCircle,
  RotateCw,
  Info,
  Maximize2,
  CheckCircle,
  Loader2,
} from 'lucide-react';

import { Button } from '@/components/button';
import { Slider } from '@/components/slider';
import { Progress } from '@/components/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/dialog';
import {
  createRelease,
  insertReleaseStatus,
  uploadReleaseImage,
} from '@/legacy/services/releaseService';

import { getCroppedImageFile } from './utils';
import { signIn } from '@/legacy/services/authService';

const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png'];
const MIN_DIMENSIONS = 1400;
const MAX_DIMENSIONS = 6000;

export function ArtUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<
    'idle' | 'uploading' | 'success' | 'error'
  >('idle');
  const [preview, setPreview] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [showRequirements, setShowRequirements] = useState(false);
  const [imageSize, setImageSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [showCropper, setShowCropper] = useState(false);

  const { data: session } = useSession({
    required: true,
    onUnauthenticated: () => signIn(),
  });

  useEffect(() => {
    if (showCropDialog) {
      const timeout = setTimeout(() => {
        setShowCropper(true);
        setCrop((prev) => ({ ...prev }));
      }, 150);

      return () => clearTimeout(timeout);
    } else {
      setShowCropper(false);
    }
  }, [showCropDialog, preview]);

  useEffect(() => {
    if (showCropDialog) {
      const timeout = setTimeout(() => {
        setCrop((prev) => ({ ...prev }));
      }, 50);

      return () => clearTimeout(timeout);
    }
  }, [zoom, showCropDialog]);

  //TODO this function simulates the initial POST for metadata required for the image upload, update when business logic is defined
  const releaseDummy = async () => {
    try {
      if (session?.accessToken === undefined) return;
      const releaseData = {
        ReleaseId: 1,
        ReleaseTitle: 'Test Release',
        ReleaseTypeId: 1,
        MetadataLanguageId: 1,
        ModifiedBy: '1',
      };
      await createRelease(session.accessToken, releaseData);
      console.log('✅ Release created.');

      const statusData = {
        ReleaseId: 1,
        ModifiedBy: '1',
        ReleaseStatusTypeId: 1, // adjust this if you know the correct status ID
      };

      await insertReleaseStatus(session.accessToken, statusData);
      console.log('✅ Release status inserted.');
    } catch (error) {
      console.error('Error creating release:', error);
    }
  };

  // Function to handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setRotation(0);
    setZoom(1);
    setCroppedAreaPixels(null);
    setCroppedImage(null);

    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setFile(file);
    setErrorMessage(null);

    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      setErrorMessage('Invalid file format. Please upload a JPG or PNG file.');
      setUploadStatus('error');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      if (img.width < MIN_DIMENSIONS || img.height < MIN_DIMENSIONS) {
        setErrorMessage(
          `Image is too small. Minimum size is ${MIN_DIMENSIONS}x${MIN_DIMENSIONS}px.`
        );
        setUploadStatus('error');
        URL.revokeObjectURL(objectUrl);
        return;
      }

      if (img.width > MAX_DIMENSIONS || img.height > MAX_DIMENSIONS) {
        setErrorMessage(
          `Image is too large. Maximum size is ${MAX_DIMENSIONS}x${MAX_DIMENSIONS}px.`
        );
        setUploadStatus('error');
        URL.revokeObjectURL(objectUrl);
        return;
      }
      setPreview(objectUrl);
      setShowCropDialog(true);
      setImageSize({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      setErrorMessage('Failed to load the image. Try another file.');
      setUploadStatus('error');
      URL.revokeObjectURL(objectUrl);
    };

    img.src = objectUrl;
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxFiles: 1,
    noClick: true,
    noKeyboard: true,
  });

  //cropping handler
  const onCropComplete = (_croppedArea: Area, croppedAreaPixels: Area) => {
    const { x, y, width, height } = croppedAreaPixels;

    // Check for valid numeric values before setting state
    const isValid = !isNaN(x) && !isNaN(y) && !isNaN(width) && !isNaN(height);

    if (isValid) {
      setCroppedAreaPixels(croppedAreaPixels);
    }
  };
  //image rootation on dialog
  const handleRotate = useCallback(() => {
    setRotation((prev) => (prev + 90) % 360);
  }, []);

  // Function to calculate maximum zoom level based on image dimensions
  function getMaxZoom(imageWidth: number, imageHeight: number): number {
    const widthRatio = imageWidth / MIN_DIMENSIONS;
    const heightRatio = imageHeight / MIN_DIMENSIONS;
    return Math.min(widthRatio, heightRatio);
  }

  // Function to handle image upload
  const handleUpload = useCallback(async () => {
    try {
      //TODO upload progress is being manually simulated, in case we want the progress to mirror with the real upload it would require using axios or similar library
      //for an onUploadProgress callback

      if (!file || !preview || !croppedAreaPixels) return;

      setShowCropDialog(false);
      setUploadStatus('uploading');
      setUploadProgress(0);

      const fileToUpload = await getCroppedImageFile(
        preview,
        croppedAreaPixels,
        rotation,
        file.name
      );
      const formData = new FormData();
      formData.append('attachment', fileToUpload);

      releaseDummy();
      setUploadProgress(50);

      if (!session || !session.accessToken) {
        setErrorMessage(
          'Authentication error: Unable to upload image. Please sign in again.'
        );
        setUploadStatus('error');
        return;
      }
      await uploadReleaseImage(
        session.accessToken,
        formData,
        fileToUpload.name
      );

      setCroppedImage(URL.createObjectURL(fileToUpload));
      setUploadProgress(100);
      setUploadStatus('success');
    } catch (err) {
      console.error('Cropping failed', err);
      setUploadStatus('error');
    }
  }, [file, preview, croppedAreaPixels, rotation]);

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'hover:border-primary/50 border-gray-300'
        }`}
      >
        <input {...getInputProps()} className="hidden" />
        {uploadStatus === 'success' ? (
          <div className="space-y-6">
            {/* Artwork Thumbnail */}
            <div className="flex justify-center">
              <div className="relative mx-auto h-48 w-48">
                <img
                  src={croppedImage || preview || ''}
                  alt="Uploaded Artwork"
                  className="h-full w-full cursor-pointer rounded-md object-cover shadow-md transition-shadow hover:shadow-lg"
                  onClick={() => setShowFullPreview(true)}
                />
                <button
                  className="absolute top-2 right-2 rounded-full bg-black/70 p-1 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowFullPreview(true);
                  }}
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Success Message */}
            <div className="space-y-4">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
              <div>
                <h3 className="text-xl font-medium text-green-700">
                  Upload successful!
                </h3>
                <p className="mt-2 text-xs text-gray-500">
                  File name: {file?.name}
                </p>
                <p className="mt-4 text-gray-500">
                  Drag and drop a new file or click below to replace this one.
                </p>
              </div>
              <Button variant="ghost" onClick={open}>
                Replace Image
              </Button>
            </div>
          </div>
        ) : uploadStatus === 'uploading' ? (
          <div className="space-y-6 py-4">
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="text-primary mb-4 h-12 w-12 animate-spin" />
              <h3 className="text-primary text-xl font-medium">Uploading...</h3>
            </div>

            <div className="mx-auto w-full max-w-md space-y-2">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-sm text-gray-600">
                {uploadProgress}% complete
              </p>
            </div>

            {preview && (
              <div className="relative mx-auto mt-4 h-32 w-32 opacity-50">
                <img
                  src={preview || '/placeholder.svg'}
                  alt="Preview"
                  className="h-full w-full rounded-md object-cover"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div>
              <h3 className="text-lg font-medium">
                Drag and drop your image here
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                Or Use the button below
              </p>
              <Button
                type="button"
                variant="ghost"
                className="mt-2"
                onClick={open}
              >
                Select a file
              </Button>
              <p className="mt-2 text-sm text-gray-400">
                Accepted formats: JPG or PNG
              </p>
              <p className="mt-2 text-sm text-gray-400">
                We highly recommend you supply cover art at a minimum of 3000 x
                3000 pixels.
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
        )}

        {/* Error styling*/}
        {errorMessage && (
          <div className="mt-4 flex items-start rounded-md border border-red-200 bg-red-50 p-3">
            <AlertCircle className="mt-0.5 mr-2 h-5 w-5 flex-shrink-0 text-red-500" />
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        )}
      </div>

      {/* 🖼️ Cropping Dialog */}
      <Dialog open={showCropDialog} onOpenChange={setShowCropDialog}>
        <DialogContent className="max-h-[95vh] w-full !max-w-6xl overflow-hidden p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-center text-xl font-semibold">
              Adjust Your Album Cover
            </DialogTitle>
          </DialogHeader>
          {/* 💻 DESKTOP LAYOUT */}
          <div className="hidden h-[80vh] lg:flex">
            {/* Left: Cropper */}
            <div className="relative flex-1 bg-gray-100">
              {preview && showCropper && (
                <div className="absolute inset-0">
                  <Cropper
                    image={preview}
                    crop={crop}
                    zoom={zoom}
                    rotation={rotation}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                    showGrid={true}
                    cropShape="rect"
                    objectFit="contain"
                    minZoom={1}
                    maxZoom={
                      imageSize
                        ? getMaxZoom(imageSize.width, imageSize.height)
                        : 3
                    }
                  />
                </div>
              )}
            </div>

            {/* Right: Controls */}
            <div className="w-[320px] space-y-6 overflow-y-auto border-l border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Adjust Your Album Cover
              </h2>
              <p className="text-sm text-gray-500">
                Crop, zoom, and rotate your image to fit the required
                dimensions.
              </p>

              {/* Zoom */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">Zoom</span>
                  <span className="text-sm text-gray-500">
                    {(zoom * 10).toFixed(1)}x
                  </span>
                </div>
                <Slider
                  value={[zoom]}
                  min={1}
                  max={
                    imageSize
                      ? getMaxZoom(imageSize.width, imageSize.height)
                      : 3
                  }
                  step={0.01}
                  onValueChange={(value) => setZoom(value[0])}
                  className="w-full"
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setZoom(1);
                    setCrop({ x: 0, y: 0 });
                    setRotation(0);
                  }}
                >
                  Reset
                </Button>
                <Button variant="outline" onClick={handleRotate}>
                  <RotateCw className="mr-2 h-4 w-4" />
                  Rotate 90°
                </Button>
              </div>

              {/* Footer */}
              <div className="gap-4 pt-4">
                <Button className="mb-4 w-full" onClick={handleUpload}>
                  Continue
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowCropDialog(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>

          {/* 📱 MOBILE LAYOUT */}
          <div className="relative flex h-[90vh] flex-col bg-black text-white lg:hidden">
            {/* Top bar */}
            <div className="z-10 flex items-center justify-between bg-black/80 px-4 py-3">
              <Button
                variant="ghost"
                className="text-sm text-white"
                onClick={() => {
                  setZoom(1);
                  setCrop({ x: 0, y: 0 });
                  setRotation(0);
                }}
              >
                Reset
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  className="text-white"
                  onClick={handleRotate}
                >
                  <RotateCw className="h-4 w-4" /> Rotate
                </Button>
              </div>

              <Button
                variant="ghost"
                className=""
                onClick={() => setShowCropDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="ghost"
                className=""
                onClick={() => setShowCropDialog(false)}
              >
                Continue
              </Button>
            </div>
            {/* Bottom slider */}
            <div className="bg-black/80 px-4 py-3">
              <p className="mb-3 font-semibold">Zoom</p>
              <Slider
                value={[zoom]}
                min={1}
                max={
                  imageSize ? getMaxZoom(imageSize.width, imageSize.height) : 3
                }
                step={0.01}
                onValueChange={(value) => setZoom(value[0])}
                className="w-full"
              />
            </div>

            {/* Fullscreen Cropper */}
            <div className="relative flex-1">
              {preview && (
                <div className="absolute inset-0">
                  <Cropper
                    image={preview}
                    crop={crop}
                    zoom={zoom}
                    rotation={rotation}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                    showGrid={false}
                    cropShape="rect"
                    objectFit="contain"
                    minZoom={1}
                    maxZoom={
                      imageSize
                        ? getMaxZoom(imageSize.width, imageSize.height)
                        : 3
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Preview after upload */}
      <Dialog open={showFullPreview} onOpenChange={setShowFullPreview}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Preview Image</DialogTitle>
          </DialogHeader>
          <div className="mt-4 flex justify-center">
            {preview && (
              <img
                src={croppedImage || preview}
                alt="Full Preview"
                className="max-h-[70vh] max-w-full rounded-md object-contain"
              />
            )}
          </div>

          <Button
            variant="outline"
            onClick={() => setShowFullPreview(false)}
            className="mt-4"
          >
            Close Preview
          </Button>
        </DialogContent>
      </Dialog>

      {/* Requirements Dialog */}
      <Dialog open={showRequirements} onOpenChange={setShowRequirements}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Image requirements</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4 text-sm">
            <p>
              We highly recommend you supply cover art at a minimum of 3000 x
              3000 pixels.
            </p>

            <p>
              Verify the text on your artwork is identical to the metadata for
              this release.
            </p>

            <p>
              Changes to your cover art are allowed until the release is
              approved for distribution—after that, no changes are allowed.
            </p>

            <div>
              <h4 className="mb-2 font-medium">
                Album cover art file requirements:
              </h4>
              <ul className="list-disc space-y-1 pl-5">
                <li>JPG or PNG format (RBG)</li>
                <li>Minimum of 1400 x 1400 pixels</li>
                <li>Maximum of 6000 x 6000 pixels</li>
              </ul>
            </div>

            <div>
              <h4 className="mb-2 font-medium">
                Please ensure your album cover does not contain any of the
                following:
              </h4>
              <ul className="list-disc space-y-1 pl-5">
                <li>Blurry or pixelated images</li>
                <li>Copyrighted images</li>
                <li>Scans of CDs</li>
                <li>Pornographic imagery</li>
                <li>Website URLs</li>
                <li>Contact information</li>
                <li>Pricing information</li>
                <li>UPC barcodes</li>
              </ul>
            </div>
          </div>

          <Button onClick={() => setShowRequirements(false)} className="mt-4">
            Got it
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ArtUploader;
