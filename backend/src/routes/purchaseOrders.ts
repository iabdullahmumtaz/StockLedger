import { Router } from 'express';
import PurchaseOrder from '../models/PurchaseOrder.js';
import Product from '../models/Product.js';

import { errorMessage } from '../utils/errors.js';

const router = Router();

interface LineItemInput {
  quantity: number;
  unitPrice: number;
}

function calcTotal(items: LineItemInput[]): number {
  return items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
}

router.get('/', async (_req, res) => {
  const orders = await PurchaseOrder.find()
    .populate('supplier', 'name email')
    .populate('items.product', 'name sku')
    .sort({ createdAt: -1 });
  res.json(orders);
});

router.post('/', async (req, res) => {
  try {
    const count = await PurchaseOrder.countDocuments();
    const orderNumber = `PO-${String(count + 1).padStart(5, '0')}`;
    const total = calcTotal(req.body.items || []);
    const order = await PurchaseOrder.create({ ...req.body, orderNumber, total });
    await order.populate('supplier', 'name');
    await order.populate('items.product', 'name sku');
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: errorMessage(err) });
  }
});

router.get('/:id', async (req, res) => {
  const order = await PurchaseOrder.findById(req.params.id)
    .populate('supplier', 'name email phone')
    .populate('items.product', 'name sku quantity');
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

router.put('/:id', async (req, res) => {
  const updates = { ...req.body };
  if (updates.items) updates.total = calcTotal(updates.items);
  const order = await PurchaseOrder.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  })
    .populate('supplier', 'name')
    .populate('items.product', 'name sku');
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

router.post('/:id/receive', async (req, res) => {
  const order = await PurchaseOrder.findById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (order.status === 'received') {
    return res.status(400).json({ error: 'Already received' });
  }
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { quantity: item.quantity },
    });
  }
  order.status = 'received';
  await order.save();
  const populated = await PurchaseOrder.findById(order._id)
    .populate('supplier', 'name')
    .populate('items.product', 'name sku quantity');
  res.json(populated);
});

router.delete('/:id', async (req, res) => {
  const order = await PurchaseOrder.findByIdAndDelete(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json({ ok: true });
});

export default router;
