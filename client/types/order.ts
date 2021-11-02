export interface Order {
  id: string;
  userId: string;
  status: string;
  expiresAt: Date;
  ticket: {
    id: string;
    title: string;
    price: number;
  };
}
