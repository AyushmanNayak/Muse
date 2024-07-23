import Orders from "../models/order.model.js";
import Job from "../models/job.model.js";
import Stripe from "stripe"

//test : ffcreateOrder function to just "create" an order without keeping payment in mind

// export const createOrder = async (req, res) => {
//   try {
//     const job = await Job.findById(req.params.jobId);
//     const newOrder = new Orders({
//       jobId: job._id,
//       short_title: job.short_title,
//       price: job.price,
//       img: job.cover,
//       freelancerId: job.userId,
//       buyerId: req.userId,
//       payment_intent: "currentlyTemp"

//     });
//     await newOrder.save();
//     return res.status(200).send("order created successfully" + newOrder);

//   } catch (error) {
//     return res.send("error at createOrder" + error);
//   }
// }

export const allmyOrders = async (req, res) => {
  try {
    // Check if the user is a freelancer or a buyer and query accordingly
    const allOrders = await Orders.find({
      ...(req.isFreelancer ? { freelancerId: req.userId } : { buyerId: req.userId })
    });
    if (allOrders) console.log("there is " + allOrders.length);
    // Return the orders as JSON with a 200 status code
    //   console.log(allOrders);
    res.status(200).json(allOrders);
  } catch (error) {
    // Send error message with a 500 status code
    res.status(500).json({ message: "Error getting all orders", error: error.message });
  }
};

export const paisa = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  

  try {
    const job = await Job.findById(req.params.id);

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: job.price * 100, // Stripe expects the amount in cents
      currency: "usd",
      automatic_payment_methods: { enabled: true }
    });


    const newOrder = new Orders({
      jobId: job._id,
      short_title: job.short_title,
      price: job.price,
      img: job.cover,
      freelancerId: job.userId,
      buyerId: req.userId,
      payment_intent: paymentIntent.id
    });
    await newOrder.save();

    res.status(200).send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).send("Error creating payment or order: " + error.message);
  }
};