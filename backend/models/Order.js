const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    order_number: { type: String, required: true, unique: true },
    fuel_type: { type: String, enum: ['Petrol', 'Diesel'], required: true },
    number_of_litres: { type: Number, required: true },
    delivery_location: { type: String, default: null },
    mode_of_payment: { type: String, enum: ['Cash', 'PayNow'], required: true },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'in transit', 'collected', 'delivered'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
