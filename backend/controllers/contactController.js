const ContactMessage = require('../models/ContactMessage');

// POST /api/contact
exports.createMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email and message are required' });
    }
    const doc = await ContactMessage.create({ name, email, message });
    return res.status(201).json(doc);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/contact
exports.getMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    return res.json(messages);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};
