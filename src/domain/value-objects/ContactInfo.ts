import { ContactInfoDTO } from "../../dto/ContactInfoDTO";

export class ContactInfo {
  public email: string;
  public phoneCallsCode: string;
  public phoneCalls: string;
  public phoneWhatsappCode: string;
  public phoneWhatsApp: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(
    email: string,
    phoneCallsCode: string,
    phoneCalls: string,
    phoneWhatsappCode: string,
    phoneWhatsapp: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.email = email;
    this.phoneCallsCode = phoneCallsCode;
    this.phoneCalls = phoneCalls;
    this.phoneWhatsappCode = phoneWhatsappCode;
    this.phoneWhatsApp = phoneWhatsapp;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromDTO(data: ContactInfoDTO): ContactInfo {
    return new ContactInfo(
      data.email,
      data.phoneCallsCode,
      data.phoneCalls,
      data.phoneCallsCode,
      data.phoneWhatsapp,
      data.createdAt,
      data.updatedAt,
    );
  }

  toDto(): ContactInfoDTO {
    return {
      email: this.email,
      phoneCallsCode: this.phoneCallsCode,
      phoneCalls: this.phoneCalls,
      phoneWhatsappCode: this.phoneWhatsApp,
      phoneWhatsapp: this.phoneWhatsApp,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
