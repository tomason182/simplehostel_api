import { OtherPoliciesDTO } from "../../dto/PoliciesDTO";

export class OtherPolicies {
  constructor(
    public readonly quietHoursFrom: string,
    public readonly quietHoursUntil: string,
    public readonly hasSmokingAreas: boolean,
    public readonly allowExternalGuest: boolean,
    public readonly allowPets: boolean,
  ) {
    this.quietHoursFrom = quietHoursFrom;
    this.quietHoursUntil = quietHoursUntil;
    this.hasSmokingAreas = hasSmokingAreas;
    this.allowExternalGuest = allowExternalGuest;
    this.allowPets = allowPets;
  }

  static fromDTO(dto: OtherPoliciesDTO): OtherPolicies {
    return new OtherPolicies(
      dto.quietHoursFrom,
      dto.quietHoursUntil,
      dto.hasSmokingAreas,
      dto.allowExternalGuest,
      dto.allowPets,
    );
  }
}
