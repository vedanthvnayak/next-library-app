"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Loader2, CheckCircle, ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

export default function PaymentPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = new URLSearchParams(window.location.search);
  const id = searchParams.get("id");

  const [loading, setLoading] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState(null);

  const handlePayNow = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/create-order", { method: "POST" });
      const order = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        handler: function (response: any) {
          setTransactionDetails({
            professorId: id,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
          });
        },
        prefill: {
          name: session?.user?.name,
          email: session?.user?.email,
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
              : "Please review your payment details"}
          </p>
          {!transactionDetails ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-white">
                <span className="font-medium">Consultation Fee</span>
                <span className="font-bold">₹300</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-400">
                <span>Professor ID</span>
                <span>{id}</span>
              </div>
              <div className="border-t border-gray-700 pt-4">
                <div className="flex justify-between items-center font-bold text-white">
                  <span>Total</span>
                  <span>₹300</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center text-green-500 mb-4">
                <CheckCircle className="w-16 h-16" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-400">
                  Professor ID:{" "}
                  <span className="font-medium text-white">
                    {transactionDetails.professorId}
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
        <div className="px-6 pb-6 space-y-2">
          {!transactionDetails ? (
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
              onClick={handlePayNow}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  Processing
                </span>
              ) : (
                "Pay Now"
              )}
            </button>
          ) : (
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
              onClick={() => router.push(`/professors/${id}`)}
            >
              Continue To Select Booking Date
            </button>
          )}
          <button
            className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-150 ease-in-out flex items-center justify-center"
            onClick={() => router.push(`/professors/`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
