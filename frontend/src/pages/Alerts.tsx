import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { alerts } from '../api';
import type { LowStockAlert } from '../types';

export default function Alerts() {
  const [data, setData] = useState<LowStockAlert>({ count: 0, products: [] });
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    alerts
      .lowStock()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  return (
    <div>
      <div className="header">
        <h1>Stock Alerts</h1>
        <button type="button" className="secondary" onClick={load} disabled={loading}>
          Refresh
        </button>
      </div>

      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <div className="card stat">
          <h4>Low-stock items</h4>
          <p style={{ color: 'var(--warn)' }}>{data.count}</p>
        </div>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Reorder</th>
              <th>Deficit</th>
              <th>Supplier</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {data.products.map((product) => (
              <tr key={product._id} className="row-low">
                <td>{product.sku}</td>
                <td>{product.name}</td>
                <td>{product.quantity}</td>
                <td>{product.reorderLevel}</td>
                <td>{product.deficit > 0 ? product.deficit : '—'}</td>
                <td>{product.supplier?.name || '—'}</td>
                <td>{product.location}</td>
              </tr>
            ))}
            {!loading && !data.products.length && (
              <tr>
                <td colSpan={7} style={{ color: 'var(--muted)' }}>
                  All products are above reorder levels
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td colSpan={7} style={{ color: 'var(--muted)' }}>
                  Loading alerts…
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {data.count > 0 && (
        <p style={{ marginTop: '1rem', color: 'var(--muted)' }}>
          <Link to="/orders">Create a purchase order →</Link> to restock low items.
        </p>
      )}
    </div>
  );
}
