import { MinorPoliciesDTO } from "../../dto/PoliciesDTO";

export class MinorPolicies {
  constructor(
    public readonly minCheckInAge: number,
    public readonly acceptChildren: boolean,
    public readonly minorsAdultSupervision: boolean,
    public readonly minChildAge: number,
    public readonly freeStayAge: number,
  ) {
    this.minCheckInAge = minCheckInAge;
    this.acceptChildren = acceptChildren;
    this.minorsAdultSupervision = minorsAdultSupervision;
    this.minChildAge = minChildAge;
    this.freeStayAge = freeStayAge;

    if (minCheckInAge < 0 || minChildAge < 0 || freeStayAge < 0) {
      throw new Error("Ages must be non-negative");
    }
  }

  static fromDTO(dto: MinorPoliciesDTO): MinorPolicies {
    return new MinorPolicies(
      dto.minCheckInAge,
      dto.acceptChildren,
      dto.minorsAdultSupervision,
      dto.minChildAge,
      dto.freeStayAge,
    );
  }
}
