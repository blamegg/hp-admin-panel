export interface Asset {
  _id: string;
  url: string;
  originalName: string;
  filename: string;
  mimetype: string;
  size: number;
  tags: string[];
  uploadedBy: string;
  createdAt: string;
  [key: string]: any; // for any extra fields
}

export interface AssetUploadResponse {
  success: boolean;
  data?: Asset;
  message?: string;
}

export interface AssetSearchParams {
  query?: string;
  type?: string;
  tags?: string[];
  page?: number;
  limit?: number;
} 