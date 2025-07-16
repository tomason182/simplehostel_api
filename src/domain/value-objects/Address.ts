import { AddressDTO } from "../../dto/AddressDTO";

export class Address {
  public houseNumber: string;
  public street: string;
  public city: string;
  public postalCode: string;
  public state: string;
  public country: string;
  public countryCode: string;
  public lat: number;
  public lon: number;
  public osmId: string;

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
    );
  }
}
