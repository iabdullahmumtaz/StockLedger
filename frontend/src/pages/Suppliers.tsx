import { useEffect, useState, type FormEvent } from 'react';
import { suppliers as api } from '../api';
import type { Supplier } from '../types';

export default function Suppliers() {
  const [list, setList] = useState<Supplier[]>([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', contactPerson: '' });

  function load() {
    api.list().then(setList);
  }

  useEffect(load, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    await api.create(form);
    setForm({ name: '', email: '', phone: '', contactPerson: '' });
    load();
  }

  return (
    <div>
      <div className="header">
        <h1>Suppliers</h1>
      </div>
      <div className="card" style={{ marginBottom: '1.5rem', maxWidth: 420 }}>
        <h3 style={{ marginBottom: '0.75rem' }}>Add supplier</h3>
        <form onSubmit={submit}>
          <div className="form-group">
            <label>Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Contact</label>
            <input value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} />
          </div>
          <button type="submit">Add</button>
        </form>
      </div>
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Contact</th>
            </tr>
          </thead>
          <tbody>
            {list.map((s) => (
              <tr key={s._id}>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.phone}</td>
                <td>{s.contactPerson}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
