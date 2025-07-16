import { CurrenciesDTO } from "../../dto/CurrenciesDTO";

export class Currencies {
  public readonly baseCurrency: string;
  public readonly paymentCurrency: string;

  constructor(baseCurrency: string, paymentCurrency: string) {
    this.baseCurrency = baseCurrency;
    this.paymentCurrency = paymentCurrency;
  }

  static fromDTO(data: CurrenciesDTO): Currencies {
    return new Currencies(data.baseCurrency, data.paymentCurrency);
  }

  toDTO(): CurrenciesDTO {
    return {
      baseCurrency: this.baseCurrency,
      paymentCurrency: this.paymentCurrency,
    };
  }
}
