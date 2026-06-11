import { useState } from "react";
import API from "../../api/axios";
import { toast } from "sonner";

const CreateOfferForm = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    landingPageUrl: "",
    payout: "",
    status: "active",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    const toastId = toast.loading("Creating offer...");

    try {
      const { data } = await API.post("/offers", form);

      toast.success("Offer created successfully", {
        id: toastId,
      });

      onSuccess(data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create offer",
        {
          id: toastId,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Offer Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Offer Name
          </label>

          <input
            type="text"
            name="title"
            required
            value={form.title}
            onChange={handleChange}
            placeholder="Amazon Gift Cards"
            className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>

          <input
            type="text"
            name="category"
            required
            value={form.category}
            onChange={handleChange}
            placeholder="E-Commerce"
            className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition"
          />
        </div>

        {/* Payout */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payout
          </label>

          <input
            type="number"
            name="payout"
            required
            value={form.payout}
            onChange={handleChange}
            placeholder="500"
            className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition"
          />
        </div>

        {/* URL */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Landing Page URL
          </label>

          <input
            type="url"
            name="landingPageUrl"
            required
            value={form.landingPageUrl}
            onChange={handleChange}
            placeholder="https://comparevidya.com"
            className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>

          <textarea
            rows={4}
            name="description"
            required
            value={form.description}
            onChange={handleChange}
            placeholder="Write short offer description..."
            className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none resize-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition"
          />
        </div>

        {/* Status */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition bg-white"
          >
            <option value="active">Active</option>
            <option value="paused">Paused</option>
          </select>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-semibold transition disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Creating..." : "Create Offer"}
        </button>
      </div>
    </form>
  );
};

export default CreateOfferForm;