import type { LowStockAlert, Product, PurchaseOrder, Supplier } from './types';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers as Record<string, string> },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data as T;
}

export const products = {
  list: (search?: string) =>
    request<Product[]>(`/products${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  create: (body: Partial<Product>) =>
    request<Product>('/products', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: Partial<Product>) =>
    request<Product>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove: (id: string) => request<{ ok: boolean }>(`/products/${id}`, { method: 'DELETE' }),
};

export const suppliers = {
  list: () => request<Supplier[]>('/suppliers'),
  create: (body: Partial<Supplier>) =>
    request<Supplier>('/suppliers', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: Partial<Supplier>) =>
    request<Supplier>(`/suppliers/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove: (id: string) => request<{ ok: boolean }>(`/suppliers/${id}`, { method: 'DELETE' }),
};

export const purchaseOrders = {
  list: () => request<PurchaseOrder[]>('/purchase-orders'),
  create: (body: { supplier: string; items: { product: string; quantity: number; unitPrice: number }[]; status?: string }) =>
    request<PurchaseOrder>('/purchase-orders', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: Partial<PurchaseOrder>) =>
    request<PurchaseOrder>(`/purchase-orders/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  receive: (id: string) =>
    request<PurchaseOrder>(`/purchase-orders/${id}/receive`, { method: 'POST' }),
  remove: (id: string) => request<{ ok: boolean }>(`/purchase-orders/${id}`, { method: 'DELETE' }),
};

export const alerts = {
  lowStock: () => request<LowStockAlert>('/alerts/low-stock'),
};
