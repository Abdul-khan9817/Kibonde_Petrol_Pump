const Order = require('../models/Order');

function generateOrderNumber() {
  const part1 = Math.floor(Math.random() * 90) + 10;
  const part2 = Math.floor(Math.random() * 9000) + 1000;
  const part3 = Math.floor(Math.random() * 900) + 100;
  return `KN ${part1} ${part2} ${part3}`;
}

// POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const { user_id, fuel_type, number_of_litres, delivery_location, mode_of_payment, price } = req.body;

    if (!user_id || !fuel_type || !number_of_litres || !mode_of_payment) {
      return res.status(400).json({ message: 'Missing required order fields' });
    }

    const order = await Order.create({
      user: user_id,
      order_number: generateOrderNumber(),
      fuel_type,
      number_of_litres,
      delivery_location: delivery_location || null,
      mode_of_payment,
      price,
      status: 'pending'
    });

    return res.status(201).json(order);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error placing order: ' + err.message });
  }
};

// GET /api/orders/user/:userId
exports.getOrdersForUser = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error fetching orders: ' + err.message });
  }
};

// GET /api/orders  (admin - all orders)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.json(orders);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error fetching orders: ' + err.message });
  }
};

// PATCH /api/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    return res.json(order);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error updating status: ' + err.message });
  }
};
