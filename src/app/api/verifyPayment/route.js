import { NextResponse } from "next/server";
import crypto from "crypto";

// This is App Router-style POST function
export async function POST(req) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body.response;

    // Construct the expected signature
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    const generated_signature = crypto
      .createHmac("sha256", key_secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    // Signature check
    if (generated_signature === razorpay_signature) {
      console.log("✅ Signature verified. Payment successful!");

      // TODO: Update user's subscription info in database here

      return NextResponse.json({ success: true, message: "Payment verified" });
    } else {
      console.log("❌ Signature mismatch!");
      return NextResponse.json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
