import { PropertyImage } from "../entities/PropertyImage";

export interface IPropertyImageRepository {
  findAllPropertyImages(propertyId: number): Promise<Array<PropertyImage>>;

  save(images: Array<PropertyImage>): Promise<void>;
}
