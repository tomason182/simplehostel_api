import { PropertyImage } from "../entities/PropertyImage";

export interface IPropertyImageRepository {
  // Buscar todas las imagenes de la propiedad
  findAllPropertyImages(propertyId: number): Promise<Array<PropertyImage>>;

  // Buscar una imagen de la propiedad
  findById(propertyId: number, imageId: number): Promise<PropertyImage>;

  // Guardar imagenes en la base de datos
  save(images: Array<PropertyImage>): Promise<void>;

  // Eliminar imagenes
  delete(imageId: number): Promise<void>;
}
