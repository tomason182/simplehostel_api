import { AddressDTO } from "../../dto/AddressDTO";

export class Address {
  public readonly houseNumber: string;
  public readonly street: string;
  public readonly city: string;
  public readonly postalCode: string;
  public readonly state: string;
  public readonly country: string;
  public readonly countryCode: string;
  public readonly lat: number;
  public readonly lon: number;
  public readonly osmId: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(
    houseNumber: string,
    street: string,
    city: string,
    postalCode: string,
    state: string,
    country: string,
    countryCode: string,
    lat: number,
    lon: number,
    osmId: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.houseNumber = houseNumber;
    this.street = street;
    this.city = city;
    this.postalCode = postalCode;
    this.state = state;
    this.country = country;
    this.countryCode = countryCode;
    this.lat = lat;
    this.lon = lon;
    this.osmId = osmId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromDTO(data: AddressDTO): Address {
    return new Address(
      data.houseNumber,
      data.street,
      data.city,
      data.postalCode,
      data.state,
      data.country,
      data.countryCode,
      data.lat,
      data.lon,
      data.osmId,
      data.createdAt,
      data.updatedAt,
    );
  }

  toDTO(): AddressDTO {
    return {
      houseNumber: this.houseNumber,
      street: this.street,
      city: this.city,
      postalCode: this.postalCode,
      state: this.state,
      country: this.country,
      countryCode: this.countryCode,
      lat: this.lat,
      lon: this.lon,
      osmId: this.osmId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
