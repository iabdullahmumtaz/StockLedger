import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import productRoutes from './routes/products.js';
import supplierRoutes from './routes/suppliers.js';
import purchaseOrderRoutes from './routes/purchaseOrders.js';
import alertRoutes from './routes/alerts.js';
import Product from './models/Product.js';
import Supplier from './models/Supplier.js';
import PurchaseOrder from './models/PurchaseOrder.js';

const app = express();
const PORT = process.env.PORT || 6024;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/stockledger';

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5024' }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'StockLedger' }));
app.use('/api/products', productRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/purchase-orders', purchaseOrderRoutes);
app.use('/api/alerts', alertRoutes);

async function seed() {
  if ((await Product.countDocuments()) > 0) return;

  const s1 = await Supplier.create({
    name: 'TechParts Global',
    email: 'orders@techparts.demo',
    phone: '+1-555-0100',
    contactPerson: 'Maria Chen',
  });
  const s2 = await Supplier.create({
    name: 'Office Supply Co',
    email: 'sales@officesupply.demo',
    phone: '+1-555-0200',
    contactPerson: 'James Park',
  });

  const p1 = await Product.create({
    name: 'Wireless Mouse',
    sku: 'WM-001',
    quantity: 45,
    reorderLevel: 20,
    unitPrice: 24.99,
    supplier: s1._id,
    location: 'A-12',
  });
  const p2 = await Product.create({
    name: 'USB-C Hub',
    sku: 'HUB-200',
    quantity: 8,
    reorderLevel: 15,
    unitPrice: 49.99,
    supplier: s1._id,
    location: 'B-03',
  });
  await Product.create({
    name: 'Notebook A4',
    sku: 'NB-A4',
    quantity: 120,
    reorderLevel: 50,
    unitPrice: 3.5,
    supplier: s2._id,
    location: 'C-01',
  });
  await Product.create({
    name: 'Ergonomic Chair',
    sku: 'CHR-ERG',
    quantity: 5,
    reorderLevel: 8,
    unitPrice: 299,
    supplier: s2._id,
    location: 'D-05',
  });

  await PurchaseOrder.create({
    orderNumber: 'PO-00001',
    supplier: s1._id,
    status: 'ordered',
    items: [
      { product: p2._id, quantity: 30, unitPrice: 45 },
      { product: p1._id, quantity: 50, unitPrice: 22 },
    ],
    total: 30 * 45 + 50 * 22,
    expectedDate: new Date(Date.now() + 7 * 86400000),
  });

  console.log('[Seed] Demo inventory created');
}

async function start() {
  await mongoose.connect(MONGODB_URI);
  console.log('[MongoDB] Connected');
  await seed();
  app.listen(PORT, () => console.log(`StockLedger API on http://localhost:${PORT}`));
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
