import { Router } from 'express';
import Product from '../models/Product.js';
import { errorMessage } from '../utils/errors.js';

const router = Router();

router.get('/', async (req, res) => {
  const search = typeof req.query.search === 'string' ? req.query.search : '';
  const filter = search
    ? { $or: [{ name: new RegExp(search, 'i') }, { sku: new RegExp(search, 'i') }] }
    : {};
  const products = await Product.find(filter).populate('supplier', 'name').sort({ name: 1 });
  res.json(products);
});

router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    await product.populate('supplier', 'name');
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: errorMessage(err) });
  }
});

router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id).populate('supplier', 'name');
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

router.put('/:id', async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('supplier', 'name');
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

router.delete('/:id', async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json({ ok: true });
});

export default router;
