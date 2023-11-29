export interface User {
  id?: string;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  isSuperUser?: boolean;
  isVerifiedAdmin?: boolean;
}
