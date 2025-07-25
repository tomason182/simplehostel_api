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
import { IAddressRepository } from "../domain/ports/IAddressRepository";
import { IContactInfoRepository } from "../domain/ports/IContactInfoRepository";

import { AddressDTO } from "../dto/AddressDTO";
import { ContactInfoDTO } from "../dto/ContactInfoDTO";
import {
  GeneralPoliciesDTO,
  MinorPoliciesDTO,
  OtherPoliciesDTO,
} from "../dto/PoliciesDTO";

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

  async updatePropertyFacilities(
    propertyId: number,
    submittedFacilitiesIds: Array<number>,
  ): Promise<{ status: string; msg: string }> {
    // Iniciar un transaccción. PropertyService.prototype.updatePropertyFacilities.useTransacction = true;

    // 1. Validar que la propiedad existe.
    const property = await this.propertyRepository.findById(propertyId);
    if (property === null) {
      return { status: "error", msg: "PROPERTY_NOT_FOUND" };
    }

    // 2. Validar que todas las facilities sean validas.
    if (submittedFacilitiesIds.length > 0) {
      const allExist = await this.facilityRepository.doAllExist(
        submittedFacilitiesIds,
      );

      if (allExist.length === 0) {
        return {
          status: "error",
          msg: "INVALID_FACILITIES_IDS",
        };
      }
    }

    // 3. Obtener el listado de facilities actuales de la propiedad.
    const currentFacilitiesIds =
      await this.facilityRepository.getFacilitiesIdsForProperty(propertyId);

    // 4. Calcular diferencias.
    const idsToAdd = submittedFacilitiesIds.filter(
      (id) => !currentFacilitiesIds.includes(id),
    );
    const idsToRemove = currentFacilitiesIds.filter(
      (id) => !submittedFacilitiesIds.includes(id),
    );

    // 5. Aplicar cambios
    if (idsToAdd.length > 0) {
      await this.facilityRepository.addFacilitiesToProperty(
        propertyId,
        idsToAdd,
      );
    }

    if (idsToRemove.length > 0) {
      await this.facilityRepository.removeFacilitiesFromProperty(
        propertyId,
        idsToRemove,
      );
    }

    return {
      status: "ok",
      msg: "FACILITIES_UPDATED",
    };
  }

  async updateDescription(
    propertyId: number,
    description: string,
  ): Promise<{ status: string; msg: string }> {
    const property = await this.propertyRepository.findById(propertyId);

    if (property === null) {
      return {
        status: "error",
        msg: "PROPERTY_NOT_FOUND",
      };
    }

    property.setDescription(description);

    await this.propertyRepository.updateDescription(property);

    return {
      status: "ok",
      msg: "PROPERTY_UPDATED",
    };
  }

  async updateGeneralPolicies(
    propertyId: number,
    generalPoliciesDTO: GeneralPoliciesDTO,
  ): Promise<{ status: string; msg: string }> {
    const generalPolicies = new GeneralPolicies(
      generalPoliciesDTO.minLengthStay,
      generalPoliciesDTO.maxLengthStay,
      generalPoliciesDTO.minAdvanceBooking,
      generalPoliciesDTO.breakfastIncluded,
      generalPoliciesDTO.checkInFrom,
      generalPoliciesDTO.checkInUntil,
      generalPoliciesDTO.checkOutFrom,
      generalPoliciesDTO.checkOutUntil,
    );

    await this.policiesRepository.saveGeneralPolicies(
      propertyId,
      generalPolicies,
    );

    return {
      status: "ok",
      msg: "POLICIES_UPDATED",
    };
  }

  async updateMinorPolicies(
    propertyId: number,
    minorPoliciesDTO: MinorPoliciesDTO,
  ): Promise<{ status: string; msg: string }> {
    const minorPolicies = MinorPolicies.fromDTO(minorPoliciesDTO);

    await this.policiesRepository.saveMinorPolicies(propertyId, minorPolicies);

    return {
      status: "ok",
      msg: "POLICIES_UPDATED",
    };
  }

  async updateOtherPolicies(
    propertyId: number,
    otherPoliciesDTO: OtherPoliciesDTO,
  ): Promise<{ status: string; msg: string }> {
    const otherPolicies = OtherPolicies.fromDTO(otherPoliciesDTO);

    await this.policiesRepository.saveOtherPolicies(propertyId, otherPolicies);

    return {
      status: "ok",
      msg: "POLICIES_UPDATED",
    };
  }
}

(PropertyService.prototype.updatePropertyFacilities as any).useTransaction =
  true;
