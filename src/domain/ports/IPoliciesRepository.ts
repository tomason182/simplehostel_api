import { GeneralPolicies } from "../value-objects/GeneralPolicies";
import { MinorPolicies } from "../value-objects/MinorPolicies";
import { OtherPolicies } from "../value-objects/OtherPolicies";
import { Policies } from "../value-objects/Policies";

export interface IPoliciesRepository {
  findByPropertyId(propertyId: number): Promise<Policies>;

  saveGeneralPolicies(
    propertyId: number,
    generalPolicies: GeneralPolicies,
  ): Promise<void>;

  saveMinorPolicies(
    propertyId: number,
    minorPolicies: MinorPolicies,
  ): Promise<void>;

  saveOtherPolicies(
    propertyId: number,
    otherPolicies: OtherPolicies,
  ): Promise<void>;
}
