import { Address } from "../value-objects/Address";

export interface IAddressRepository {
  save(propertyId: number, address: Address): Promise<void>;
}
