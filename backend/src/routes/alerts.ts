import { Router } from 'express';
import Product from '../models/Product.js';

const router = Router();

router.get('/low-stock', async (_req, res) => {
  const products = await Product.find({
    $expr: { $lte: ['$quantity', '$reorderLevel'] },
  })
    .populate('supplier', 'name email phone')
    .sort({ quantity: 1 });
  res.json({
    count: products.length,
    products: products.map((p) => ({
      _id: p._id,
      name: p.name,
      sku: p.sku,
      quantity: p.quantity,
      reorderLevel: p.reorderLevel,
      deficit: p.reorderLevel - p.quantity,
      supplier: p.supplier,
      location: p.location,
    })),
  });
});

export default router;
