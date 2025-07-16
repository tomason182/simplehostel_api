import { Address } from "../domain/value-objects/Address";
import { ContactInfo } from "../domain/value-objects/ContactInfo";
import { Policies } from "../domain/value-objects/Policies";
import { Currencies } from "../domain/value-objects/Currencies";

export interface CreatePropertyDTO {
  propertyName: string;
}

export interface PropertyDTO {
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
