import express from 'express';
import Stripe from 'stripe';


const router = express.Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);


const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; // Ensure this is set in your .env file

// Used exspecifically for Stripe webhook verification, last commit mein Stripe couldn't validate the signature from this request
router.post('/', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Stripe needs the raw body (req.body here will be a Buffer)
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.sendStatus(400);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;

      // Retrieve the order ID from metadata
      const orderId = session.metadata.orderId;

      // Update the order status in your database
      try {
        // Example (pseudo-code):
        // await updateOrderStatus(orderId, { isCompleted: true });
        console.log(`Order ${orderId} is completed successfully.`);
      } catch (updateError) {
        console.error('Error updating order status:', updateError.message);
      }
      break;
    // Handle other event types if needed
    default:
      console.warn(`Unhandled event type ${event.type}`);
  }

  res.sendStatus(200);
});

export default router;
