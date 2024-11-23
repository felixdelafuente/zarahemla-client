export interface Discount {
  _id: string; // Unique identifier for the discount (MongoDB ObjectId as a string)
  loyaltyNumber: number; // Loyalty program number associated with the discount
  value: number; // Discount value (percentage or fixed amount)
  client: string; // Reference to the client (Customer) by their unique ID
  dateIssued: string; // Date when the discount was issued (ISO string)
}