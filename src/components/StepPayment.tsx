import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { CartOrder } from "../types";
import { updateGlobalCart } from "./Cart";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const StepPayment: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as {
    orders: CartOrder[];
    total: number;
  } | null;

  const selectedItems: CartOrder[] = state?.orders ?? [];
  const totalInCents = Math.round((state?.total ?? 0) * 100);

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  // Redirect to cart if no state found
  useEffect(() => {
    if (!state) navigate("/cart");
  }, [state, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      alert("Card element not found.");
      setIsProcessing(false);
      return;
    }

    try {
      const res = await fetch(`${apiBaseUrl}/api/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalInCents,
          orders: selectedItems,
          customer_email: customerEmail,
          customer_name: customerName,
        }),
      });

      const data = await res.json();

      if (!data.clientSecret) {
        alert("Missing clientSecret from backend.");
        setIsProcessing(false);
        return;
      }

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: customerName,
            email: customerEmail,
          },
        },
      });

      if (result.error) {
        alert("Payment failed: " + result.error.message);
        setIsProcessing(false);
      } else if (result.paymentIntent?.status === "succeeded") {
        setPaymentSuccess(true);
        setIsProcessing(false);
        localStorage.removeItem("lunchBoxCart");
        updateGlobalCart([]);
        navigate("/thank-you");
      }
    } catch (err: any) {
      alert("Unexpected error: " + err.message);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-12 px-4">
      <div className="w-full max-w-3xl mx-auto space-y-8">
        {/* Order Summary */}
        <div className="w-full bg-white rounded-xl border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Order Summary
            </h2>
          </div>
          <div className="p-4 space-y-4">
            {selectedItems.map((order, index) => (
              <div key={index} className="border rounded-lg p-3 bg-gray-50">
                <h3 className="font-medium text-gray-800">
                  #{index + 1} • {order.plateType.toUpperCase()}
                </h3>
                <ul className="text-sm text-gray-700 list-disc pl-4">
                  {Object.entries(order.selectedItems).map(([slot, item]) => (
                    <li key={slot}>
                      {slot}: {item?.name}
                    </li>
                  ))}
                </ul>
                <div className="text-right font-bold text-gray-900 mt-2">
                  ${order.quantity * order.pricePerBox}
                </div>
              </div>
            ))}
            <div className="text-right border-t pt-4 font-bold text-lg">
              Total: ${(totalInCents / 100).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="w-full bg-white rounded-xl border border-gray-200">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 rounded-t-xl">
            <h2 className="text-lg font-semibold text-white">
              Payment Details
            </h2>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-black"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-black"
                />
              </div>

              {/* Stripe Card Input */}
              <div>
                <label
                  htmlFor="card-element"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Card Information
                </label>
                <div
                  id="card-element"
                  className="border-2 border-gray-200 rounded-xl p-4 focus-within:ring-4 focus-within:ring-blue-100"
                >
                  <CardElement
                    key="card-element"
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#1f2937",
                          fontFamily: '"Inter", sans-serif',
                          "::placeholder": { color: "#9ca3af" },
                          iconColor: "#6b7280",
                        },
                        invalid: {
                          color: "#ef4444",
                          iconColor: "#ef4444",
                        },
                      },
                    }}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!stripe || isProcessing || paymentSuccess}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 transform ${
                  paymentSuccess
                    ? "bg-green-600 text-white"
                    : isProcessing
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 shadow-lg hover:shadow-xl text-white"
                }`}
              >
                {paymentSuccess
                  ? "Payment Successful!"
                  : isProcessing
                  ? "Processing Payment..."
                  : `Complete Payment • $${(totalInCents / 100).toFixed(2)}`}
              </button>

              <div className="flex justify-center space-x-6 text-sm text-gray-500 mt-4">
                <span>🔒 SSL Secured</span>
                <span>🛡 PCI Compliant</span>
              </div>
            </form>

            {/* Back to Cart */}
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate("/cart")}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                ← Back to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepPayment;
