import { AddressDTO } from "./AddressDTO";
import { ContactInfoDTO } from "./ContactInfoDTO";
import { PoliciesDTO } from "./PoliciesDTO";

export interface CreatePropertyDTO {
  id: number;
  propertyName: string;
  description: string;
  address: AddressDTO;
  contactInfo: ContactInfoDTO;
  policies: PoliciesDTO;
  createdAt: Date;
  updatedAt: Date;
}
