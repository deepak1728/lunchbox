import { useNavigate } from "react-router-dom";
import type { PlateType } from "../types";
import { useEffect } from "react";

interface Props {
  setPlateType: (type: PlateType | null) => void;
}

const PlateSelection = ({ setPlateType }: Props) => {
  const navigate = useNavigate();

  // Reset on mount
  useEffect(() => {
    setPlateType(null);
    localStorage.removeItem("plateType");
  }, [setPlateType]);

  const handleSelect = (type: PlateType) => {
    setPlateType(type);
    navigate("/items", {
      state: {
        plateType: type,
        price: type === "veg" ? 7.99 : 8.99,
      },
    });
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const fallback = e.currentTarget.nextElementSibling;
    if (fallback instanceof HTMLElement) {
      e.currentTarget.style.display = "none";
      fallback.style.display = "flex";
    }
  };

  return (
    <div className="text-center px-4 sm:px-0 pt-15 mt-0">
      {/* Header */}
      <div className="flex flex-col items-center space-y-2 mb-8">
        <img
          src="/images/logo.jpg"
          alt="Logo"
          className="w-20 h-20 object-cover rounded-full shadow"
          onError={handleImageError}
        />
        <h1 className="text-2xl sm:text-4xl font-serif tracking-wide uppercase text-gray-800">
          Amrutha Vilas
        </h1>
        <h2 className="text-sm sm:text-base font-serif uppercase text-gray-500 tracking-wider">
          Indian Restaurant
        </h2>
        <div className="mt-2 pt-15">
          <span className="text-xl sm:text-2xl font-bold text-orange-600 border border-orange-300 px-4 py-1 rounded-md shadow-sm">
            CORPORATE LUNCH BOX
          </span>
        </div>
      </div>

      {/* Options */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-10 mt-10 pt-10">
        {/* VEG */}
        <div
          onClick={() => handleSelect("veg")}
          className="cursor-pointer w-full sm:w-80 max-w-xs border rounded-xl shadow-md hover:shadow-lg transition-transform duration-200"
        >
          <div className="h-52 overflow-hidden rounded-t-xl">
            <img
              src="/images/veg-plate.jpg"
              alt="Veg Plate"
              className="object-cover w-full h-full"
              onError={handleImageError}
            />
          </div>
          <div className="bg-white py-4">
            <div className="text-lg sm:text-xl font-semibold tracking-wide uppercase text-gray-800">
              VEG PLATE
            </div>
            <div className="mt-1 text-orange-500 text-base font-bold">
              $7.99
            </div>
          </div>
        </div>

        {/* NON-VEG */}
        <div
          onClick={() => handleSelect("nonveg")}
          className="cursor-pointer w-full sm:w-80 max-w-xs border rounded-xl shadow-md hover:shadow-lg transition-transform duration-200"
        >
          <div className="h-52 overflow-hidden rounded-t-xl">
            <img
              src="/images/nonveg-plate.jpg"
              alt="Non-Veg Plate"
              className="object-cover w-full h-full"
              onError={handleImageError}
            />
          </div>
          <div className="bg-white py-4">
            <div className="text-lg sm:text-xl font-semibold tracking-wide uppercase text-gray-800">
              NON-VEG PLATE
            </div>
            <div className="mt-1 text-orange-500 text-base font-bold">
              $8.99
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlateSelection;
