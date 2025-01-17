"use client";
import { useState, useEffect } from "react";
import Script from "next/script";
import { PricingCard } from "./pricinig-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PaymentPage() {
	const [loading, setLoading] = useState(false);
	const [couponCode, setCouponCode] = useState("");
	const [discountedAmount, setDiscountedAmount] = useState(49900); // Default amount in paise (₹499)

	const features = [
		{
			title: "Premium Features",
			items: [
				"Unlimited Mock Tests",
				"Detailed Performance Analytics",
				"Personalized Study Plans",
				"Priority Support",
				"Ad-free Experience",
				"Download Study Materials",
				"Performance Comparison",
				"Custom Test Creation",
			],
		},
		{
			title: "Additional Benefits",
			items: [
				"24/7 Support Access",
				"Mobile App Access",
				"Certificate of Completion",
				"Progress Tracking",
			],
		},
	];

	const initializeRazorpay = () => {
		return new Promise((resolve) => {
			const script = document.createElement("script");
			script.src = "https://checkout.razorpay.com/v1/checkout.js";
			script.onload = () => {
				resolve(true);
			};
			script.onerror = () => {
				resolve(false);
			};
			document.body.appendChild(script);
		});
	};

	const validateCoupon = async () => {
		try {
			setLoading(true);
			const response = await fetch("/api/validate-coupon", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					couponCode,
				}),
			});

			const data = await response.json();
			if (data.valid) {
				setDiscountedAmount(data.discountedPrice);
				alert(`Coupon applied! ${data.message}`);
			} else {
				alert("Invalid coupon code");
			}
		} catch (error) {
			console.error(error);
			alert("Error validating coupon");
		} finally {
			setLoading(false);
		}
	};

	const makePayment = async () => {
		try {
			setLoading(true);
			const res = await initializeRazorpay();

			if (!res) {
				alert("Razorpay SDK failed to load");
				return;
			}

			const response = await fetch("/api/razorpay", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					amount: discountedAmount,
				}),
			});

			const order = await response.json();

			const options = {
				key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
				amount: order.amount,
				currency: "INR",
				name: "Infinity Mock",
				description: "Infinity Mock Premium Subscription",
				order_id: order.id,
				image: "https://your-logo-url.png", // Add your logo URL here
				theme: {
					color: "#2563eb", // Matches your blue button color
					hide_topbar: false,
					backdrop_color: "rgba(0, 0, 0, 0.4)",
				},
				modal: {
					confirm_close: true,
					animation: true,
					backdropClose: false,
				},
				handler: async function (response) {
					try {
						const verifyResponse = await fetch(
							"/api/verify-payment",
							{
								method: "POST",
								headers: {
									"Content-Type": "application/json",
								},
								body: JSON.stringify({
									razorpay_payment_id:
										response.razorpay_payment_id,
									razorpay_order_id:
										response.razorpay_order_id,
									razorpay_signature:
										response.razorpay_signature,
								}),
							}
						);

						const data = await verifyResponse.json();
						if (data.success) {
							alert("Payment successful");
							// Handle successful payment (e.g., redirect to success page)
						}
					} catch (err) {
						console.error(err);
						alert("Payment verification failed");
					}
				},
				prefill: {
					name: "", // You can prefill from user context if available
					email: "",
					contact: "",
				},
				notes: {
					subscription_type: "Premium",
					coupon_applied: couponCode || "none",
					original_amount: "499.00",
					discounted_amount: (discountedAmount / 100).toFixed(2),
					discount_code: couponCode,
				},
				retry: {
					enabled: true,
					max_count: 3,
				},
				send_sms_hash: true,
				remember_customer: true,
				readonly: {
					email: false,
					contact: false,
				},
				hidden: {
					contact: false,
					email: false,
				},
				invoice: {
					name: true,
					email: true,
					contact: true,
				},
				notify: {
					sms: true,
					email: true,
				},
				options: {
					checkout: {
						method: {
							netbanking: true,
							card: true,
							upi: true,
							wallet: true,
						},
						fields: {
							notes: {
								show: false,
							},
						},
					},
				},
			};

			const paymentObject = new window.Razorpay(options);

			// Customize modal appearance
			paymentObject.on("payment.failed", function (response) {
				alert(`Payment Failed: ${response.error.description}`);
			});

			paymentObject.on("payment.cancel", function () {
				alert("Payment was cancelled");
			});

			paymentObject.open();
		} catch (error) {
			console.error(error);
			alert("Payment failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-100">
			<PricingCard
				title="Infinity Mock Premium"
				description="Unlock unlimited access to premium features and mock tests"
				price={(discountedAmount / 100).toFixed(2)}
				originalPrice="499.00"
				features={features}
				buttonText={loading ? "Processing..." : "Get Premium Access"}
				onButtonClick={makePayment}
			/>
			<div className="max-w-md mx-auto -mt-20 mb-20 p-6 bg-white rounded-lg shadow-md">
				<div className="flex gap-2">
					<Input
						type="text"
						placeholder="Use code SUBHO150 to get ₹150 off"
						value={couponCode}
						onChange={(e) => setCouponCode(e.target.value)}
						className="flex-1"
					/>
					<Button
						onClick={validateCoupon}
						disabled={loading || !couponCode}
						variant="outline"
					>
						Apply
					</Button>
				</div>
			</div>
		</div>
	);
}
