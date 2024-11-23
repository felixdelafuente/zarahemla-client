export interface NewVehicle {
  manufacturer: string; // Manufacturer of the vehicle (e.g., Toyota, Honda)
  model: string; // Vehicle model (e.g., Corolla, Civic)
  plateNumber: string; // License plate number of the vehicle
  client: string; // Reference to the client (Customer) by their unique ID
}