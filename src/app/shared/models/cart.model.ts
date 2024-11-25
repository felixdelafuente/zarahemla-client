export interface Cart {
  item: string; // Reference to the item (ObjectId as string)
  itemPrice: number; // Price per unit of the item
  quantity: number; // Quantity of the item purchased
  subTotal: number; // Subtotal for this cart item
}