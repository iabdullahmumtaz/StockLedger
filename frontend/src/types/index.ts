export type PurchaseOrderStatus = 'draft' | 'ordered' | 'received' | 'cancelled';

export interface SupplierRef {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface Supplier {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  contactPerson?: string;
}

export interface Product {
  _id: string;
  name: string;
  sku: string;
  description?: string;
  quantity: number;
  reorderLevel: number;
  unitPrice: number;
  supplier?: SupplierRef | string;
  location: string;
  lowStock?: boolean;
}

export interface PurchaseOrderLineItem {
  product: Product | string;
  quantity: number;
  unitPrice: number;
}

export interface PurchaseOrder {
  _id: string;
  orderNumber: string;
  supplier: SupplierRef;
  items: PurchaseOrderLineItem[];
  status: PurchaseOrderStatus;
  total: number;
  notes?: string;
  expectedDate?: string;
}

export interface LowStockProduct {
  _id: string;
  name: string;
  sku: string;
  quantity: number;
  reorderLevel: number;
  deficit: number;
  supplier?: SupplierRef;
  location: string;
}

export interface LowStockAlert {
  count: number;
  products: LowStockProduct[];
}
