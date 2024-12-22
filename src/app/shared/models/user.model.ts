export interface User {
  _id: string;
  username: string;
  password: string;
  name: string;
  accountType: string;
  access: Access[];
  createdAt: Date;
}

export interface Token {
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
