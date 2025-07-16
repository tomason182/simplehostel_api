import { PaymentPoliciesDTO } from "../../dto/PoliciesDTO";

export class PaymentPolicies {
  constructor(
    public readonly advancePaymentRequired: boolean,
    public readonly depositAmount: number,
  ) {
    this.advancePaymentRequired = advancePaymentRequired;
    this.depositAmount = depositAmount;

    if (depositAmount < 0) {
      throw new Error("Deposit amount must be a positive number");
    }
  }

  static fromDTO(dto: PaymentPoliciesDTO): PaymentPolicies {
    return new PaymentPolicies(dto.advancePaymentRequired, dto.depositAmount);
  }
}
