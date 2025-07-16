import { Address } from "../value-objects/Address";
import { ContactInfo } from "../value-objects/ContactInfo";
import { Policies } from "../value-objects/Policies";
import { Currencies } from "../value-objects/Currencies";
import { CreatePropertyDTO } from "../../dto/PropertyDTO";

export class Property {
  public id: number;
  public propertyName: string;
  public address: Address;
  public contactInfo: ContactInfo;
  public policies: Policies;
  public currencies: Currencies;
  public description: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(
    id: number,
    propertyName: string,
    address: Address,
    contactInfo: ContactInfo,
    policies: Policies,
    currencies: Currencies,
    description: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.propertyName = propertyName;
    this.address = address;
    this.contactInfo = contactInfo;
    this.policies = policies;
    this.currencies = currencies;
    this.description = description;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromDTO(dto: CreatePropertyDTO): Property {
    return new Property(
      dto.id,
      dto.propertyName,
      dto.address,
      dto.contactInfo,
      dto.policies,
      dto.currencies,
      dto.description,
      dto.createdAt,
      dto.updatedAt,
    );
  }
}
