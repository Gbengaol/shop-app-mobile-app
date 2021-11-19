import { ICart } from "./cart";

export interface IOrder {
  id: string;
  items: Array<ICart>;
  totalAmount: number;
  date: Date;
}
