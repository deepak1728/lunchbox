import React from "react";
import type { Slot } from "../types";

interface Props {
  slot: Slot;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  label?: string;
  children?: React.ReactNode;
}

const ContainerSlot: React.FC<Props> = ({
  x,
  y,
  width,
  height,
  color,
  label,
  children,
}) => {
  return (
    <div
      className="absolute rounded overflow-hidden border shadow"
      style={{
        top: y,
        left: x,
        width,
        height,
        backgroundColor: color,
      }}
    >
      {children ? (
        <div className="w-full h-full relative">
          {children}
          {label && (
            <div className="absolute top-0 left-0 bg-black bg-opacity-50 text-white text-xs px-2 py-1">
              {label}
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white bg-opacity-50">
          {label}
        </div>
      )}
    </div>
  );
};

export default ContainerSlot;
