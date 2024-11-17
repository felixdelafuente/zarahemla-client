export interface User {
  id: string;
  name: string;
  accountType: string;
  access: Access[];
}

export interface Access {
  trading: string[];
  services: string[];
  _id: string;
}
