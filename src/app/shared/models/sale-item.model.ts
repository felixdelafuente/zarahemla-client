export interface SaleItem {
  transactionNumber: number; // Unique transaction number
  branch: string; // Branch where the sale occurred
  clientName: string; // Client's name
  clientEmail: string; // Client's email
  clientContact: string; // Client's contact information
  cartItemId: string; // Item ID from the cart
  cartItemName: string;
  cartItemPrice: number; // Price per unit of the item
  cartItemQuantity: number; // Quantity of the item purchased
  cartItemSubTotal: number; // Subtotal for the cart item
  discount: number; // Discount applied to the sale
  totalPrice: number; // Total price after discount
  paid: boolean; // Whether the sale has been paid
  dateIssued: string; // Date of the sale
  recurring: boolean; // Whether the sale is a recurring transaction
}
