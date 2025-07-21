export interface IFileStorage {
  // Guardar imagene en disco
  save(
    buffer: Buffer,
    filename: string,
    destinationFolder: string,
  ): Promise<{ publicUrl: string; relativeUrl: string }>;

  // Eliminar imagen en disco.
  delete(path: string): Promise<void>;
}
