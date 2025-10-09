import type { FileTypeInfo } from '../file-upload-types';

/**
 * Gets file type information based on file extension
 */
export const getFileTypeInfo = (file: File): FileTypeInfo => {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
  const mimeType = file.type.toLowerCase();

  // Image files
  if (
    mimeType.startsWith('image/') ||
    ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'].includes(
      extension
    )
  ) {
    return {
      type: 'image',
      icon: 'Image',
      color: 'text-green-600',
    };
  }

  // PDF files
  if (extension === 'pdf' || mimeType === 'application/pdf') {
    return {
      type: 'pdf',
      icon: 'FileText',
      color: 'text-red-600',
    };
  }

  // Document files
  if (
    ['doc', 'docx', 'txt', 'rtf', 'odt'].includes(extension) ||
    mimeType.includes('document') ||
    mimeType.includes('text/plain')
  ) {
    return {
      type: 'document',
      icon: 'FileText',
      color: 'text-blue-600',
    };
  }

  // Audio files
  if (
    mimeType.startsWith('audio/') ||
    ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma'].includes(extension)
  ) {
    return {
      type: 'audio',
      icon: 'Music',
      color: 'text-purple-600',
    };
  }

  // Video files
  if (
    mimeType.startsWith('video/') ||
    ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'].includes(extension)
  ) {
    return {
      type: 'video',
      icon: 'Video',
      color: 'text-orange-600',
    };
  }

  // Archive files
  if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2'].includes(extension)) {
    return {
      type: 'archive',
      icon: 'Archive',
      color: 'text-yellow-600',
    };
  }

  // Spreadsheet files
  if (
    ['xls', 'xlsx', 'csv', 'ods'].includes(extension) ||
    mimeType.includes('spreadsheet')
  ) {
    return {
      type: 'spreadsheet',
      icon: 'Sheet',
      color: 'text-emerald-600',
    };
  }

  // Default for unknown files
  return {
    type: 'other',
    icon: 'File',
    color: 'text-gray-600',
  };
};
