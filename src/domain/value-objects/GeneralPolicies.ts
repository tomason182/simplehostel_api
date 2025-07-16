import { GeneralPoliciesDTO } from "../../dto/PoliciesDTO";

export class GeneralPolicies {
  constructor(
    public readonly minLengthStay: number,
    public readonly maxLengthStay: number,
    public readonly minAdvanceBooking: number,
    public readonly breakfastIncluded: boolean,
    public readonly checkInFrom: string,
    public readonly checkInUntil: string,
    public readonly checkOutFrom: string,
    public readonly checkOutUntil: string,
  ) {
    this.minLengthStay = minLengthStay;
    this.maxLengthStay = maxLengthStay;
    this.minAdvanceBooking = minAdvanceBooking;
    this.breakfastIncluded = breakfastIncluded;
    this.checkInFrom = checkInFrom;
    this.checkInUntil = checkInUntil;
    this.checkOutFrom = checkOutFrom;
    this.checkOutUntil = checkOutUntil;

    if (minLengthStay < 0 || maxLengthStay < 0 || minAdvanceBooking < 0) {
      throw new Error("Values must be non-negative numbers");
    }
  }

  static fromDTO(dto: GeneralPoliciesDTO): GeneralPolicies {
    return new GeneralPolicies(
      dto.minLengthStay,
      dto.maxLengthStay,
      dto.minAdvanceBooking,
      dto.breakfastIncluded,
      dto.checkInFrom,
      dto.checkInUntil,
      dto.checkOutFrom,
      dto.checkOutUntil,
    );
  }
}
