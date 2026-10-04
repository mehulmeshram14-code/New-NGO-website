const Subscriber = require('../models/Subscriber');

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter
// @access  Public
const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Please provide an email address' });
    }

    // Check if already subscribed
    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({ error: 'Email is already subscribed to the newsletter' });
    }

    const newSubscriber = await Subscriber.create({ email });

    res.status(201).json({
      success: true,
      data: newSubscriber,
      message: 'Successfully subscribed to the newsletter!',
    });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    res.status(500).json({
      success: false,
      error: 'Server error, could not subscribe',
    });
  }
};

module.exports = {
  subscribeNewsletter,
};
