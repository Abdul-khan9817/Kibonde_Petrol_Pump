const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
  },
  { versionKey: false }
);

const Counter = mongoose.model('Counter', counterSchema);

async function getNextSequence(name) {
  const counter = await Counter.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}

const userSchema = new mongoose.Schema(
  {
    user_id: { type: Number, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, index: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    mobile_number: { type: String, default: '' },
  },
  { timestamps: true }
);

userSchema.pre('save', async function saveUser(next) {
  if (this.isNew && !this.user_id) {
    const lastUser = await mongoose
      .model('User')
      .findOne({}, { user_id: 1 })
      .sort({ user_id: -1 })
      .lean();
    const nextId = lastUser && Number.isFinite(lastUser.user_id) ? lastUser.user_id + 1 : 1;
    this.user_id = nextId;
  }
  next();
});

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, index: true, trim: true },
    discount_percent: { type: Number, required: true },
    user_id: { type: Number, required: true, index: true },
  },
  { timestamps: true }
);

const orderSchema = new mongoose.Schema(
  {
    order_id: { type: Number, unique: true, index: true },
    user_id: { type: Number, required: true, index: true },
    fuel_type: { type: String, required: true },
    number_of_litres: { type: Number, required: true },
    delivery_location: { type: String, default: null },
    mode_of_payment: { type: String, required: true },
    price: { type: Number, required: true },
    order_number: { type: String, required: true, unique: true, index: true },
    status: { type: String, default: 'Pending' },
  },
  { timestamps: true }
);

orderSchema.pre('save', async function saveOrder(next) {
  if (this.isNew && !this.order_id) {
    const lastOrder = await mongoose
      .model('Order')
      .findOne({}, { order_id: 1 })
      .sort({ order_id: -1 })
      .lean();
    const nextId = lastOrder && Number.isFinite(lastOrder.order_id) ? lastOrder.order_id + 1 : 1;
    this.order_id = nextId;
  }
  next();
});

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const fuelPriceSchema = new mongoose.Schema(
  {
    petrol_price_per_litre: { type: Number, default: 1.1 },
    diesel_price_per_litre: { type: Number, default: 1.5 },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Coupon = mongoose.model('Coupon', couponSchema);
const Order = mongoose.model('Order', orderSchema);
const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);
const FuelPrice = mongoose.model('FuelPrice', fuelPriceSchema);

async function getFuelPriceDoc() {
  let fuelPrice = await FuelPrice.findOne();
  if (!fuelPrice) {
    fuelPrice = await FuelPrice.create({});
  }
  return fuelPrice;
}

module.exports = {
  User,
  Admin,
  Coupon,
  Order,
  ContactMessage,
  FuelPrice,
  getFuelPriceDoc,
};
