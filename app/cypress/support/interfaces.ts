export interface User {
  id: string;
  age: number | null;
  email: string;
  firstName: string;
  lastName: string;
  userName: string;
  subscribed: boolean;
  subscriptions: {
    id: string;
    name: string;
  }[];
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export interface Message {
  id: string;
  sender: string;
  message: string;
  email: string;
  unread: boolean;
  createdAt: string;
}
