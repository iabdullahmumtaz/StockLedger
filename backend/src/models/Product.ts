import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, default: '' },
    quantity: { type: Number, required: true, min: 0, default: 0 },
    reorderLevel: { type: Number, required: true, min: 0, default: 10 },
    unitPrice: { type: Number, required: true, min: 0 },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
    location: { type: String, default: 'A-01' },
  },
  { timestamps: true }
);

productSchema.virtual('lowStock').get(function lowStock() {
  return this.quantity <= this.reorderLevel;
});

productSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Product', productSchema);
