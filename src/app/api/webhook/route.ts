import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature") || "";

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  // Verify the event is genuinely from Stripe
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Error verifying Stripe webhook signature:", error);
    return NextResponse.json({ received: false }, { status: 400 });
  }
  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata;

    // Ensure metadata exists before proceeding
    if (metadata && metadata.user_id && metadata.product_id) {
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_KEY!
      );

      // Insert order into the database
      const { error } = await supabaseAdmin.from("orders").insert({
        user_id: metadata.user_id,
        product_id: parseInt(metadata.product_id),
      });
      if (error) {
        console.error(
          "Error inserting order into Supabase with admin client:",
          error
        );
        return new NextResponse("Webhook handler failed to insert order", {
          status: 500,
        });
      } else {
        console.log(
          "Order inserted successfully into Supabase with admin client",
          metadata.user_id
        );
      }
    }
  }
  return new NextResponse("Webhook received", { status: 200 });
}
