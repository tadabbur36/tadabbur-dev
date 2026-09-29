import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-signature") || "";
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

    if (!secret || secret.startsWith("placeholder")) {
      console.error("Webhook secret not configured");
      return NextResponse.json(
        { error: "Server not configured" },
        { status: 500 }
      );
    }

    // Verify signature
    const hmac = crypto.createHmac("sha256", secret);
    const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
    const signatureBuffer = Buffer.from(signature, "utf8");

    if (
      digest.length !== signatureBuffer.length ||
      !crypto.timingSafeEqual(digest, signatureBuffer)
    ) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta?.event_name;
    const subscriptionId = payload.data?.id;
    const subscriptionStatus = payload.data?.attributes?.status;
    const customerEmail = payload.data?.attributes?.user_email;

    console.log("LemonSqueezy webhook:", {
      eventName,
      subscriptionId,
      subscriptionStatus,
      customerEmail,
    });

    // Handle events — logic can be added when you have a database
    switch (eventName) {
      case "subscription_created":
      case "subscription_updated":
      case "subscription_resumed":
      case "subscription_payment_success":
        // Subscription active
        // When you add Supabase: store customer email + subscription ID
        break;
      case "subscription_cancelled":
      case "subscription_expired":
      case "subscription_paused":
        // Subscription inactive
        // When you add Supabase: revoke Pro access
        break;
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}