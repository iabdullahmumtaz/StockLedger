import mongoose from 'mongoose';

const lineItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const purchaseOrderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
    items: [lineItemSchema],
    status: {
      type: String,
      enum: ['draft', 'ordered', 'received', 'cancelled'],
      default: 'draft',
    },
    total: { type: Number, default: 0 },
    notes: { type: String, default: '' },
    expectedDate: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model('PurchaseOrder', purchaseOrderSchema);
