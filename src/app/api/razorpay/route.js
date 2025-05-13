import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req) {
  
  const { amount,userid } = await req.json();
  
  // console.log("userid",userid)
  // console.log("amount",amount)
  // 1. create instance

  const razorPayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });


  // 2. create options
  const options = {
    amount: amount * 100, 
    currency: process.env.CURRENCY,
    receipt: userid,
  };

  try {
    const order = await razorPayInstance.orders.create(options);
    return NextResponse.json({order});
  } catch (error) {
    return NextResponse.json({ error: "Failed to create Razorpay order" });
  }
}
