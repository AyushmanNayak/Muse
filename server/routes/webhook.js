import express from 'express';
import Stripe from 'stripe';
import Order from '../models/order.model.js'; // Import your Order model
import mongoose from 'mongoose';

const router = express.Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Middleware to parse raw body for Stripe webhook
router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.sendStatus(400); // Bad request if signature validation fails
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;

      // Retrieve the order ID from metadata
      const orderId = session.metadata.orderId;

      // Update the order status in your database
      try {
        await updateOrderStatus(orderId, { isCompleted: true });
        console.log(`Order ${orderId} is completed successfully.`);
      } catch (updateError) {
        console.error('Error updating order status:', updateError.message);
      }
      break;
    }

    // Add other event types if needed
    default:
      console.warn(`Unhandled event type ${event.type}`);
  }

  res.sendStatus(200); // Acknowledge receipt of the event
});

// Function to update the order status in the database
const updateOrderStatus = async (orderId, updateData) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      mongoose.Types.ObjectId(orderId),
      { $set: updateData },
      { new: true }
    );

    if (!updatedOrder) {
      throw new Error('Order not found');
    }

    console.log(`Order ${orderId} updated successfully:`, updatedOrder);
    return updatedOrder;
  } catch (error) {
    throw new Error(`Could not update order: ${error.message}`);
  }
};

export default router;
