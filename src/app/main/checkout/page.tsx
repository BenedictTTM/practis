"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { DotLoader } from "@/Components/Loaders";
import { useToast } from "@/Components/Toast/toast";
import { AuthService } from "@/lib/auth";
import { clearCart, fetchCart } from "@/lib/cart";
import { placeOrder } from "@/lib/orders";
import { formatGhs } from "@/utilities/formatGhs";
import type { Cart, CartItem } from "@/types/cart";
import {fetchmyorder} from "@/lib/orders";

const phoneNumberSchema = z
	.string()
	.trim()
	.min(8, "Phone number must be at least 8 characters long")
	.regex(/^[0-9+\-\s()]+$/, "Only digits and + - ( ) characters are allowed");

const CheckoutSchema = z.object({
	hall: z
		.string()
		.trim()
		.max(120, "Hall name must be 120 characters or less")
		.optional()
		.or(z.literal("")),
	whatsappNumber: phoneNumberSchema,
	callNumber: phoneNumberSchema,
	message: z
		.string()
		.trim()
		.max(400, "Message must be 400 characters or less")
		.optional()
		.or(z.literal("")),
});

type CheckoutFormValues = z.infer<typeof CheckoutSchema>;

const FEES_RATE = 0.06;

export default function CheckoutPage() {
	const router = useRouter();
	const { showError, showSuccess, showWarning } = useToast();

	const [cart, setCart] = useState<Cart | null>(null);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);

	const {
		register,
		handleSubmit,
		reset,
		setValue,
		formState: { errors },
	} = useForm<CheckoutFormValues>({
		resolver: zodResolver(CheckoutSchema),
		defaultValues: {
			hall: "",
			whatsappNumber: "",
			callNumber: "",
			message: "",
		},
	});

	useEffect(() => {
		const initialize = async () => {
			setLoading(true);
			try {
				const authenticated = await AuthService.isAuthenticated();
				if (!authenticated) {
					router.replace("/auth/login?redirect=/main/cart&checkout=true");
					return;
				}


			

	const totals = useMemo(() => {
		const subtotal = cart?.subtotal ?? 0;
		const fees = subtotal > 0 ? Number((subtotal * FEES_RATE).toFixed(2)) : 0;
		const total = Number((subtotal + fees).toFixed(2));
		return { subtotal, fees, total };
	}, [cart]);

	const onSubmit = handleSubmit(async (values) => {
		if (!cart || cart.items.length === 0) {
			showError("Your cart is empty", {
				description: "Add items before placing an order.",
			});
			return;
		}

		setSubmitting(true);

		const hallPayload = values.hall?.trim()
			? values.hall.trim()
			: undefined;
		const trimmedMessage = values.message?.trim();
		const messagePayload = trimmedMessage && trimmedMessage.length > 0 ? trimmedMessage : undefined;

		const createdOrders: number[] = [];

		try {
			// Place orders sequentially to keep stock checks consistent.
			for (const item of cart.items) {
				const response = await placeOrder({
					productId: item.product.id,
					quantity: item.quantity,
					whatsappNumber: values.whatsappNumber.trim(),
					callNumber: values.callNumber.trim(),
					hall: hallPayload,
					message: messagePayload,
				});

				if (!response.success) {
					throw new Error(response.message || "Failed to place order");
				}

				const orderId = response.data?.id;
				if (orderId) {
					createdOrders.push(orderId);
				}
			}

			const clearResult = await clearCart();
			if (clearResult.success) {
				setCart(clearResult.data || null);
			} else {
				showWarning("Order placed but cart not cleared", {
					description:
						clearResult.message || "Please refresh the page to update your cart.",
				});
			}

			reset();

			const successDescription =
				createdOrders.length > 1
					? `Created ${createdOrders.length} orders. We'll reach out shortly to finalize delivery.`
					: "Your order was submitted. Our team will reach out shortly.";

			showSuccess("Order confirmed", { description: successDescription });

			setTimeout(() => {
				router.push("/main/products");
			}, 800);
		} catch (error) {
			const partialMessage =
				createdOrders.length > 0
					? ` Some orders were created (IDs: ${createdOrders.join(", ")}). Please contact support to confirm their status.`
					: "";

			showError("Unable to place order", {
				description:
					(error instanceof Error
						? error.message
						: "Unexpected error occurred while placing your order.") + partialMessage,
			});
		} finally {
			setSubmitting(false);
		}
	});

	if (loading) {
		return (
					<div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
						<DotLoader size={56} ariaLabel="Loading checkout" />
						<p className="mt-4 text-sm text-gray-600">Preparing your checkout...</p>
			</div>
		);
	}

	if (!cart || cart.items.length === 0) {
		return (
			<div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
				Your cart is empty
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8 sm:py-12">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mb-6">
					<h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
					<p className="text-sm text-gray-600 mt-2">
						Provide your contact details and confirm your order.
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<div className="lg:col-span-2 space-y-6">
						<form onSubmit={onSubmit} className="bg-white shadow-sm rounded-lg p-6 space-y-6">
							<section>
								<h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
								<p className="text-xs text-gray-500 mt-1">
									We&apos;ll use these details to coordinate delivery with you.
								</p>

								<div className="mt-4 space-y-4">
									<div>
										<label htmlFor="hall" className="block text-sm font-medium text-gray-700">
											Hall / Delivery Location (optional)
										</label>
										<input
											id="hall"
											type="text"
											{...register("hall")}
											placeholder="e.g., Grand Ballroom"
											className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-red-500 focus:ring-1 focus:ring-red-500"
										/>
										{errors.hall && (
											<p className="mt-1 text-xs text-red-600">{errors.hall.message}</p>
										)}
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700">
												WhatsApp Number
											</label>
											<input
												id="whatsappNumber"
												type="tel"
												{...register("whatsappNumber")}
												placeholder="+233 24 123 4567"
												className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-red-500 focus:ring-1 focus:ring-red-500"
											/>
											{errors.whatsappNumber && (
												<p className="mt-1 text-xs text-red-600">{errors.whatsappNumber.message}</p>
											)}
										</div>

										<div>
											<label htmlFor="callNumber" className="block text-sm font-medium text-gray-700">
												Call Number
											</label>
											<input
												id="callNumber"
												type="tel"
												{...register("callNumber")}
												placeholder="+233 20 765 4321"
												className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-red-500 focus:ring-1 focus:ring-red-500"
											/>
											{errors.callNumber && (
												<p className="mt-1 text-xs text-red-600">{errors.callNumber.message}</p>
											)}
										</div>
									</div>

									<div>
										<label htmlFor="message" className="block text-sm font-medium text-gray-700">
											Message for Seller (optional)
										</label>
										<textarea
											id="message"
											rows={3}
											{...register("message")}
											placeholder="Share any delivery notes or special instructions"
											className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-red-500 focus:ring-1 focus:ring-red-500"
										/>
										{errors.message && (
											<p className="mt-1 text-xs text-red-600">{errors.message.message}</p>
										)}
									</div>
								</div>
							</section>

							<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-200">
								<p className="text-xs text-gray-500">
									By confirming purchase you agree to our {" "}
									<span className="font-medium text-gray-700">terms of sale</span>.
								</p>
								<button
									type="submit"
									disabled={submitting}
									className="inline-flex items-center justify-center rounded-md bg-red-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
								>
														{submitting ? (
															<>
																<DotLoader size={20} ariaLabel="Placing order" />
																<span className="ml-2">Processing...</span>
															</>
														) : (
															"Confirm Purchase"
														)}
								</button>
							</div>
						</form>
					</div>

					<div className="space-y-6">
						<OrderSummaryCard
							items={cart.items}
							subtotal={totals.subtotal}
							fees={totals.fees}
							total={totals.total}
						/>

						<div className="bg-white rounded-lg shadow-sm p-5 text-sm text-gray-600">
							<h3 className="text-base font-semibold text-gray-900 mb-3">Need help?</h3>
							<p>
								Our team will reach out after you confirm your order to finalize delivery and payment details.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

type OrderSummaryCardProps = {
	items: CartItem[];
	subtotal: number;
	fees: number;
	total: number;
};

function OrderSummaryCard({ items, subtotal, fees, total }: OrderSummaryCardProps) {
	return (
		<div className="bg-white rounded-lg shadow-sm p-6">
			<h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>

			<div className="mt-4 space-y-4">
				{items.map((item) => {
					const imageSrc = resolveProductImage(item);

					return (
						<div key={item.id} className="flex gap-3">
							<div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
								<Image
									src={imageSrc}
									alt={item.product.title}
									fill
									sizes="64px"
									className="object-cover"
								/>
							</div>
							<div className="flex-1 min-w-0">
								<p className="text-sm font-medium text-gray-900 truncate">{item.product.title}</p>
								<p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
								<p className="text-sm font-semibold text-gray-900 mt-1">{formatGhs(item.itemTotal)}</p>
							</div>
						</div>
					);
				})}
			</div>

			<div className="mt-6 space-y-3 border-t border-gray-200 pt-4">
				<SummaryRow label="Subtotal" value={formatGhs(subtotal)} />
				<SummaryRow label="Taxes & Fees (6%)" value={formatGhs(fees)} />
				<div className="flex items-center justify-between text-base font-semibold text-gray-900">
					<span>Total Amount</span>
					<span>{formatGhs(total)}</span>
				</div>
			</div>
		</div>
	);
}

function SummaryRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex items-center justify-between text-sm text-gray-600">
			<span>{label}</span>
			<span className="font-medium text-gray-900">{value}</span>
		</div>
	);
}
