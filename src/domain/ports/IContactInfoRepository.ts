import { ContactInfo } from "../value-objects/ContactInfo";

export interface IContactInfoRepository {
  save(propertyId: number, contactInfo: ContactInfo): Promise<void>;
}
