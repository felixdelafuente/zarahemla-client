import { Cart } from './cart.model';
import { Client } from './client.model';

export interface Sale {
  _id: string; // Unique identifier for the sale (MongoDB ObjectId as a string)
  transactionNumber: number; // Unique transaction number for the sale
  branch: string; // Branch where the sale occurred
  client: Client; // Client details
  cart: Cart[]; // Array of cart items
  discount: number; // Discount applied to the sale
  totalPrice: number; // Total price after discount
  paid: boolean; // Whether the sale has been paid
  dateIssued: string; // Date of the sale
  recurring: boolean; // Whether the sale is a recurring transaction
}
