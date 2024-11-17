export interface NewUser {
  username: string;
  password: string;
  name: string;
  accountType: string;
  access: Access[];
}

interface Access {
  trading: string[];
  services: string[];
}
