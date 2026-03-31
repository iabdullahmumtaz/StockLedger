import { useEffect, useState, type FormEvent } from 'react';
import { products as api, suppliers as supApi } from '../api';
import type { Product, Supplier } from '../types';

export default function Products() {
  const [list, setList] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [search, setSearch] = useState('');
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    name: '',
    sku: '',
    quantity: 0,
    reorderLevel: 10,
    unitPrice: 0,
    supplier: '',
    location: 'A-01',
  });

  function load() {
    api.list(search).then(setList);
  }

  useEffect(() => {
    supApi.list().then(setSuppliers);
    load();
  }, [search]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    await api.create({
      ...form,
      quantity: Number(form.quantity),
      reorderLevel: Number(form.reorderLevel),
      unitPrice: Number(form.unitPrice),
      supplier: form.supplier || undefined,
    });
    setShow(false);
    load();
  }

  return (
    <div>
      <div className="header">
        <h1>Products</h1>
        <button type="button" onClick={() => setShow(true)}>
          Add product
        </button>
      </div>
      <input
        placeholder="Search SKU or name…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ maxWidth: 320, marginBottom: '1rem' }}
      />
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Name</th>
              <th>Qty</th>
              <th>Reorder</th>
              <th>Price</th>
              <th>Location</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p._id} className={p.quantity <= p.reorderLevel ? 'row-low' : ''}>
                <td>{p.sku}</td>
                <td>{p.name}</td>
                <td>{p.quantity}</td>
                <td>{p.reorderLevel}</td>
                <td>${p.unitPrice.toFixed(2)}</td>
                <td>{p.location}</td>
                <td>
                  {p.quantity <= p.reorderLevel ? (
                    <span className="badge-warn">Low</span>
                  ) : (
                    <span className="badge-ok">OK</span>
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
            <h3 style={{ marginBottom: '1rem' }}>New product</h3>
            <form onSubmit={submit}>
              <div className="form-group">
                <label>Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>SKU</label>
                <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} />
              </div>
              <div className="form-group">
                <label>Reorder level</label>
                <input type="number" value={form.reorderLevel} onChange={(e) => setForm({ ...form, reorderLevel: Number(e.target.value) })} />
              </div>
              <div className="form-group">
                <label>Unit price</label>
                <input type="number" step="0.01" value={form.unitPrice} onChange={(e) => setForm({ ...form, unitPrice: Number(e.target.value) })} />
              </div>
              <div className="form-group">
                <label>Supplier</label>
                <select value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })}>
                  <option value="">—</option>
                  {suppliers.map((s) => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Location</label>
                <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </div>
              <button type="submit">Save</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
