import { Property } from "../domain/entities/Property";
import { Address } from "../domain/value-objects/Address";
import { ContactInfo } from "../domain/value-objects/ContactInfo";
import { GeneralPolicies } from "../domain/value-objects/GeneralPolicies";
import { MinorPolicies } from "../domain/value-objects/MinorPolicies";
import { OtherPolicies } from "../domain/value-objects/OtherPolicies";
import { Policies } from "../domain/value-objects/Policies";

import { IPropertyRepository } from "../domain/ports/IPropertyRepository";
import { IFacilityRepository } from "../domain/ports/IFacilityRepository";
import { IPoliciesRepository } from "../domain/ports/IPoliciesRepository";
import { AddressDTO } from "../dto/AddressDTO";
import { IAddressRepository } from "../domain/ports/IAddressRepository";
import { ContactInfoDTO } from "../dto/ContactInfoDTO";
import { IContactInfoRepository } from "../domain/ports/IContactInfoRepository";

export class PropertyService {
  constructor(
    private propertyRepository: IPropertyRepository,
    private facilityRepository: IFacilityRepository,
    private policiesRepository: IPoliciesRepository,
    private addressRepository: IAddressRepository,
    private contactInfoRepository: IContactInfoRepository,
  ) {
    this.propertyRepository = propertyRepository;
    this.facilityRepository = facilityRepository;
    this.policiesRepository = policiesRepository;
    this.addressRepository = addressRepository;
    this.contactInfoRepository = contactInfoRepository;
  }

  // Método para devolver el componente Propiedad de la app (tabla property, address, contact_info)
  async getPropertyDetails(propertyId: number): Promise<Property | null> {
    const property =
      await this.propertyRepository.findPropertyDetails(propertyId);

    if (!property) {
      return null;
    }

    return property;
  }

  // Método para devolver las "Facilities" de la propiedad
  async getPropertyFacilities(
    propertyId: number,
  ): Promise<{ status: string; msg: Array<number> }> {
    const facilities =
      await this.facilityRepository.getFacilitiesIdsForProperty(propertyId);

    return {
      status: "ok",
      msg: facilities,
    };
  }

  // Método para devolver las políticas de la propiedad
  async getPropertyPolicies(propertyId: number): Promise<Policies | null> {
    const policies = await this.policiesRepository.findByPropertyId(propertyId);

    if (!policies) {
      return null;
    }

    return policies;
  }

  // Método para actualizar la ubicación
  async updateLocation(
    propertyId: number,
    addressDTO: AddressDTO,
  ): Promise<{ status: string; msg: string }> {
    // 1. Buscamos la propiedad.
    const property = await this.propertyRepository.findById(propertyId);

    if (property === null) {
      return {
        status: "error",
        msg: "PROPERTY_NOT_FOUND",
      };
    }

    // 2. Creamos el objeto Address
    const address = Address.fromDTO(addressDTO);

    // 3. Guardamos los cambios
    await this.addressRepository.save(propertyId, address);

    return {
      status: "ok",
      msg: "PROPERTY_UPDATED",
    };
  }

  async updateContactInfo(
    propertyId: number,
    contactInfoDTO: ContactInfoDTO,
  ): Promise<{ status: string; msg: string }> {
    // 1. Crear el value object para contactInfo
    const contactInfo = ContactInfo.fromDTO(contactInfoDTO);

    // 2. Guardar contact info
    await this.contactInfoRepository.save(propertyId, contactInfo);

    return {
      status: "ok",
      msg: "PROPERTY_UPDATED",
    };
  }
}
