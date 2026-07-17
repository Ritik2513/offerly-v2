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
    <div className="flex items-center justify-between w-full">
      {/* Left Section */}
      <div className="hidden md:flex flex-col">
        <h2 className="text-xl font-semibold text-gray-900">
          Welcome back, {user?.name ?? "User"} 👋
        </h2>

        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
          <span className="font-medium text-gray-700">
            {user?.tenant?.companyName}
          </span>

          <span>•</span>

          <span>{user?.role}</span>

          {user?.tenant?.slug && (
            <>
              <span>•</span>
              <span className="text-indigo-600">/{user.tenant.slug}</span>
            </>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center relative">
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 rounded-xl px-2 py-1 hover:bg-gray-100 transition cursor-pointer"
          >
            {/* Avatar */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white font-semibold">
              {user?.name?.charAt(0).toUpperCase() ?? "U"}
            </div>

            {/* User Details */}
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-sm font-semibold text-gray-900">
                {user?.name}
              </span>

              <span className="text-xs text-gray-500">{user?.email}</span>
            </div>

            <ChevronDown
              size={18}
              className={`transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>

          {open && (
            <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden z-50">
              {/* User Info */}
              <div className="px-5 py-4 border-b">
                <p className="font-semibold text-gray-900">{user?.name}</p>

                <p className="text-sm text-gray-500">{user?.email}</p>

                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full bg-indigo-50 px-2 py-1 text-xs text-indigo-600">
                    {user?.role}
                  </span>

                  {user?.tenant?.companyName && (
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                      {user.tenant.companyName}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="py-2">
                <button
                  onClick={() => navigate("/profile")}
                  className="flex w-full items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  <User size={16} />
                  Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition"
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
