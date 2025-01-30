"use client";
import { useState, useEffect } from "react";
import Script from "next/script";
import { PricingCard } from "./pricinig-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import { doc, arrayUnion, setDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

export default function PaymentPage() {
	const { user, isPremium, setPremiumStatus, initialized, initializeAuth } =
		useAuthStore();
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [couponCode, setCouponCode] = useState("");
	const [discountedAmount, setDiscountedAmount] = useState(49900);

	// Initialize auth on component mount
	useEffect(() => {
		console.log("Initializing auth in pro page...");
		const unsubscribe = initializeAuth();

		// Cleanup subscription on unmount
		return () => {
			console.log("Cleaning up auth subscription");
			unsubscribe();
		};
	}, []); // Remove initializeAuth from dependencies to prevent re-initialization

	// Debug logging
	useEffect(() => {
		console.log("Auth State:", { initialized, user, isPremium });
	}, [initialized, user, isPremium]);

	// Auth protection
	useEffect(() => {
		if (initialized && !user) {
			console.log("No user found, redirecting to /join");
			router.push("/join");
		}
	}, [initialized, user, router]);

	// Redirect if already premium
	useEffect(() => {
		if (isPremium) {
			router.push("/exams");
		}
	}, [isPremium, router]);

	// Loading states
	if (!initialized || loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-lg">Initializing authentication...</p>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-lg">Please log in to continue...</p>
			</div>
		);
	}

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
				image: "https://your-logo-url.png",
				theme: {
					color: "#2563eb",
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
						console.log("Payment response:", response);

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

						if (!verifyResponse.ok) {
							throw new Error(
								data.message || "Verification failed"
							);
						}

						if (data.success) {
							try {
								// Store payment details in Firestore
								const paymentDetails = {
									paymentId: response.razorpay_payment_id,
									orderId: response.razorpay_order_id,
									amount: discountedAmount,
									currency: "INR",
									timestamp: new Date().toISOString(),
									couponApplied: couponCode || null,
								};

								// First update payment details
								await setDoc(
									doc(db, "users", user.uid),
									{
										payments: arrayUnion(paymentDetails),
									},
									{ merge: true }
								);

								// Then update premium status
								await setPremiumStatus(user.uid, true);

								alert(
									"Payment successful! Your account has been upgraded to Premium."
								);
								router.push("/exams");
							} catch (error) {
								console.error(
									"Error updating premium status:",
									error
								);
								// Store error details for debugging
								await setDoc(
									doc(
										db,
										"errors",
										`payment_${response.razorpay_payment_id}`
									),
									{
										userId: user.uid,
										error: error.message,
										timestamp: new Date().toISOString(),
										paymentId: response.razorpay_payment_id,
									}
								);
								alert(
									"Payment was successful, but there was an error updating your account. Our team has been notified and will fix this soon. Your payment ID: " +
										response.razorpay_payment_id
								);
							}
						} else {
							throw new Error(
								data.message || "Verification failed"
							);
						}
					} catch (err) {
						console.error("Payment verification error:", err);
						alert(
							"There was an issue verifying your payment. If amount was deducted, please contact support with your payment ID: " +
								response.razorpay_payment_id
						);
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

			paymentObject.on("payment.failed", function (response) {
				console.error("Payment failed:", response.error);
				alert(`Payment Failed: ${response.error.description}`);
			});

			paymentObject.on("payment.cancel", function () {
				alert("Payment was cancelled");
			});

			paymentObject.open();
		} catch (error) {
			console.error("Payment error:", error);
			alert("Payment failed: " + error.message);
		} finally {
			setLoading(false);
		}
	};

	// Add test function
	const testFirebaseWrite = async () => {
		try {
			if (!user) {
				alert("Please login first");
				router.push("/join");
				return;
			}

			setLoading(true);
			console.log("Testing Firebase write with user:", user.uid);

			// Test basic user document write
			const userRef = doc(db, "users", user.uid);
			await setDoc(
				userRef,
				{
					testWrite: new Date().toISOString(),
					email: user.email,
				},
				{ merge: true }
			);

			// Test payments array
			const testPayment = {
				paymentId: "test_" + Date.now(),
				amount: 49900,
				currency: "INR",
				timestamp: new Date().toISOString(),
				isTest: true,
			};

			await setDoc(
				userRef,
				{
					payments: arrayUnion(testPayment),
				},
				{ merge: true }
			);

			// Test premium status update
			await setPremiumStatus(user.uid, true);

			alert("Firebase write test successful!");
			console.log("All Firebase writes completed successfully");
		} catch (error) {
			console.error("Firebase write test failed:", error);
			alert("Firebase write test failed: " + error.message);
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
			<div className="max-w-md mx-auto -mt-20 mb-20 p-6 bg-white rounded-lg shadow-md space-y-4">
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
