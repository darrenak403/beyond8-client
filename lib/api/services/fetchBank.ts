export interface Bank {
  id: number;
  name: string;
  code: string;
  bin: string;
  shortName: string;
  logo: string;
  transferSupported: number;
  lookupSupported: number;
  short_name: string;
  support: number;
  isTransfer: number;
  swift_code: string | null;
}

export interface BankListResponse {
  code: string;
  desc: string;
  data: Bank[];
}

export const bankService = {
  getBanks: async (): Promise<BankListResponse> => {
    const response = await fetch('https://api.vietqr.io/v2/banks');
    if (!response.ok) {
      throw new Error('Failed to fetch banks');
    }
    return response.json();
  }
};
