importimport Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { amount } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [{
        price_data: {
          currency: "ngn",
          product_data: { name: "Support School Donation" },
          unit_amount: amount * 100
        },
        quantity: 1
      }],
      success_url: `${req.headers.origin}/support.html?success=1`,
      cancel_url: `${req.headers.origin}/support.html?cancel=1`
    });

    res.status(200).json({ sessionId: session.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
