import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="h-full flex items-center justify-between px-4 sm:px-6">
            {/* LEFT SIDE */}
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu size={22} />
              </button>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex-1 flex justify-end">
              <Header />
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
