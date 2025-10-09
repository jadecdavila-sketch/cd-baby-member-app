'use client';

import {
  Archive,
  File,
  FileText,
  Image,
  Music,
  Sheet,
  Video,
} from 'lucide-react';
import * as React from 'react';

import { cn } from '@/shared/utils/index';

import type { FilePreviewProps } from '../../file-upload-types';
import {
  createImagePreviewUrl,
  getFileTypeInfo,
  isImageFile,
} from '../../utils';

const iconMap = {
  Archive,
  File,
  FileText,
  Image,
  Music,
  Sheet,
  Video,
};

const FilePreview = React.forwardRef<HTMLDivElement, FilePreviewProps>(
  ({ file, size = 'md', className, ...props }, ref) => {
    const [imagePreviewUrl, setImagePreviewUrl] = React.useState<string | null>(
      null
    );
    const [imageError, setImageError] = React.useState(false);

    // Size configurations
    const sizeConfig = {
      sm: {
        container: 'h-8 w-8',
        icon: 'h-4 w-4',
      },
      md: {
        container: 'h-12 w-12',
        icon: 'h-6 w-6',
      },
      lg: {
        container: 'h-16 w-16',
        icon: 'h-8 w-8',
      },
    };

    const config = sizeConfig[size];
    const fileTypeInfo = getFileTypeInfo(file);

    // Create image preview URL for image files
    React.useEffect(() => {
      if (isImageFile(file) && !imageError) {
        try {
          const url = createImagePreviewUrl(file);
          setImagePreviewUrl(url);

          // Cleanup URL on unmount
          return () => {
            URL.revokeObjectURL(url);
          };
        } catch (error) {
          console.warn('Failed to create image preview:', error);
          setImageError(true);
        }
      }

      return undefined;
    }, [file, imageError]);

    const handleImageError = () => {
      setImageError(true);
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
        setImagePreviewUrl(null);
      }
    };

    // Show image preview if available and no error
    if (imagePreviewUrl && !imageError) {
      return (
        <div
          ref={ref}
          className={cn(
            'border-border bg-muted overflow-hidden rounded-md border',
            config.container,
            className
          )}
          {...props}
        >
          {/* eslint-disable-next-line @next/next/no-img-element*/}
          <img
            src={imagePreviewUrl}
            alt={`Preview of ${file.name}`}
            className="h-full w-full object-cover"
            onError={handleImageError}
          />
        </div>
      );
    }

    // Show file type icon
    const IconComponent =
      iconMap[fileTypeInfo.icon as keyof typeof iconMap] || File;

    return (
      <div
        ref={ref}
        className={cn(
          'border-border bg-muted flex items-center justify-center rounded-md border',
          config.container,
          className
        )}
        {...props}
      >
        <IconComponent
          className={cn(config.icon, fileTypeInfo.color)}
          aria-hidden={true}
          data-testid="file-icon"
        />
      </div>
    );
  }
);

FilePreview.displayName = 'FilePreview';

export { FilePreview };
