export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt: string;
}

export type FrequencyType = "daily" | "weekly" | "monthly" | "as_needed";

export interface Medication {
  id: string;
  name: string;
  dosage: string; // e.g., "500mg"
  form: string; // e.g., "Tablet", "Syrup"
  frequency: FrequencyType;
  times: string[]; // Array of times e.g., ["08:00", "20:00"]
  stock: number;
  lowStockThreshold: number;
  instructions?: string;
  startDate: string;
  endDate?: string;
  active: boolean;
}

export interface Reminder {
  id: string;
  medicationId: string;
  medicationName: string;
  time: string; // "08:00"
  daysOfWeek?: number[]; // 0-6 (Sunday-Saturday)
  active: boolean;
  takenDates: string[]; // ISO dates of when it was taken
}

export interface PharmacyProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: string;
  inStock: boolean;
  requiresPrescription: boolean;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  date: string;
  shippingAddress: string;
}

export interface CartItem extends OrderItem {
  // Helper type for cart
}
