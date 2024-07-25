import express from 'express';
import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();

const router = express.Router();
const stripe = Stripe(process.env.STRIPE); 

const YOUR_DOMAIN = 'http://localhost:5173';

router.post('/create-checkout-session', async (req, res) => {
  try {
    const { products } = req.body;
    
    const lineItems = products.map((product) => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: product.short_title
        },
        unit_amount: product.price *100, // Convert amount to cents
      },
      quantity: 1
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}/success`, // Corrected URL
      cancel_url: `${YOUR_DOMAIN}/failure` // Corrected URL
    });
    
    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).send("Error during payment");
  }
});

export default router;
