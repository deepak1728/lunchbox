import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Item, Slot, PlateType } from "../types";

export interface CartOrder {
  selectedItems: Partial<Record<Slot, Item>>;
  plateType: PlateType;
  quantity: number;
  pricePerBox: number;
  defaultCurry?: Item;
  defaultDal?: Item;
}

// Global storage
let globalCartOrders: CartOrder[] = JSON.parse(
  localStorage.getItem("lunchBoxCart") || "[]"
);
let cartUpdateCallbacks: (() => void)[] = [];

export const subscribeToCartUpdates = (callback: () => void) => {
  cartUpdateCallbacks.push(callback);
  return () => {
    cartUpdateCallbacks = cartUpdateCallbacks.filter((cb) => cb !== callback);
  };
};

export const updateGlobalCart = (orders: CartOrder[]) => {
  globalCartOrders = orders;
  localStorage.setItem("lunchBoxCart", JSON.stringify(globalCartOrders));
  cartUpdateCallbacks.forEach((callback) => callback());
};

export const addToGlobalCart = (order: CartOrder) => {
  globalCartOrders = [...globalCartOrders, order];
  updateGlobalCart(globalCartOrders);
};

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const [cartOrders, setCartOrders] = useState<CartOrder[]>(globalCartOrders);

  useEffect(() => {
    const unsubscribe = subscribeToCartUpdates(() => {
      setCartOrders([...globalCartOrders]);
    });
    return unsubscribe;
  }, []);

  // const updateQuantity = (index: number, delta: number) => {
  //   const updated = [...globalCartOrders];
  //   updated[index].quantity = Math.max(1, updated[index].quantity + delta);
  //   updateGlobalCart(updated);
  // };

  const removeOrder = (index: number) => {
    const updated = [...globalCartOrders];
    updated.splice(index, 1);
    updateGlobalCart(updated);
  };

  // const duplicateOrder = (index: number) => {
  //   const orderToDuplicate = { ...globalCartOrders[index] };
  //   const updated = [...globalCartOrders];
  //   updated.splice(index + 1, 0, orderToDuplicate);
  //   updateGlobalCart(updated);
  // };

  const swapItem = (orderIndex: number, slot: Slot, newItem: Item) => {
    const updated = [...globalCartOrders];
    updated[orderIndex].selectedItems = {
      ...updated[orderIndex].selectedItems,
      [slot]: newItem,
    };
    updateGlobalCart(updated);
  };

  const getItemName = (order: CartOrder, slot: Slot): string => {
    return (
      order.selectedItems[slot]?.name ||
      (slot === "curry"
        ? order.defaultCurry?.name || "Default Curry"
        : slot === "dal"
        ? order.defaultDal?.name || "Default Dal"
        : " ")
    );
  };

  const calculateTotalBalance = () => {
    return cartOrders.reduce((total, order) => {
      return total + order.quantity * order.pricePerBox;
    }, 0);
  };

  const handleProceedToPayment = () => {
    if (cartOrders.length > 0) {
      navigate("/payment", {
        state: { orders: cartOrders, total: calculateTotalBalance() },
      });
    }
  };

  const riceOptions: Item[] = [
    {
      id: 1,
      name: "White Rice",
      image: "/images/white-rice.png",
      slot: "rice",
    },
    {
      id: 2,
      name: "Pulav Rice",
      image: "/images/pulav-rice.png",
      slot: "rice",
    },
  ];

  const SwapDropdown: React.FC<{
    currentItem: Item | undefined;
    slot: Slot;
    orderIndex: number;
    options: Item[];
  }> = ({ currentItem, slot, orderIndex, options }) => {
    return (
      <select
        value={currentItem?.id || ""}
        onChange={(e) => {
          const selectedItem = options.find(
            (item) => item.id === parseInt(e.target.value)
          );
          if (selectedItem) {
            swapItem(orderIndex, slot, selectedItem);
          }
        }}
        className="text-xs bg-gray-100 border rounded px-1 py-0.5 ml-2"
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 pt-20">
      <h1 className="text-2xl font-bold text-center">Your Cart</h1>

      {cartOrders.length === 0 ? (
        <div className="text-center space-y-4">
          <p className="text-gray-500">Your cart is empty.</p>
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
            onClick={() => navigate("/")}
          >
            ← Start Shopping
          </button>
        </div>
      ) : (
        <>
          {cartOrders.map((order, index) => {
            // const totalPrice = order.quantity * order.pricePerBox;
            return (
              <div
                key={index}
                className="border border-gray-300 rounded-xl p-4 bg-white shadow space-y-3"
              >
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold text-lg">
                    Order #{index + 1} ({order.plateType.toUpperCase()})
                  </h2>
                  <div className="flex gap-2">
                    {/* <button
                      className="text-blue-500 text-sm hover:underline"
                      onClick={() => duplicateOrder(index)}
                    >
                      Duplicate
                    </button> */}
                    <button
                      className="text-red-500 text-sm hover:underline"
                      onClick={() => removeOrder(index)}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <ul className="text-sm text-gray-700 space-y-1 pl-2">
                  <li className="flex items-center">
                    🍚 <b>Rice:</b> {getItemName(order, "rice")}
                    {order.selectedItems.rice && (
                      <SwapDropdown
                        currentItem={order.selectedItems.rice}
                        slot="rice"
                        orderIndex={index}
                        options={riceOptions}
                      />
                    )}
                  </li>
                  <li>
                    🍛 <b>Curry:</b> {getItemName(order, "curry")}
                  </li>
                  <li>
                    🥣 <b>Dal:</b> {getItemName(order, "dal")}
                  </li>
                  <li>
                    🍉 <b>Fruits</b> {getItemName(order, "fruits")}
                  </li>
                  <li>
                    🍰 <b>Dessert</b> {getItemName(order, "dessert")}
                  </li>
                </ul>

                {/* <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(index, -1)}
                      className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                    >
                      −
                    </button>
                    <span className="text-lg font-medium">
                      {order.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(index, 1)}
                      className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-lg font-bold">${totalPrice}</div>
                </div> */}
              </div>
            );
          })}

          <div className="border-t-2 border-gray-300 pt-6 mt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <button
                className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 order-2 sm:order-1"
                onClick={() => navigate("/")}
              >
                ← Add More Orders
              </button>

              <div className="flex flex-col sm:flex-row items-center gap-4 order-1 sm:order-2">
                <div className="text-center sm:text-right">
                  <p className="text-sm text-gray-600">Total Balance</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${calculateTotalBalance()}
                  </p>
                </div>
                <button
                  onClick={handleProceedToPayment}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 font-semibold"
                >
                  Proceed to Payment →
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
