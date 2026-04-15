export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive';
  registeredDate: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  ingredients: string[];
  benefits: string[];
  image: string;
  category: string;
  inStock: boolean;
  badge?: string;
  featured?: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: 'Credit Card' | 'Debit Card' | 'UPI' | 'Net Banking' | 'Cash on Delivery';
  itemsCount: number;
  cancelReason?: string | null;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    zipCode: string;
    email: string;
  };
}

export interface ActivityItem {
  id: string;
  type: string;
  message: string;
  createdAt: string;
}
