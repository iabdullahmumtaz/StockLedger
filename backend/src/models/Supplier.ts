import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    contactPerson: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Supplier', supplierSchema);
