import { Address } from "../value-objects/Address";
import { ContactInfo } from "../value-objects/ContactInfo";
import { Policies } from "../value-objects/Policies";
import { Currencies } from "../value-objects/Currencies";
import { CreatePropertyDTO, PropertyDTO } from "../../dto/PropertyDTO";

export class Property {
  public id: number | null;
  public propertyName: string;
  public address: Address | null;
  public contactInfo: ContactInfo | null;
  public policies: Policies | null;
  public currencies: Currencies | null;
  public description: string | null;
  public createdAt: Date | null;
  public updatedAt: Date | null;

  constructor(
    id: number | null,
    propertyName: string,
    address: Address | null,
    contactInfo: ContactInfo | null,
    policies: Policies | null,
    currencies: Currencies | null,
    description: string | null,
    createdAt: Date | null,
    updatedAt: Date | null,
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

  static fromDTO(dto: PropertyDTO): Property {
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

  static fromCreatePropertyDTO(dto: CreatePropertyDTO): Property {
    return new Property(
      null,
      dto.propertyName,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    );
  }

  // Getters and Setters
  getId(): number {
    const id = this.id;

    if (!id) {
      throw new Error("Property id is not setted");
    }

    return id;
  }
}
