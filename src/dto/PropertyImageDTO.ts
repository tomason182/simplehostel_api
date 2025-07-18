export interface PropertyImageDTO {
  id: number | null;
  propertyId: number;
  filename: string;
  mimetype: string;
  altText: string | null;
  sizeBytes: number;
  path: string;
  isPrimary: boolean;
  createdAt: Date | null;
}
