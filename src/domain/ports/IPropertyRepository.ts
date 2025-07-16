import { Property } from "../entities/Property";

export interface IPropertyRepository {
  save(property: Property): Promise<void>;
}
