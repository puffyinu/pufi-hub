export interface WalletBalance {
  address: string;
  wld: number;
  pufi: number;
}

export async function readWallet(): Promise<WalletBalance> {
  return {
    address: "",
    wld: 0,
    pufi: 0,
  };
}