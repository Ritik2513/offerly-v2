import { useAuth } from "../context/AuthContext";
import { LogOut, User, Bell, Moon, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const dropdownRef = useRef();

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="flex items-center justify-end md:justify-between w-full gap-4">
      {/* Left */}
      <div className="hidden sm:block">
        <h2 className="text-lg font-semibold text-gray-800">
          Welcome back, {user?.name}
        </h2>

        <p className="text-xs text-gray-500">Manage your affiliate dashboard</p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5 relative">
        {/* Profile */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 cursor-pointer"
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-indigo-600/70 text-white flex items-center justify-center font-semibold">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            {/* User Info */}
            <div className="hidden sm:block text-left leading-tight">
              <p className="text-sm font-semibold text-gray-800">
                {user?.name || "User"}
              </p>

              <p className="text-xs text-gray-500">{user?.role || ""} </p>
            </div>

            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 top-12 w-60 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
              {/* Email */}
              <div className="px-5 py-4 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-800">
                  {user?.email}
                </p>
              </div>

              {/* Menu */}
              <div className="">
                <button
                  onClick={() => navigate("/profile")}
                  className="w-full flex items-center gap-3 px-5 py-2 text-sm text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                >
                  <User size={16} />
                  Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-5 py-2 text-sm text-red-600 hover:bg-red-50 transition cursor-pointer"
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
