export interface NewDiscount {
  value: number; // Discount value (percentage or fixed amount)
  client: string; // Reference to the client (Customer) by their unique ID
  dateIssued: string; // Date when the discount was issued (ISO string)
}