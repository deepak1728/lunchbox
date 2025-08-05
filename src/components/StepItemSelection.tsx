// import React, { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import type { Item, Slot, PlateType } from "../types";
// import LunchBoxPreview from "./LunchBoxPreview";

// interface StepItemSelectionProps {
//   plateType: PlateType;
//   selectedItems: Partial<Record<Slot, Item>>;
//   onSelect: (slot: Slot, item: Item) => void;
//   onRemove: (slot: Slot) => void;
//   quantity: number;
//   setQuantity: React.Dispatch<React.SetStateAction<number>>;
//   curries: Item[];
//   setCurries: React.Dispatch<React.SetStateAction<Item[]>>;
//   onAddToCart: () => void;
// }

// const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// const riceItems: Item[] = [
//   { id: 1, name: "White Rice", image: "/images/white-rice.png", slot: "rice" },
//   { id: 2, name: "Pulav Rice", image: "/images/pulav-rice.png", slot: "rice" },
// ];

// const StepItemSelection: React.FC<StepItemSelectionProps> = ({
//   plateType,
//   selectedItems,
//   onSelect,
//   onRemove,
//   quantity,
//   setQuantity,
//   curries,
//   setCurries,
//   onAddToCart,
// }) => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!plateType) {
//       navigate("/");
//       return;
//     }

//     fetch(`${apiBaseUrl}/curries?type=${plateType}`)
//       .then((res) => res.json())
//       .then((data: Item[]) => {
//         const curryItems = data.filter(
//           (item) => item.slot === "curry" || item.slot === "dal"
//         );
//         setCurries(curryItems);
//       })
//       .catch(() => {
//         // fallback curry
//         const fallbackCurry: Item = {
//           id: 999,
//           name: plateType === "veg" ? "Mixed Veg Curry" : "Chicken Curry",
//           image:
//             plateType === "veg"
//               ? "/images/veg-curry.png"
//               : "/images/chicken.jpg",
//           slot: "curry",
//         };
//         setCurries([fallbackCurry]);
//       });
//   }, [plateType, navigate, setCurries]);

//   const increment = () => setQuantity((q) => q + 1);
//   const decrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));
//   const isRiceSelected = Boolean(selectedItems["rice"]);

//   return (
//     <div className="w-full px-4 py-8 mx-auto space-y-10 pt-20">
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
//         {/* RICE SELECTION */}
//         <div className="space-y-4 w-full">
//           <h2 className="text-2xl font-bold text-gray-900">
//             What kind of rice would you like?
//           </h2>
//           <div className="grid grid-cols-2 gap-4">
//             {riceItems.map((item) => {
//               const isSelected = selectedItems["rice"]?.id === item.id;
//               return (
//                 <div
//                   key={item.id}
//                   onClick={() => onSelect("rice", item)}
//                   className={`cursor-pointer rounded-lg border-2 p-2 text-center transition-transform transform hover:scale-105 ${
//                     isSelected
//                       ? "bg-blue-500 text-white border-blue-600 shadow-md"
//                       : "bg-white text-gray-800 border-gray-300 hover:border-blue-400"
//                   }`}
//                 >
//                   <img
//                     src={item.image}
//                     alt={item.name}
//                     className="w-full h-24 object-cover rounded mb-2"
//                   />
//                   <p className="font-semibold text-lg">{item.name}</p>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* CURRIES SELECTION */}
//         <div className="space-y-6 p-6 w-full rounded-xl border-4 border-yellow-400 bg-yellow-50">
//           <h2 className="text-2xl font-bold text-yellow-900 text-center">
//             🍛 Today's Curries
//           </h2>
//           <div className="grid grid-cols-2 gap-6 max-h-80 overflow-auto">
//             {curries.map((item) => (
//               <div
//                 key={item.id}
//                 onClick={() => onSelect(item.slot, item)}
//                 className={`cursor-pointer flex flex-col items-center border rounded-lg p-2 shadow-md transition-transform transform hover:scale-105 ${
//                   selectedItems[item.slot]?.id === item.id
//                     ? "bg-green-100 border-green-500"
//                     : "bg-white border-gray-300"
//                 }`}
//               >
//                 <img
//                   src={item.image}
//                   alt={item.name}
//                   className="w-full h-32 object-cover rounded mb-2"
//                 />
//                 <p className="text-sm font-medium text-gray-800">{item.name}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* PREVIEW + ACTIONS */}
//       <div className="space-y-6 text-center">
//         <LunchBoxPreview
//           selectedItems={selectedItems}
//           onRemoveItem={onRemove}
//           defaultCurry={{
//             id: 999,
//             name: plateType === "veg" ? "Mixed Veg Curry" : "Chicken Curry",
//             image:
//               plateType === "veg"
//                 ? "/images/veg-curry.png"
//                 : "/images/chicken.jpg",
//             slot: "curry",
//           }}
//           defaultDal={{
//             id: 998,
//             name: "Dal",
//             image: "/images/dal.png",
//             slot: "dal",
//           }}
//         />

//         {/* QUANTITY CONTROL */}
//         <div className="flex justify-center items-center gap-4 mt-6">
//           <button
//             onClick={decrement}
//             className="bg-red-500 text-white w-8 h-8 rounded-full text-lg font-bold hover:bg-red-600"
//           >
//             −
//           </button>
//           <span className="text-2xl font-bold text-gray-800">{quantity}</span>
//           <button
//             onClick={increment}
//             className="bg-green-500 text-white w-8 h-8 rounded-full text-lg font-bold hover:bg-green-600"
//           >
//             +
//           </button>
//         </div>

//         {/* NAVIGATION BUTTONS */}
//         <div className="flex flex-col sm:flex-row justify-center gap-4">
//           <button
//             onClick={() => navigate("/")}
//             className="w-full sm:w-auto px-6 py-3 rounded bg-blue-600 text-white font-semibold hover:bg-gray-300"
//           >
//             ← Back to Plate Selection
//           </button>
//           <button
//             onClick={onAddToCart}
//             className={`w-full sm:w-auto px-6 py-3 rounded text-white font-semibold ${
//               isRiceSelected
//                 ? "bg-blue-600 hover:bg-blue-700"
//                 : "bg-gray-400 cursor-not-allowed"
//             }`}
//             disabled={!isRiceSelected}
//           >
//             Add to Cart →
//           </button>
//         </div>

//         {!isRiceSelected && (
//           <p className="text-sm text-red-600 font-medium mt-2">
//             ⚠️ Please select a rice item to continue.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default StepItemSelection;

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Item, Slot, PlateType } from "../types";
import LunchBoxPreview from "./LunchBoxPreview";

interface StepItemSelectionProps {
  plateType: PlateType;
  selectedItems: Partial<Record<Slot, Item>>;
  onSelect: (slot: Slot, item: Item) => void;
  onRemove: (slot: Slot) => void;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  curries: Item[];
  setCurries: React.Dispatch<React.SetStateAction<Item[]>>;
  onAddToCart: () => void;
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const riceItems: Item[] = [
  { id: 1, name: "White Rice", image: "/images/white-rice.png", slot: "rice" },
  { id: 2, name: "Pulav Rice", image: "/images/pulav-rice.png", slot: "rice" },
];

const StepItemSelection: React.FC<StepItemSelectionProps> = ({
  plateType,
  selectedItems,
  onSelect,
  onRemove,
  quantity,
  setQuantity,
  curries,
  setCurries,
  onAddToCart,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!plateType) {
      navigate("/");
      return;
    }

    fetch(`${apiBaseUrl}/curries?type=${plateType}`)
      .then((res) => res.json())
      .then((data: Item[]) => {
        const curryItems = data.filter(
          (item) => item.slot === "curry" || item.slot === "dal"
        );

        const hasDal = curryItems.some((item) => item.slot === "dal");
        if (!hasDal) {
          curryItems.push({
            id: 998,
            name: "Dal",
            image: "/images/dal.png",
            slot: "dal",
          });
        }

        setCurries(curryItems);
      })
      .catch(() => {
        const fallbackCurry: Item = {
          id: 999,
          name: plateType === "veg" ? "Mixed Veg Curry" : "Chicken Curry",
          image:
            plateType === "veg"
              ? "/images/veg-curry.png"
              : "/images/chicken.jpg",
          slot: "curry",
        };

        const dalItem: Item = {
          id: 998,
          name: "Dal",
          image: "/images/dal.png",
          slot: "dal",
        };

        setCurries([fallbackCurry, dalItem]);
      });
  }, [plateType, navigate, setCurries]);

  const increment = () => setQuantity((q) => q + 1);
  const decrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));
  const isRiceSelected = Boolean(selectedItems["rice"]);

  return (
    <div className="w-full px-4 py-8 mx-auto space-y-10 pt-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* RICE SELECTION */}
        <div className="space-y-4 w-full">
          <h2 className="text-2xl font-bold text-gray-900">
            What kind of rice would you like?
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {riceItems.map((item) => {
              const isSelected = selectedItems["rice"]?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => onSelect("rice", item)}
                  className={`cursor-pointer rounded-lg border-2 p-2 text-center transition-transform transform hover:scale-105 ${
                    isSelected
                      ? "bg-blue-500 text-white border-blue-600 shadow-md"
                      : "bg-white text-gray-800 border-gray-300 hover:border-blue-400"
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-24 object-cover rounded mb-2"
                  />
                  <p className="font-semibold text-lg">{item.name}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CURRIES SELECTION */}
        <div className="space-y-6 p-6 w-full rounded-xl border-4 border-yellow-400 bg-yellow-50">
          <h2 className="text-2xl font-bold text-yellow-900 text-center">
            🍛 Today's Curries
          </h2>
          <div className="grid grid-cols-2 gap-6 max-h-80 overflow-auto">
            {curries.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelect(item.slot, item)}
                className={`cursor-pointer flex flex-col items-center border rounded-lg p-2 shadow-md transition-transform transform hover:scale-105 ${
                  selectedItems[item.slot]?.id === item.id
                    ? "bg-green-100 border-green-500"
                    : "bg-white border-gray-300"
                }`}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-32 object-cover rounded mb-2"
                />
                <p className="text-sm font-medium text-gray-800">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PREVIEW + ACTIONS */}
      <div className="space-y-6 text-center">
        <LunchBoxPreview
          selectedItems={selectedItems}
          onRemoveItem={onRemove}
          defaultCurry={{
            id: 999,
            name: plateType === "veg" ? "Mixed Veg Curry" : "Chicken Curry",
            image:
              plateType === "veg"
                ? "/images/veg-curry.png"
                : "/images/chicken.jpg",
            slot: "curry",
          }}
          defaultDal={{
            id: 998,
            name: "Dal",
            image: "/images/dal.png",
            slot: "dal",
          }}
        />

        {/* QUANTITY CONTROL */}
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={decrement}
            className="bg-red-500 text-white w-8 h-8 rounded-full text-lg font-bold hover:bg-red-600"
          >
            −
          </button>
          <span className="text-2xl font-bold text-gray-800">{quantity}</span>
          <button
            onClick={increment}
            className="bg-green-500 text-white w-8 h-8 rounded-full text-lg font-bold hover:bg-green-600"
          >
            +
          </button>
        </div>

        {/* NAVIGATION BUTTONS */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="w-full sm:w-auto px-6 py-3 rounded bg-blue-600 text-white font-semibold hover:bg-gray-300"
          >
            ← Back to Plate Selection
          </button>
          <button
            onClick={onAddToCart}
            className={`w-full sm:w-auto px-6 py-3 rounded text-white font-semibold ${
              isRiceSelected
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!isRiceSelected}
          >
            Add to Cart →
          </button>
        </div>

        {!isRiceSelected && (
          <p className="text-sm text-red-600 font-medium mt-2">
            ⚠️ Please select a rice item to continue.
          </p>
        )}
      </div>
    </div>
  );
};

export default StepItemSelection;
