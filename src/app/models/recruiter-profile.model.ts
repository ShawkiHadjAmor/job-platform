import { User } from "./user.model";

export interface RecruiterProfile {
  companyName: string;
  address: string;
  contactPerson: string;
  phone: string;
  description: string;
  user: User;
}