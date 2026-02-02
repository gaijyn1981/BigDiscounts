export type Order = {
  id: string;
  email: string | null;
  amount: number | null;
  currency: string | null;
  createdAt: string;
};

export const orders: Order[] = [];