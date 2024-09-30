import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Store these in your .env.local
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST() {
  const options = {
    amount: 30000, // Amount in paise (₹300 = 30000 paise)
    currency: "INR",
    receipt: "order_rcptid_11",
  };

  try {
    const order = await razorpay.orders.create(options);
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.error();
  }
}
