/**
 * ImageKit and Image Sync Type Definitions
 * Shared types for ImageKit integration and Google Drive sync
 */

/**
 * ImageKit Configuration
 */
export interface ImageKitConfig {
  publicKey: string;
  privateKey: string;
  urlEndpoint: string;
}

/**
 * Image Transformation Options
 */
export interface ImageTransformation {
  width?: number;
  height?: number;
  quality?: number;
  format?: "webp" | "jpg" | "jpeg" | "png" | "gif";
  crop?: "maintain_ratio" | "force" | "at_least" | "at_max";
  cropMode?: "resize" | "extract";
  x?: number;
  y?: number;
  focus?: "auto" | "face" | "center";
  bg?: string;
  border?: string;
  radius?: number;
  overlay?: string;
  underlay?: string;
  defaultImage?: string;
  dpr?: number;
  page?: number;
  delay?: number;
  density?: number;
  flags?: string[];
  metadata?: boolean;
  rawMetadata?: boolean;
  colorProfile?: boolean;
  minCache?: number;
  maxCache?: number;
  effectSharpen?: boolean;
  effectUSM?: {
    radius: number;
    sigma: number;
    amount: number;
    threshold: number;
  };
  effectNegative?: boolean;
  effectGrayscale?: boolean;
  original?: boolean;
  tr?: string;
}

/**
 * ImageKit Upload Options
 */
export interface UploadOptions {
  file: Buffer | string;
  fileName: string;
  folder?: string;
  overwrite?: boolean;
  tags?: string[];
  isPrivateFile?: boolean;
  customMetadata?: Record<string, string>;
  responseFields?: string[];
  extensions?: Array<{
    name: string;
    params?: Record<string, unknown>;
  }>;
}

/**
 * ImageKit Upload Result
 */
export interface ImageKitUploadResult {
  fileId: string;
  name: string;
  size: number;
  versionInfo: {
    id: string;
    name: string;
  };
  filePath: string;
  url: string;
  fileType: string;
  mime: string;
  isPrivateFile: boolean;
  customMetadata: Record<string, string> | null;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  AITags: null;
  versionCloak: null;
  isArchived: boolean;
  archiveScheduledAt: null;
  type: string;
  metadata?: {
    width: number;
    height: number;
  };
}

/**
 * Google Drive Image File
 */
export interface GoogleDriveImageFile {
  id: string;
  name: string;
  mimeType: string;
  size: string;
  webContentLink: string;
  createdTime: string;
  modifiedTime: string;
}

/**
 * Sync Operation Result
 */
export interface SyncOperationResult {
  success: boolean;
  fileName: string;
  filePath: string;
  driveFileId: string;
  imagekitFileId?: string;
  skipped: boolean;
  skipReason?: string;
  error?: string;
  uploadTime?: number;
  fileSize: number;
}

/**
 * Sync Summary Statistics
 */
export interface SyncSummary {
  startTime: string;
  endTime: string;
  totalDuration: number;
  filesFound: number;
  filesUploaded: number;
  filesSkipped: number;
  filesFailed: number;
  totalBytesUploaded: number;
  errors: string[];
}

/**
 * Sync Results Report
 */
export interface SyncResultsReport {
  summary: SyncSummary;
  results: SyncOperationResult[];
  version: string;
  timestamp: string;
}

/**
 * ProductImage Component Props
 */
export interface ProductImageProps {
  path: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  transformation?: ImageTransformation[];
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Image Sync Configuration
 */
export interface ImageSyncConfig {
  driveFolderId: string;
  imagekitFolder: string;
  skipExisting: boolean;
  delayBetweenUploads: number;
  maxConcurrent: number;
  imageTypes: string[];
}

/**
 * Image Sync Progress
 */
export interface ImageSyncProgress {
  current: number;
  total: number;
  percentage: number;
  currentFileName: string;
  status: "idle" | "syncing" | "completed" | "failed";
  message: string;
}
