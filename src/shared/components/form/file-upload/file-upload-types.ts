export interface UploadedFileProps
  extends React.HTMLAttributes<HTMLDivElement> {
  file: File;
  index: number;
  onRemove: (index: number) => void;
  showPreview?: boolean;
}

export interface FilePreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  file: File;
  size?: 'sm' | 'md' | 'lg';
}

export interface FileUploadState {
  files: File[];
  isDragActive: boolean;
  isDragReject: boolean;
  isUploading: boolean;
}

export type FileType =
  | 'image'
  | 'pdf'
  | 'document'
  | 'audio'
  | 'video'
  | 'archive'
  | 'spreadsheet'
  | 'other';

export interface FileTypeInfo {
  type: FileType;
  icon: string;
  color: string;
}
