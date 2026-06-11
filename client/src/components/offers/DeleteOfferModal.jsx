import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import API from "../../api/axios";
import { useState } from "react";

const DeleteOfferModal = ({ offer, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!offer?._id) return;

    try {
      setLoading(true);

      const toastId = toast.loading("Deleting offer...");

      await API.delete(`/offers/${offer._id}`);

      toast.success("Offer deleted", {
        id: toastId,
      });

      onSuccess(offer._id);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete offer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center">
      {/* Icon */}
      <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-5">
        <Trash2 size={28} className="text-red-600" />
      </div>

      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-900">Delete Offer</h2>

      {/* Description */}
      <p className="text-sm text-gray-500 mt-2 leading-relaxed">
        Are you sure you want to delete
        <span className="font-semibold text-gray-800"> {offer?.title} </span>
        ?
        <br />
        This action cannot be undone.
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <button
          onClick={onClose}
          disabled={loading}
          className="flex-1 border border-gray-300 hover:bg-gray-100 text-gray-700 py-3 rounded-xl font-medium transition"
        >
          Cancel
        </button>

        <button
          onClick={handleDelete}
          disabled={loading}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-medium transition disabled:opacity-50"
        >
          {loading ? "Deleting..." : "Delete Offer"}
        </button>
      </div>
    </div>
  );
};

export default DeleteOfferModal;
