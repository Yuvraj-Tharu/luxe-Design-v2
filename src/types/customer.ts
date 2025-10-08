// import { Invoice } from './invoice';

export interface CustomerStateProps {
  customers: Customer[];
  orders: Order[];
  products: Product[];
  productreviews: ProductReview[];
  // invoices: Invoice[];
  error: object | string | null;
}

export type Customer = {
  name: string;
  email: string;
  location: string;
  orders: number;
  date: string;
  status: number;
};

export type Order = {
  id: string;
  name: string;
  company: string;
  type: string;
  qty: number;
  date: string;
  status: number;
  phone: string;
  created_date: string;
  expert: {
    name: string;
  };
  time: {
    startTime: string;
    endTime: string;
  };
  center: {
    name: string;
  };
};

export interface Expert {
  object: string;
  id: string;
  slug: string;
  image: string;
  name: string;
  position: string;
  experience: number;
  education: string;
  description: string;
  center: string;
  service: string[];
  displayPosition: number;
  created_date: string;
  updated_date: string;
}

export interface Time {
  object: string;
  id: string;
  expert: string;
  center: string;
  startTime: string;
  endTime: string;
  slot: number;
  date: string;
  isAvailable: boolean;
  created_date: string;
  updated_date: string;
}

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  date: string;
  qty: number;
};

export type ProductReview = {
  name: string;
  author: string;
  review: string;
  rating: number;
  date: string;
  status: number;
};
