import React from "react";
import { Outlet } from "react-router-dom";

const MainLayout: React.FC = () => {
  return (
    <div className="max-w-screen-md mx-auto p-4 space-y-8">
      <Outlet />
    </div>
  );
};

export default MainLayout;
