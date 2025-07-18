import { PropertyImageDTO } from "../../dto/PropertyImageDTO";

export class PropertyImage {
  constructor(
    public readonly id: number | null,
    public readonly propertyId: number,
    public readonly filename: string,
    public readonly mimetype: string,
    public readonly altText: string | null,
    public readonly sizeBytes: number,
    public readonly path: string,
    public isPrimary: boolean,
    public readonly createdAt: Date | null,
  ) {
    this.id = id;
    this.propertyId = propertyId;
    this.filename = filename;
    this.mimetype = mimetype;
    this.altText = altText;
    this.sizeBytes = sizeBytes;
    this.path = path;
    this.isPrimary = isPrimary;
    this.createdAt = createdAt;
  }

  // Métodos de clase
  static fromDTO(dto: PropertyImageDTO): PropertyImage {
    return new PropertyImage(
      dto.id,
      dto.propertyId,
      dto.filename,
      dto.mimetype,
      dto.altText,
      dto.sizeBytes,
      dto.path,
      dto.isPrimary,
      dto.createdAt,
    );
  }

  // Métodos de dominio
  markAsPrimary() {
    this.isPrimary = true;
  }

  // Getters
  getId(): number | null {
    return this.id;
  }
  getPropertyId(): number {
    return this.propertyId;
  }
  getFilename(): string {
    return this.filename;
  }
  getMimeType(): string {
    return this.mimetype;
  }
  getAltText(): string | null {
    return this.altText;
  }
  getSizeBytes(): number {
    return this.sizeBytes;
  }
  getPath(): string {
    return this.path;
  }
  getIsPrimary(): boolean {
    return this.isPrimary;
  }
}
