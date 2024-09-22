import express from 'express';
import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();

const router = express.Router();
console.log( process.env.STRIPE_SECRET_KEY );

// console.log('Stripe Secret Key:', stripeSecretKey); // Log the secret key to ensure it's being loaded
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); 
 
const YOUR_DOMAIN = 'https://muse-front.vercel.app';

router.post('/create-checkout-session', async (req, res) => {
  try {
   // console.log(process.env.STRIPE_SECRET_KEY); // Log the secret key to ensure it's being loaded
    console.log("mokaro")
    const { products } = req.body;

    // Logging request body for debugging
    console.log("Products received:", products);

    if (!products || !Array.isArray(products)) {
      throw new Error("Invalid products array.");
    }

    const lineItems = products.map((product) => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: product.short_title
        },
        unit_amount: product.price * 100, // Convert amount to cents
      },
      quantity: 1
    }));  

    

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}/success`,
      cancel_url: `${YOUR_DOMAIN}/failure`,
      metadata: {
        orderId: products[0]._id // Assuming each product has an ID
      }
    });

    console.log("Stripe session created:", session.id);
    res.json({ id: session.id });
    
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).send("Error during payment");
  }
});

export default router;
