import { GeneralPolicies } from "./GeneralPolicies";
import { MinorPolicies } from "./MinorPolicies";
import { OtherPolicies } from "./OtherPolicies";
import { PaymentPolicies } from "./PaymentPolicies";

export class Policies {
  constructor(
    public readonly general: GeneralPolicies,
    public readonly payment: PaymentPolicies,
    public readonly minor: MinorPolicies,
    public readonly other: OtherPolicies,
  ) {
    this.general = general;
    this.payment = payment;
    this.minor = minor;
    this.other = other;
  }

  static fromDTO(dto: {
    generalPolicies: GeneralPolicies;
    paymentPolicies: PaymentPolicies;
    minorPolicies: MinorPolicies;
    otherPolicies: OtherPolicies;
  }): Policies {
    return new Policies(
      dto.generalPolicies,
      dto.paymentPolicies,
      dto.minorPolicies,
      dto.otherPolicies,
    );
  }
}
