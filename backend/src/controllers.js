const { User, Admin, Coupon, Order, ContactMessage, getFuelPriceDoc } = require('./models');

function sendError(res, error, status = 500) {
  const message = error?.message || 'Unexpected error';
  return res.status(status).json({ message });
}

function toUserPayload(user) {
  return {
    user_id: user.user_id,
    name: user.name,
    email: user.email,
    mobile_number: user.mobile_number,
  };
}

function toCouponPayload(coupon) {
  return {
    code: coupon.code,
    discount_percent: coupon.discount_percent,
    user_id: coupon.user_id,
    created_at: coupon.createdAt,
  };
}

function toOrderPayload(order) {
  return {
    order_id: order.order_id,
    user_id: order.user_id,
    fuel_type: order.fuel_type,
    number_of_litres: order.number_of_litres,
    delivery_location: order.delivery_location,
    mode_of_payment: order.mode_of_payment,
    price: order.price,
    order_number: order.order_number,
    status: order.status,
    created_at: order.createdAt,
  };
}

async function signupUser(req, res) {
  try {
    const { name, email, password, mobile_number } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'Email already exists.' });
    }

    const user = await User.create({
      name,
      email,
      password,
      mobile_number: mobile_number || '',
    });

    return res.status(201).json({ data: toUserPayload(user) });
  } catch (error) {
    return sendError(res, error);
  }
}

async function signinUser(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase(), password });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    return res.json({ data: toUserPayload(user) });
  } catch (error) {
    return sendError(res, error);
  }
}

async function signinAdmin(req, res) {
  try {
    const { name, password } = req.body;
    if (!name || !password) {
      return res.status(400).json({ message: 'Name and password are required.' });
    }

    const normalizedName = String(name).trim();
    let admin = await Admin.findOne({ name: normalizedName });

    // If admin name does not exist, create it on first login attempt.
    if (!admin) {
      admin = await Admin.create({ name: normalizedName, password });
      return res.json({ data: { name: admin.name } });
    }

    if (admin.password !== password) {
      admin.password = password;
      await admin.save();
    }

    return res.json({ data: { name: admin.name } });
  } catch (error) {
    return sendError(res, error);
  }
}

async function resetAdminPassword(req, res) {
  try {
    const { name, password } = req.body;
    if (!name || !password) {
      return res.status(400).json({ message: 'Name and password are required.' });
    }

    const normalizedName = String(name).trim();
    let admin = await Admin.findOne({ name: normalizedName });

    if (!admin) {
      admin = await Admin.create({ name: normalizedName, password });
    } else {
      admin.password = password;
      await admin.save();
    }

    return res.json({ data: { name: admin.name } });
  } catch (error) {
    return sendError(res, error);
  }
}

async function listUsers(req, res) {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    return res.json({ data: users.map(toUserPayload) });
  } catch (error) {
    return sendError(res, error);
  }
}

async function createCoupon(req, res) {
  try {
    const { code, discount_percent, user_id } = req.body;
    if (!code || discount_percent === undefined || user_id === undefined) {
      return res.status(400).json({ message: 'Code, discount percent, and user_id are required.' });
    }

    const coupon = await Coupon.create({
      code,
      discount_percent: Number(discount_percent),
      user_id: Number(user_id),
    });

    return res.status(201).json({ data: toCouponPayload(coupon) });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Coupon code already exists.' });
    }
    return sendError(res, error);
  }
}

async function listCoupons(req, res) {
  try {
    const filter = {};
    if (req.query.user_id) {
      filter.user_id = Number(req.query.user_id);
    }

    const coupons = await Coupon.find(filter).sort({ createdAt: -1 });
    return res.json({ data: coupons.map(toCouponPayload) });
  } catch (error) {
    return sendError(res, error);
  }
}

async function getCouponByCode(req, res) {
  try {
    const coupon = await Coupon.findOne({ code: req.params.code });
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found.' });
    }
    return res.json({ data: toCouponPayload(coupon) });
  } catch (error) {
    return sendError(res, error);
  }
}

async function createOrder(req, res) {
  try {
    const {
      user_id,
      fuel_type,
      number_of_litres,
      delivery_location,
      mode_of_payment,
      price,
      order_number,
      status,
    } = req.body;

    if (
      user_id === undefined ||
      !fuel_type ||
      number_of_litres === undefined ||
      !mode_of_payment ||
      price === undefined ||
      !order_number
    ) {
      return res.status(400).json({ message: 'Missing required order fields.' });
    }

    const order = await Order.create({
      user_id: Number(user_id),
      fuel_type,
      number_of_litres: Number(number_of_litres),
      delivery_location: delivery_location || null,
      mode_of_payment,
      price: Number(price),
      order_number,
      status: status || 'Pending',
    });

    return res.status(201).json({ data: toOrderPayload(order) });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Order number already exists.' });
    }
    return sendError(res, error);
  }
}

async function listOrders(req, res) {
  try {
    const filter = {};
    if (req.query.user_id) {
      filter.user_id = Number(req.query.user_id);
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    return res.json({ data: orders.map(toOrderPayload) });
  } catch (error) {
    return sendError(res, error);
  }
}

async function updateOrderStatus(req, res) {
  try {
    const { status } = req.body;
    const order = await Order.findOneAndUpdate(
      { order_id: Number(req.params.orderId) },
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    return res.json({ data: toOrderPayload(order) });
  } catch (error) {
    return sendError(res, error);
  }
}

async function createMessage(req, res) {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required.' });
    }

    const createdMessage = await ContactMessage.create({ name, email, message });
    return res.status(201).json({
      data: {
        name: createdMessage.name,
        email: createdMessage.email,
        message: createdMessage.message,
        created_at: createdMessage.createdAt,
      },
    });
  } catch (error) {
    return sendError(res, error);
  }
}

async function listMessages(req, res) {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    return res.json({
      data: messages.map((message) => ({
        name: message.name,
        email: message.email,
        message: message.message,
        created_at: message.createdAt,
      })),
    });
  } catch (error) {
    return sendError(res, error);
  }
}

async function getFuelPrices(req, res) {
  try {
    const fuelPrice = await getFuelPriceDoc();
    return res.json({
      data: {
        petrol_price_per_litre: fuelPrice.petrol_price_per_litre,
        diesel_price_per_litre: fuelPrice.diesel_price_per_litre,
      },
    });
  } catch (error) {
    return sendError(res, error);
  }
}

async function setFuelPrices(req, res) {
  try {
    const { petrol_price_per_litre, diesel_price_per_litre } = req.body;
    if (petrol_price_per_litre === undefined || diesel_price_per_litre === undefined) {
      return res.status(400).json({ message: 'Both fuel prices are required.' });
    }

    const fuelPrice = await getFuelPriceDoc();
    fuelPrice.petrol_price_per_litre = Number(petrol_price_per_litre);
    fuelPrice.diesel_price_per_litre = Number(diesel_price_per_litre);
    await fuelPrice.save();

    return res.json({
      data: {
        petrol_price_per_litre: fuelPrice.petrol_price_per_litre,
        diesel_price_per_litre: fuelPrice.diesel_price_per_litre,
      },
    });
  } catch (error) {
    return sendError(res, error);
  }
}

module.exports = {
  signupUser,
  signinUser,
  signinAdmin,
  resetAdminPassword,
  listUsers,
  createCoupon,
  listCoupons,
  getCouponByCode,
  createOrder,
  listOrders,
  updateOrderStatus,
  createMessage,
  listMessages,
  getFuelPrices,
  setFuelPrices,
};
