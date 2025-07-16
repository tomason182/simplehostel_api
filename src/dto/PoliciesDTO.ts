export interface GeneralPoliciesDTO {
  minLengthStay: number;
  maxLengthStay: number;
  minAdvanceBooking: number;
  breakfastIncluded: boolean;
  checkInFrom: string;
  checkInUntil: string;
  checkOutFrom: string;
  checkOutUntil: string;
}

export interface PaymentPoliciesDTO {
  advancePaymentRequired: boolean;
  depositAmount: number;
}

export interface MinorPoliciesDTO {
  minCheckInAge: number;
  acceptChildrens: boolean;
  minorsAdultSupervision: boolean;
  minChildAge: number;
  freeStayAge: number;
}

export interface OtherPoliciesDTO {
  quietHoursFrom: string;
  quietHoursUntil: string;
  hasSmokingAreas: boolean;
  allowExternalGuest: boolean;
  allowPets: boolean;
}
