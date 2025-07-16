import { CurrencyDTO } from "../../dto/CurrencyDTO";

export class Currency {
  public baseCurrency: string;
  public paymentCurrency: string;

  constructor(baseCurrency: string, paymentCurrency: string) {
    this.baseCurrency = baseCurrency;
    this.paymentCurrency = paymentCurrency;
  }

  static fromDTO(data: CurrencyDTO): Currency {
    return new Currency(data.baseCurrency, data.paymentCurrency);
  }

  toDTO(): CurrencyDTO {
    return {
      baseCurrency: this.baseCurrency,
      paymentCurrency: this.paymentCurrency,
    };
  }
}
