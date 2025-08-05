import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import type { CartOrder } from "../types";

const CartIcon: React.FC = () => {
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  const getCartCount = () => {
    const cart: CartOrder[] = JSON.parse(
      localStorage.getItem("lunchBoxCart") || "[]"
    );
    const totalQuantity = cart.reduce((acc, order) => acc + order.quantity, 0);
    setCartCount(totalQuantity);
  };

  useEffect(() => {
    getCartCount();

    const handleStorageChange = () => {
      getCartCount();
    };

    const handleCartUpdated = () => {
      getCartCount();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cart-updated", handleCartUpdated);

    const interval = setInterval(() => {
      getCartCount();
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cart-updated", handleCartUpdated);
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      className="fixed top-4 right-4 z-50 cursor-pointer"
      onClick={() => navigate("/cart")}
    >
      <div className="relative">
        <ShoppingCart className="w-8 h-8 text-gray-800" />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {cartCount}
          </span>
        )}
      </div>
    </div>
  );
};

export default CartIcon;
