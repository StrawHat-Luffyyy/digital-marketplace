"use server";

import { redirect } from "next/navigation";
import Stripe from "stripe";
import { createServer } from "@/lib/supabase/server";

export async function createCheckoutSession(
  priceId: string,
  productId: number
) {
  const supabase = await createServer();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return redirect("/login");
  }

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

      metadata: {
        user_id: user.id,
        product_id: productId,
      },
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
