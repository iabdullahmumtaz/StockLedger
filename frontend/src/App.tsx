import { Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Suppliers from './pages/Suppliers';
import PurchaseOrders from './pages/PurchaseOrders';
import Alerts from './pages/Alerts';
import './App.css';

export default function App() {
  return (
    <div className="layout">
      <nav className="nav">
        <div className="brand">StockLedger</div>
        <NavLink to="/" end>Dashboard</NavLink>
        <NavLink to="/products">Products</NavLink>
        <NavLink to="/suppliers">Suppliers</NavLink>
        <NavLink to="/orders">Purchase Orders</NavLink>
        <NavLink to="/alerts">Alerts</NavLink>
      </nav>
      <div className="content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/orders" element={<PurchaseOrders />} />
          <Route path="/alerts" element={<Alerts />} />
        </Routes>
      </div>
    </div>
  );
}
