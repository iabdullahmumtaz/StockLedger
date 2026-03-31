import { useEffect, useState, type FormEvent } from 'react';
import { purchaseOrders as api, products as prodApi, suppliers as supApi } from '../api';
import type { Product, PurchaseOrder, Supplier } from '../types';

interface PoLineItem {
  product: string;
  quantity: number;
  unitPrice: number;
}

export default function PurchaseOrders() {
  const [list, setList] = useState<PurchaseOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    supplier: '',
    product: '',
    qty: 1,
    price: 0,
    items: [] as PoLineItem[],
  });

  function load() {
    api.list().then(setList);
  }

  useEffect(() => {
    load();
    prodApi.list().then(setProducts);
    supApi.list().then(setSuppliers);
  }, []);

  function addLine() {
    if (!form.product) return;
    const p = products.find((x) => x._id === form.product);
    setForm({
      ...form,
      items: [
        ...form.items,
        {
          product: form.product,
          quantity: Number(form.qty),
          unitPrice: Number(form.price) || p?.unitPrice || 0,
        },
      ],
      product: '',
      qty: 1,
    });
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    await api.create({ supplier: form.supplier, items: form.items, status: 'ordered' });
    setShow(false);
    setForm({ supplier: '', product: '', qty: 1, price: 0, items: [] });
    load();
  }

  return (
    <div>
      <div className="header">
        <h1>Purchase Orders</h1>
        <button type="button" onClick={() => setShow(true)}>
          New PO
        </button>
      </div>
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Order #</th>
              <th>Supplier</th>
              <th>Status</th>
              <th>Total</th>
              <th>Items</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {list.map((o) => (
              <tr key={o._id}>
                <td>{o.orderNumber}</td>
                <td>{o.supplier?.name}</td>
                <td>{o.status}</td>
                <td>${o.total?.toFixed(2)}</td>
                <td>{o.items?.length}</td>
                <td>
                  {o.status !== 'received' && (
                    <button type="button" className="small secondary" onClick={() => api.receive(o._id).then(load)}>
                      Receive
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {show && (
        <div className="modal-bg" onClick={() => setShow(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '1rem' }}>Create purchase order</h3>
            <form onSubmit={submit}>
              <div className="form-group">
                <label>Supplier</label>
                <select value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} required>
                  <option value="">Select…</option>
                  {suppliers.map((s) => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Product line</label>
                <select value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })}>
                  <option value="">Select…</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>{p.sku} — {p.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Qty</label>
                  <input type="number" min="1" value={form.qty} onChange={(e) => setForm({ ...form, qty: Number(e.target.value) })} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Unit price</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
                </div>
              </div>
              <button type="button" className="secondary" onClick={addLine} style={{ marginBottom: '1rem' }}>
                Add line
              </button>
              <ul style={{ marginBottom: '1rem', color: 'var(--muted)' }}>
                {form.items.map((it, i) => {
                  const p = products.find((x) => x._id === it.product);
                  return (
                    <li key={i}>
                      {p?.sku}: {it.quantity} × ${it.unitPrice}
                    </li>
                  );
                })}
              </ul>
              <button type="submit" disabled={!form.items.length}>
                Create order
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
