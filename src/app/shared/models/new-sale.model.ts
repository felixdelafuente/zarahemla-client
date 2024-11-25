import { Cart } from './cart.model';

export interface NewSale {
  transactionNumber: number; // Unique transaction number for the sale
  branch: string; // Branch where the sale occurred
  client: string; // Client details
  cart: Cart[]; // Array of cart items
  discount: number; // Discount applied to the sale
  totalPrice: number; // Total price after discount
  paid: boolean; // Whether the sale has been paid
  dateIssued: Date; // Date of the sale
  recurring: boolean; // Whether the sale is a recurring transaction
}
