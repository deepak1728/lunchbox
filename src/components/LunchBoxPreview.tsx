import React from "react";
import type { Slot, Item } from "../types";

interface Props {
  selectedItems: Partial<Record<Slot, Item>>;
  defaultCurry?: Item;
  defaultDal?: Item;
  onRemoveItem?: (slot: Slot) => void;
}

// const slotColors: Record<Slot, string> = {
//   rice: "#e74c3c",
//   curry: "#3498db",
//   dal: "#27ae60",
//   fruits: "#f39c12",
//   dessert: "#9b59b6",
// };

const slotOrder: Slot[] = ["rice", "curry", "dal", "fruits", "dessert"];

const defaultImages: Record<Slot, string> = {
  rice: "",
  curry: "/images/veg-curry.png",
  dal: "/images/dal.png",
  fruits: "/images/fruits.png",
  dessert: "/images/dessert.png",
};

const LunchBoxPreview: React.FC<Props> = ({
  selectedItems,
  defaultCurry,
  defaultDal,
}) => {
  const getSlotItem = (slot: Slot): Item | undefined => {
    const item = selectedItems[slot];
    if (item) return item;

    if (slot === "curry") return defaultCurry;
    if (slot === "dal") return defaultDal;

    return undefined;
  };

  const filteredSlots: Partial<Record<Slot, Item>> = {};
  for (const slot of slotOrder) {
    const item = getSlotItem(slot);
    if (item) {
      if (slot === "curry" && item.id === defaultDal?.id) continue;
      filteredSlots[slot] = item;
    }
  }

  const ContainerSlot = ({
    slot,
    x,
    y,
    width,
    height,
    label,
  }: {
    slot: Slot;
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
  }) => {
    const item = filteredSlots[slot];
    const imageUrl = item?.image?.trim() || defaultImages[slot];
    const name = item?.name || label;

    return (
      <g>
        <clipPath id={`clip-${slot}`}>
          <rect
            x={x + 2}
            y={y + 2}
            width={width - 4}
            height={height - 4}
            rx="6"
            ry="6"
          />
        </clipPath>
        <image
          href={imageUrl}
          x={x + 2}
          y={y + 2}
          width={width - 4}
          height={height - 4}
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#clip-${slot})`}
        />
        <rect
          x={x + 2}
          y={y + height - 22}
          width={width - 4}
          height="20"
          fill="rgba(0,0,0,0.6)"
        />
        <text
          x={x + width / 2}
          y={y + height - 8}
          textAnchor="middle"
          fontSize="10"
          fontWeight="bold"
          fill="white"
        >
          {name}
        </text>
      </g>
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border mt-8">
      <h3 className="text-center text-lg font-semibold text-gray-800 mb-4">
        Your Lunch Box
      </h3>

      <svg viewBox="0 0 400 300" className="w-full max-w-md mx-auto">
        <rect
          x="30"
          y="30"
          width="340"
          height="240"
          rx="15"
          ry="15"
          fill="#2c3e50"
        />
        <rect
          x="40"
          y="40"
          width="320"
          height="220"
          rx="10"
          ry="10"
          fill="#ecf0f1"
        />

        <ContainerSlot
          slot="rice"
          x={55}
          y={55}
          width={200}
          height={80}
          label="RICE"
        />
        <ContainerSlot
          slot="fruits"
          x={265}
          y={55}
          width={75}
          height={80}
          label="FRUITS"
        />
        <ContainerSlot
          slot="curry"
          x={55}
          y={150}
          width={85}
          height={80}
          label="CURRY"
        />
        <ContainerSlot
          slot="dal"
          x={150}
          y={150}
          width={85}
          height={80}
          label="DAL"
        />
        <ContainerSlot
          slot="dessert"
          x={245}
          y={150}
          width={95}
          height={80}
          label="DESSERT"
        />
      </svg>

      {/* <div className="mt-6">
        <ul className="space-y-2 text-center">
          {slotOrder.map((slot) => {
            const item = filteredSlots[slot];
            if (!item) return null;

            return (
              <li
                key={slot}
                className="text-gray-800 font-medium flex justify-center items-center gap-2"
              >
                <span style={{ color: slotColors[slot] }}>
                  {slot.charAt(0).toUpperCase() + slot.slice(1)}:
                </span>
                <span>{item.name}</span>
                {onRemoveItem && selectedItems[slot] && (
                  <button
                    onClick={() => onRemoveItem(slot)}
                    className="ml-1 text-red-500 hover:text-red-700 text-sm"
                    title="Remove"
                  >
                    Delete
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div> */}
    </div>
  );
};

export default LunchBoxPreview;
