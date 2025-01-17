import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req) {
	try {
		const body = await req.json();
		const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
			body;

		const sign = razorpay_order_id + "|" + razorpay_payment_id;
		const expectedSign = crypto
			.createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
			.update(sign.toString())
			.digest("hex");

		if (razorpay_signature === expectedSign) {
			return NextResponse.json({ success: true });
		} else {
			return NextResponse.json(
				{ success: false, error: "Invalid signature" },
				{ status: 400 }
			);
		}
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
}
