export interface Professor {
  id: number;
  name: string;
  discipline: string;
  level: string;
  rating: number;
  availability: string;
  price: number;
  image: string;
}

export interface CountryStatus {
  id: string;
  label: string;
  socialChargesRate: number;
}

export interface EUCountry {
  code: string;
  name: string;
  flag: string;
  govLinks: {
    label: string;
    url: string;
  }[];
  defaultTaxRate: number;
  vatRate: number;
  statuses: CountryStatus[];
  translations: {
    simulatorTitle: string;
    grossIncome: string;
    netIncome: string;
    dayRate: string;
    monthlyGross: string;
    netDay: string;
    netMonth: string;
    legalStatus: string;
    workTime: string;
    withholdingTax: string;
    netAfterTax: string;
    invoiceGenerator: string;
    companyName: string;
    clientName: string;
    description: string;
    quantity: string;
    unitPrice: string;
    generateInvoice: string;
    totalTTC: string;
    vat: string;
    subtotal: string;
    articlesServices: string;
    addLine: string;
    needExpert: string;
    euCommunity: string;
  };
}

export interface SalaryData {
  brutAnnuel: number;
  brutMensuel: number;
  brutJournalier: number;
  brutHoraire: number;
  netAnnuel: number;
  netMensuel: number;
  netJournalier: number;
  netHoraire: number;
  netApresImpot: number;
  taxAmount: number;
  socialCharges: number;
}
