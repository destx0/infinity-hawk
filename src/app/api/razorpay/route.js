import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export async function POST(req) {
	try {
		const razorpay = new Razorpay({
			key_id: process.env.RAZORPAY_KEY_ID,
			key_secret: process.env.RAZORPAY_SECRET_KEY,
		});

		const body = await req.json();
		const payment_capture = 1;
		const amount = body.amount;
		const currency = "INR";

		const options = {
			amount: amount,
			currency,
			receipt: `receipt_${Date.now()}`,
			payment_capture,
		};

		const order = await razorpay.orders.create(options);
		return NextResponse.json(order);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Error creating order" },
			{ status: 500 }
		);
	}
}
