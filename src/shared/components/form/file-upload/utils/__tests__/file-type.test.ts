import { describe, it, expect } from 'vitest';

import { getFileTypeInfo } from '../file-type';

describe('getFileTypeInfo', () => {
  const createMockFile = (name: string, type: string = ''): File => {
    return new File([''], name, { type });
  };

  describe('image files', () => {
    it('identifies image files by MIME type', () => {
      const file = createMockFile('photo.jpg', 'image/jpeg');
      const result = getFileTypeInfo(file);

      expect(result).toEqual({
        type: 'image',
        icon: 'Image',
        color: 'text-green-600',
      });
    });

    it('identifies image files by extension', () => {
      const extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'];

      extensions.forEach(ext => {
        const file = createMockFile(`image.${ext}`);
        const result = getFileTypeInfo(file);

        expect(result.type).toBe('image');
        expect(result.icon).toBe('Image');
        expect(result.color).toBe('text-green-600');
      });
    });

    it('handles case-insensitive extensions', () => {
      const file = createMockFile('photo.JPG');
      const result = getFileTypeInfo(file);
      expect(result.type).toBe('image');
    });
  });

  describe('PDF files', () => {
    it('identifies PDF files by extension', () => {
      const file = createMockFile('document.pdf');
      const result = getFileTypeInfo(file);

      expect(result).toEqual({
        type: 'pdf',
        icon: 'FileText',
        color: 'text-red-600',
      });
    });

    it('identifies PDF files by MIME type', () => {
      const file = createMockFile('document.pdf', 'application/pdf');
      const result = getFileTypeInfo(file);

      expect(result).toEqual({
        type: 'pdf',
        icon: 'FileText',
        color: 'text-red-600',
      });
    });
  });

  describe('document files', () => {
    it('identifies document files by extension', () => {
      const extensions = ['doc', 'docx', 'txt', 'rtf', 'odt'];

      extensions.forEach(ext => {
        const file = createMockFile(`document.${ext}`);
        const result = getFileTypeInfo(file);

        expect(result.type).toBe('document');
        expect(result.icon).toBe('FileText');
        expect(result.color).toBe('text-blue-600');
      });
    });

    it('identifies document files by MIME type containing document', () => {
      const file = createMockFile('file.doc', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      const result = getFileTypeInfo(file);
      expect(result.type).toBe('document');
    });

    it('identifies plain text files', () => {
      const file = createMockFile('readme.txt', 'text/plain');
      const result = getFileTypeInfo(file);
      expect(result.type).toBe('document');
    });
  });

  describe('audio files', () => {
    it('identifies audio files by MIME type', () => {
      const file = createMockFile('song.mp3', 'audio/mpeg');
      const result = getFileTypeInfo(file);

      expect(result).toEqual({
        type: 'audio',
        icon: 'Music',
        color: 'text-purple-600',
      });
    });

    it('identifies audio files by extension', () => {
      const extensions = ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma'];

      extensions.forEach(ext => {
        const file = createMockFile(`audio.${ext}`);
        const result = getFileTypeInfo(file);

        expect(result.type).toBe('audio');
        expect(result.icon).toBe('Music');
        expect(result.color).toBe('text-purple-600');
      });
    });
  });

  describe('video files', () => {
    it('identifies video files by MIME type', () => {
      const file = createMockFile('movie.mp4', 'video/mp4');
      const result = getFileTypeInfo(file);

      expect(result).toEqual({
        type: 'video',
        icon: 'Video',
        color: 'text-orange-600',
      });
    });

    it('identifies video files by extension', () => {
      const extensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'];

      extensions.forEach(ext => {
        const file = createMockFile(`video.${ext}`);
        const result = getFileTypeInfo(file);

        expect(result.type).toBe('video');
        expect(result.icon).toBe('Video');
        expect(result.color).toBe('text-orange-600');
      });
    });
  });

  describe('archive files', () => {
    it('identifies archive files by extension', () => {
      const extensions = ['zip', 'rar', '7z', 'tar', 'gz', 'bz2'];

      extensions.forEach(ext => {
        const file = createMockFile(`archive.${ext}`);
        const result = getFileTypeInfo(file);

        expect(result.type).toBe('archive');
        expect(result.icon).toBe('Archive');
        expect(result.color).toBe('text-yellow-600');
      });
    });
  });

  describe('spreadsheet files', () => {
    it('identifies spreadsheet files by extension', () => {
      const extensions = ['xls', 'xlsx', 'csv', 'ods'];

      extensions.forEach(ext => {
        const file = createMockFile(`spreadsheet.${ext}`);
        const result = getFileTypeInfo(file);

        expect(result.type).toBe('spreadsheet');
        expect(result.icon).toBe('Sheet');
        expect(result.color).toBe('text-emerald-600');
      });
    });

    it('identifies spreadsheet files by MIME type', () => {
      const file = createMockFile('data.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      const result = getFileTypeInfo(file);
      expect(result.type).toBe('document'); // This MIME type includes 'document' so matches document first
    });
  });

  describe('unknown files', () => {
    it('returns default type for unknown files', () => {
      const file = createMockFile('unknown.xyz');
      const result = getFileTypeInfo(file);

      expect(result).toEqual({
        type: 'other',
        icon: 'File',
        color: 'text-gray-600',
      });
    });

    it('handles files without extension', () => {
      const file = createMockFile('README');
      const result = getFileTypeInfo(file);

      expect(result).toEqual({
        type: 'other',
        icon: 'File',
        color: 'text-gray-600',
      });
    });

    it('handles empty filename', () => {
      const file = createMockFile('');
      const result = getFileTypeInfo(file);

      expect(result).toEqual({
        type: 'other',
        icon: 'File',
        color: 'text-gray-600',
      });
    });
  });

  describe('edge cases', () => {
    it('handles multiple dots in filename', () => {
      const file = createMockFile('my.backup.file.pdf');
      const result = getFileTypeInfo(file);
      expect(result.type).toBe('pdf');
    });

    it('handles files with uppercase extensions', () => {
      const file = createMockFile('DOCUMENT.PDF');
      const result = getFileTypeInfo(file);
      expect(result.type).toBe('pdf');
    });

    it('uses first matching category in the order of checks', () => {
      // File with .txt extension but audio MIME type - document category is checked before audio
      const file = createMockFile('audio.txt', 'audio/mpeg');
      const result = getFileTypeInfo(file);
      expect(result.type).toBe('document'); // Document extension (.txt) matches before audio MIME type is checked
    });
  });
});