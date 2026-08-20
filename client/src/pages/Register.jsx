import { useState } from "react";
import API from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import socket from "../socket/socket";

const Register = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const toastId = toast.loading("Signing you in...");
    setLoading(true);

    try {
      await API.post("/auth/register", form);
      const { data } = await API.get("/auth/me");
      setUser(data.data.user);

      console.log(data);
      if (!socket.connected) {
        socket.connect();
      }

      toast.success("Welcome back", { id: toastId });
      if (data.data.user.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/affiliate");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 font-inter">
      {/* Left Brand Panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 text-white bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500">
        <div className="text-2xl font-bold tracking-wide">Offerly</div>

        <div>
          <h1 className="text-4xl font-bold leading-tight mb-6">
            The performance OS for modern affiliate networks.
          </h1>
          <p className="opacity-90 max-w-md">
            Track every click, optimize every funnel, and scale payouts without
            spreadsheet chaos.
          </p>

          <div className="flex gap-12 mt-12 text-sm opacity-90">
            <div>
              <p className="text-2xl font-bold">240M+</p>
              <p>Clicks tracked</p>
            </div>
            <div>
              <p className="text-2xl font-bold">12K</p>
              <p>Active offers</p>
            </div>
            <div>
              <p className="text-2xl font-bold">99.99%</p>
              <p>Uptime</p>
            </div>
          </div>
        </div>
        <div className="opacity-70 text-sm">© 2026 Offerly</div>
      </div>

      {/* Right Form Panel */}
      <div className="flex items-center justify-center bg-gray-50 p-6 ">
        <form onSubmit={handleSubmit} className="w-full max-w-lg  p-10">
          <h2 className="text-3xl font-bold mb-2 text-gray-900">
            Welcome back
          </h2>
          <p className="text-gray-500 mb-8">
            Sign in to your Offerly workspace.
          </p>

          {/* EMAIL */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              required
              onChange={handleChange}
              placeholder="John Doe"
              className="mt-1 w-full p-2 border border-gray-300 rounded-xl outline-none shadow-sm"
            />
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              required
              onChange={handleChange}
              placeholder="operator@offerly.io"
              className="mt-1 w-full p-2 border border-gray-300 rounded-xl outline-none shadow-sm"
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              {/* <button
                type="button"
                className="text-sm text-indigo-600 hover:underline"
              >
                Forgot password?
              </button> */}
            </div>

            <input
              type="password"
              name="password"
              required
              onChange={handleChange}
              placeholder="••••••••"
              className="mt-1 w-full p-2 border border-gray-300 rounded-xl outline-none shadow-sm"
            />
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700">
              Company Name
            </label>
            <input
              type="text"
              name="companyName"
              required
              onChange={handleChange}
              placeholder="Click Melon Media Pvt. Ltd."
              className="mt-1 w-full p-2 border border-gray-300 rounded-xl outline-none shadow-sm"
            />
          </div>

          {/* Remember me */}
          {/* <div className="flex items-center gap-2 my-4">
            <input type="checkbox" className="accent-indigo-600 w-4 h-4" />
            <span className="text-sm text-gray-600">Keep me signed in</span>
          </div> */}

          {/* SIGN IN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-white 
  bg-linear-to-r from-indigo-500 to-pink-500 mt-2
  hover:opacity-90 transition shadow-md disabled:opacity-60 cursor-pointer"
          >
            {loading ? "Signing up..." : "Sign up"}
          </button>

          {/* SIGN UP */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account{" "}
            <Link
              to="/login"
              className="text-indigo-600 font-medium hover:underline cursor-pointer"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
