import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { products, alerts, purchaseOrders } from '../api';
import type { LowStockProduct } from '../types';

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, low: 0, value: 0, orders: 0 });
  const [lowList, setLowList] = useState<LowStockProduct[]>([]);

  useEffect(() => {
    Promise.all([products.list(), alerts.lowStock(), purchaseOrders.list()]).then(
      ([prods, alert, orders]) => {
        const value = prods.reduce((s, p) => s + p.quantity * p.unitPrice, 0);
        setStats({
          total: prods.length,
          low: alert.count,
          value,
          orders: orders.filter((o) => o.status !== 'received').length,
        });
        setLowList(alert.products.slice(0, 6));
      }
    );
  }, []);

  return (
    <div>
      <div className="header">
        <h1>Warehouse Dashboard</h1>
      </div>
      <div className="grid-4">
        <div className="card stat">
          <h4>Products</h4>
          <p>{stats.total}</p>
        </div>
        <div className="card stat">
          <h4>Low stock</h4>
          <p style={{ color: 'var(--warn)' }}>{stats.low}</p>
        </div>
        <div className="card stat">
          <h4>Inventory value</h4>
          <p>${stats.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="card stat">
          <h4>Open POs</h4>
          <p>{stats.orders}</p>
        </div>
      </div>
      <div className="card">
        <div className="header" style={{ marginBottom: 0 }}>
          <h3>Low-stock alerts</h3>
          <Link to="/alerts">View all →</Link>
        </div>
        <table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Reorder</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {lowList.map((p) => (
              <tr key={p._id} className="row-low">
                <td>{p.sku}</td>
                <td>{p.name}</td>
                <td>{p.quantity}</td>
                <td>{p.reorderLevel}</td>
                <td>{p.location}</td>
              </tr>
            ))}
            {!lowList.length && (
              <tr>
                <td colSpan={5} style={{ color: 'var(--muted)' }}>
                  All stock levels healthy
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
