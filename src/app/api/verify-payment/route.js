import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req) {
	try {
		const body = await req.json();
		const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
			body;

		// Generate the expected signature
		const text = `${razorpay_order_id}|${razorpay_payment_id}`;
		const expectedSignature = crypto
			.createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
			.update(text)
			.digest("hex");

		// Compare signatures
		const isAuthentic = expectedSignature === razorpay_signature;

		if (isAuthentic) {
			// Payment is verified
			return NextResponse.json({
				success: true,
				message: "Payment verified successfully",
			});
		} else {
			// Payment verification failed
			console.error("Signature mismatch:", {
				expected: expectedSignature,
				received: razorpay_signature,
			});
			return NextResponse.json(
				{
					success: false,
					message: "Invalid payment signature",
				},
				{ status: 400 }
			);
		}
	} catch (error) {
		console.error("Payment verification error:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Payment verification failed",
				error: error.message,
			},
			{ status: 500 }
		);
	}
}
