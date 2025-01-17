import { NextResponse } from "next/server";

// Coupon configuration
const validCoupons = {
	SUBHO150: {
		discountedPrice: 34900, // ₹349 in paise
		originalPrice: 49900, // ₹499 in paise
		discountAmount: 150, // ₹150 off
	},
};

export async function POST(req) {
	try {
		const body = await req.json();
		const { couponCode } = body;

		const coupon = validCoupons[couponCode.toUpperCase()];

		if (coupon) {
			return NextResponse.json({
				valid: true,
				discountedPrice: coupon.discountedPrice,
				discountAmount: coupon.discountAmount,
				message: `₹${coupon.discountAmount} discount applied!`,
			});
		}

		return NextResponse.json({
			valid: false,
			message: "Invalid coupon code",
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Error validating coupon" },
			{ status: 500 }
		);
	}
}
