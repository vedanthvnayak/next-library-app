"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Loader2, CheckCircle, ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import { topUpWallet } from "@/app/[locale]/profile/action";

interface PayDetails {
  email: string;
  amount: number;
  paymentId: string;
  orderId: string;
}

export default function PaymentPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [transactionDetails, setTransactionDetails] =
    useState<PayDetails | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const amountParam = searchParams.get("amount");
    const emailParam = searchParams.get("email");
    if (amountParam) setAmount(Number(amountParam));
    if (emailParam) setEmail(emailParam);

    if (amountParam && emailParam) {
      initializePayment(Number(amountParam), emailParam);
    } else {
      setLoading(false);
      console.error("Amount or email is not available");
    }
  }, []);

  const handleTopup = async (paymentDetails: PayDetails) => {
    console.log("Payment successful:", paymentDetails);
    const result = await topUpWallet(
      paymentDetails.email,
      paymentDetails.amount
    );

    if (result.success) {
      console.log(
        "Wallet topped up successfully. New balance:",
        result.newBalance
      );
      // Handle successful top-up (e.g., show success message, update UI)
    } else {
      console.error("Failed to top up wallet:", result.error);
      // Handle error (e.g., show error message)
    }
  };

  const initializePayment = async (
    paymentAmount: number,
    paymentEmail: string
  ) => {
    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: paymentAmount, email: paymentEmail }),
      });
      const order = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        handler: function (response: any) {
          const paymentDetails = {
            email: paymentEmail,
            amount: paymentAmount,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
          };

          setTransactionDetails(paymentDetails);
          handleTopup(paymentDetails);

          // Wait for 3 seconds before redirecting
          setTimeout(() => {
            router.push("/profile");
          }, 3000);
        },
        prefill: {
          name: session?.user?.name,
          email: paymentEmail,
        },
        theme: {
          color: "#111827",
          background: "#111827",
        },
      };

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Error creating order:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin h-12 w-12 text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 shadow-lg rounded-lg overflow-hidden border border-gray-800">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center mb-2 text-white">
            {transactionDetails ? "Payment Successful" : "Payment Summary"}
          </h2>
          <p className="text-center text-gray-400 mb-6">
            {transactionDetails
              ? "Thank you for your payment"
              : "Initiating payment..."}
          </p>
          {transactionDetails && (
            <div className="space-y-4">
              <div className="flex items-center justify-center text-green-500 mb-4">
                <CheckCircle className="w-16 h-16" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-400">
                  Email:{" "}
                  <span className="font-medium text-white">
                    {transactionDetails.email}
                  </span>
                </p>
                <p className="text-sm text-gray-400">
                  Amount:{" "}
                  <span className="font-medium text-white">
                    ₹{transactionDetails.amount}
                  </span>
                </p>
                <p className="text-sm text-gray-400">
                  Payment ID:{" "}
                  <span className="font-medium text-white">
                    {transactionDetails.paymentId}
                  </span>
                </p>
                <p className="text-sm text-gray-400">
                  Order ID:{" "}
                  <span className="font-medium text-white">
                    {transactionDetails.orderId}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
        {transactionDetails && (
          <div className="px-6 pb-6 space-y-2">
            <p className="text-sm text-gray-400">
              Redirecting to profile in 3 seconds...
            </p>
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
              onClick={() => router.push("/profile")}
            >
              Go to Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
