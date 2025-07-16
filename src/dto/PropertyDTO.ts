import { Address } from "../domain/value-objects/Address";
import { ContactInfo } from "../domain/value-objects/ContactInfo";
import { Policies } from "../domain/value-objects/Policies";
import { Currencies } from "../domain/value-objects/Currencies";
export interface CreatePropertyDTO {
  id: number;
  propertyName: string;
  description: string;
  address: Address;
  contactInfo: ContactInfo;
  policies: Policies;
  currencies: Currencies;
  createdAt: Date;
  updatedAt: Date;
}
