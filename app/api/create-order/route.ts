import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request: NextRequest) {
  const { amount, email } = await request.json();

  if (!amount || !email) {
    return NextResponse.json(
      { error: "Amount and email are required" },
      { status: 400 }
    );
  }

  const options = {
    amount: amount * 100, // Razorpay expects amount in paise
    currency: "INR",
    receipt: `order_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    return NextResponse.json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
