"use server";

import { redirect } from "next/navigation";
import Stripe from "stripe";

export async function createCheckoutSession(priceId: string) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:3000/payment/success`,
      cancel_url: `http://localhost:3000/payment/cancel`,
    });

    if (session.url) {
      redirect(session.url);
    }
  } catch (error: unknown) {
    const errWithDigest = error as { digest?: string };
    if (errWithDigest.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("Error creating Stripe checkout session:", error);
  }
}
