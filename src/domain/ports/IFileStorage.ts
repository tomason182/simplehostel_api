export interface IFileStorage {
  save(
    buffer: Buffer,
    filename: string,
    destinationFolder: string,
  ): Promise<{ publicUrl: string; relativeUrl: string }>;
}
