import { useState } from "react";
import API from "../../api/axios";
import { toast } from "sonner";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";

const AffiliateForm = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Handle Change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    const toastId = toast.loading("Creating affiliate...");

    try {
      const { data } = await API.post("/users/create", form);

      toast.success("Affiliate created successfully", {
        id: toastId,
      });

      // Reset form
      setForm({
        name: "",
        email: "",
        password: "",
      });

      // Update UI
      onSuccess(data.user);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create affiliate",
        {
          id: toastId,
        },
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>

          <div className="relative">
            <User
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="
                w-full border border-gray-300
                rounded-2xl pl-11 pr-4 py-3
                bg-white
                outline-none
                transition
                focus:ring-4 focus:ring-blue-100
                focus:border-blue-500
              "
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>

          <div className="relative">
            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="
                w-full border border-gray-300
                rounded-2xl pl-11 pr-4 py-3
                bg-white
                outline-none
                transition
                focus:ring-4 focus:ring-blue-100
                focus:border-blue-500
              "
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>

          <div className="relative">
            <Lock
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="Enter secure password"
              className="
                w-full border border-gray-300
                rounded-2xl pl-11 pr-12 py-3
                bg-white
                outline-none
                transition
                focus:ring-4 focus:ring-blue-100
                focus:border-blue-500
              "
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="
                absolute right-4 top-1/2
                -translate-y-1/2
                text-gray-400 hover:text-gray-600
                transition
                cursor-pointer
              "
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <p className="text-xs text-gray-400 mt-2">
            Use a strong password for affiliate login security.
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="
            w-full
            bg-blue-600 hover:bg-blue-700
            text-white
            py-3.5
            rounded-2xl
            font-semibold
            transition
            disabled:opacity-50
            disabled:cursor-not-allowed
            cursor-pointer
            shadow-sm
          "
        >
          {loading ? "Creating Affiliate..." : "Create Affiliate"}
        </button>
      </form>
    </div>
  );
};

export default AffiliateForm;
