import { HTTP_CODE, Roles, SubscriptionType } from "@/constants";

interface Error {
  name?: string;
  status?: HTTP_CODE;
  message?: string;
}

interface Role {
  id: string;
  type: Roles;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  createdAt: string;
  updateAt: string;
  name: SubscriptionType;
  id: string;
}

export interface User {
  id: string;
  age: number | null;
  avatar: string;
  email: string;
  firstName: string;
  lastName: string;
  userName: string;
  loggedIn: boolean;
  profileUpdated: boolean;
  subscribed: boolean;
  subscriptions: Subscription[];
  token: string | null;
  role?: Role | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserState {
  data: User;
}

export interface UserResponse {
  data: User;
  status: HTTP_CODE;
  error?: Error;
}
