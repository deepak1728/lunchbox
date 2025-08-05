import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import PlateSelection from "./components/PlateSelection";
import StepItemSelection from "./components/StepItemSelection";
import StepPayment from "./components/StepPayment";
import StripeWrapper from "./components/StripeWrapper";
import MainLayout from "./components/MainLayout";
import AdminPanel from "./components/AdminPanel";
import Cart from "./components/Cart";
import CartIcon from "./components/CartIcon";
import type { PlateType, Item } from "./types";
import { addToGlobalCart } from "./components/Cart";

function App() {
  const [plateType, setPlateType] = useState<PlateType | null>(null);
  const [selectedItems, setSelectedItems] = useState<
    Partial<Record<Item["slot"], Item>>
  >({});
  const [quantity, setQuantity] = useState<number>(1);
  const [curries, setCurries] = useState<Item[]>([]);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    try {
      const storedPlateType = localStorage.getItem("plateType");
      if (storedPlateType) {
        setPlateType(JSON.parse(storedPlateType));
      }
    } catch (error) {
      console.error("Error parsing stored plate type:", error);
      localStorage.removeItem("plateType");
    }
  }, []);

  useEffect(() => {
    if (plateType) {
      localStorage.setItem("plateType", JSON.stringify(plateType));
    } else {
      localStorage.removeItem("plateType");
    }
  }, [plateType]);

  useEffect(() => {
    const protectedRoutes = ["/items"];
    const currentPath = location?.pathname || "";

    if (!plateType && protectedRoutes.includes(currentPath)) {
      try {
        const storedPlateType = localStorage.getItem("plateType");
        if (storedPlateType) {
          setPlateType(JSON.parse(storedPlateType));
        } else {
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error("Error in route protection:", error);
        navigate("/", { replace: true });
      }
    }
  }, [plateType, location?.pathname, navigate]);

  const handleSelectItem = (slot: Item["slot"], item: Item) => {
    setSelectedItems((prev) => ({ ...prev, [slot]: item }));
  };

  const handleRemoveItem = (slot: Item["slot"]) => {
    setSelectedItems((prev) => {
      const updated = { ...prev };
      delete updated[slot];
      return updated;
    });
  };

  const handleAddToCart = () => {
    if (!plateType) return;

    try {
      const pricePerBox = plateType === "veg" ? 7.99 : 8.99;

      addToGlobalCart({
        plateType,
        selectedItems,
        quantity,
        pricePerBox,
        defaultCurry: {
          id: 999,
          name: plateType === "veg" ? "Mixed Veg Curry" : "Chicken Curry",
          image:
            plateType === "veg"
              ? "/images/veg-curry.png"
              : "/images/chicken.jpg",
          slot: "curry",
        },
        defaultDal: {
          id: 998,
          name: "Dal",
          image: "/images/dal.png",
          slot: "dal",
        },
      });

      // Reset
      setPlateType(null);
      setSelectedItems({});
      setQuantity(1);
      setCurries([]);
      localStorage.removeItem("plateType");

      navigate("/cart", { replace: true });
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <div className="relative w-screen bg-gray-50 font-sans min-h-screen">
      <CartIcon />
      <Routes>
        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={<PlateSelection setPlateType={setPlateType} />}
          />
          <Route
            path="/items"
            element={
              plateType ? (
                <StepItemSelection
                  plateType={plateType}
                  selectedItems={selectedItems}
                  onSelect={handleSelectItem}
                  onRemove={handleRemoveItem}
                  quantity={quantity}
                  setQuantity={setQuantity}
                  curries={curries}
                  setCurries={setCurries}
                  onAddToCart={handleAddToCart}
                />
              ) : (
                <div>Loading...</div>
              )
            }
          />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/payment"
            element={
              <StripeWrapper>
                <StepPayment />
              </StripeWrapper>
            }
          />
          <Route
            path="/thank-you"
            element={
              <div className="pt-20 text-center space-y-6">
                <h1 className="text-3xl font-bold text-green-600">
                  Thank You!
                </h1>
                <p className="text-gray-700">
                  Your order has been placed successfully.
                </p>
                <button
                  className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => navigate("/", { replace: true })}
                >
                  Back to Home →
                </button>
              </div>
            }
          />
        </Route>
        <Route path="/admin" element={<AdminPanel />} />
        {/* Catch-all route for unmatched paths */}
        <Route
          path="*"
          element={<PlateSelection setPlateType={setPlateType} />}
        />
      </Routes>
    </div>
  );
}

export default App;
