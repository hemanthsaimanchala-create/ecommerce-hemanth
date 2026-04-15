import type { CartItem, Order, Product, User, ActivityItem } from '../types';

const TOKEN_KEY = 'qamarun_token';

type RequestOptions = RequestInit & {
  auth?: boolean;
};

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);

export const setStoredToken = (token: string | null) => {
  if (!token) {
    localStorage.removeItem(TOKEN_KEY);
    return;
  }
  localStorage.setItem(TOKEN_KEY, token);
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  if (options.auth) {
    const token = getStoredToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const response = await fetch(path, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong.');
  }

  return data as T;
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<{ token: string; user: User }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    register: (name: string, email: string, password: string) =>
      request<{ token: string; user: User }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      }),
    forgotPassword: (email: string) =>
      request<{ message: string }>('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),
    resetPassword: (payload: { email: string; otpCode: string; newPassword: string }) =>
      request<{ message: string }>('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    me: () =>
      request<{ user: User }>('/api/auth/me', {
        auth: true,
      }),
    logout: () =>
      request<void>('/api/auth/logout', {
        method: 'POST',
        auth: true,
      }),
  },
  products: {
    list: (params?: { search?: string; category?: string }) => {
      const searchParams = new URLSearchParams();
      if (params?.search) {
        searchParams.set('search', params.search);
      }
      if (params?.category && params.category !== 'All') {
        searchParams.set('category', params.category);
      }

      const query = searchParams.toString();
      return request<{ products: Product[]; categories: string[] }>(
        `/api/products${query ? `?${query}` : ''}`,
      );
    },
    detail: (id: string) => request<{ product: Product }>(`/api/products/${id}`),
  },
  orders: {
    create: (payload: {
      items: CartItem[];
      paymentMethod: Order['paymentMethod'];
      shippingAddress: {
        name: string;
        email: string;
        address: string;
        city: string;
        zipCode: string;
      };
    }) =>
      request<{ order: Order }>('/api/orders', {
        method: 'POST',
        auth: true,
        body: JSON.stringify(payload),
      }),
    mine: () =>
      request<{ orders: Order[] }>('/api/orders/me', {
        auth: true,
      }),
    cancel: (id: string, cancelReason: string) =>
      request<{ order: Order }>(`/api/orders/${id}/cancel`, {
        method: 'PATCH',
        auth: true,
        body: JSON.stringify({ cancelReason }),
      }),
  },
  admin: {
    summary: () =>
      request<{
        totalProducts: number;
        totalOrders: number;
        totalUsers: number;
        totalRevenue: number;
        recentActivity: ActivityItem[];
      }>('/api/admin/summary', { auth: true }),
    products: () =>
      request<{ products: Product[] }>('/api/admin/products', {
        auth: true,
      }),
    createProduct: (product: Partial<Product>) =>
      request<{ product: Product }>('/api/admin/products', {
        method: 'POST',
        auth: true,
        body: JSON.stringify(product),
      }),
    updateProduct: (id: string, product: Partial<Product>) =>
      request<{ product: Product }>(`/api/admin/products/${id}`, {
        method: 'PUT',
        auth: true,
        body: JSON.stringify(product),
      }),
    deleteProduct: (id: string) =>
      request<void>(`/api/admin/products/${id}`, {
        method: 'DELETE',
        auth: true,
      }),
    users: () =>
      request<{ users: User[] }>('/api/admin/users', {
        auth: true,
      }),
    updateUser: (id: string, payload: Partial<Pick<User, 'role' | 'status'>>) =>
      request<{ user: User }>(`/api/admin/users/${id}`, {
        method: 'PATCH',
        auth: true,
        body: JSON.stringify(payload),
      }),
    orders: () =>
      request<{ orders: Order[] }>('/api/admin/orders', {
        auth: true,
      }),
    updateOrder: (id: string, status: Order['status']) =>
      request<{ order: Order }>(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        auth: true,
        body: JSON.stringify({ status }),
      }),
  },
};
