import { useEffect, useState } from "react";
import API from "../api/axios";
import { toast } from "sonner";
import { Copy, Link2, Users, BadgeDollarSign } from "lucide-react";

const TrackingLinks = () => {
  const [offers, setOffers] = useState([]);
  const [affiliates, setAffiliates] = useState([]);

  const [loading, setLoading] = useState(false);

  const [generatedLink, setGeneratedLink] = useState("");

  const [form, setForm] = useState({
    affiliateId: "",
    offerId: "",
  });

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [offersRes, affiliatesRes] = await Promise.all([
          API.get("/offers"),
          API.get("/users/affiliates"),
        ]);

        setOffers(offersRes.data.data?.offers || []);
        setAffiliates(affiliatesRes.data?.users || []);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch data");
      }
    };

    fetchData();
  }, []);

  // Generate Tracking Link
  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!form.affiliateId || !form.offerId) {
      return toast.error("Please select affiliate and offer");
    }

    if (loading) return;

    setLoading(true);

    const toastId = toast.loading("Generating tracking link...");

    try {
      const { data } = await API.post("/tracking/generate", form);

      setGeneratedLink(data.trackingUrl);

      toast.success("Tracking link generated", {
        id: toastId,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate link", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  // Copy Link
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);

      toast.success("Copied to clipboard");
    } catch (error) {
      toast.error("Copy failed");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto font-inter">
      {/* PAGE HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-2xl font-bold tracking-tight text-[#071437]">
          Tracking Links
        </h1>

        <p className="text-sm text-[#5E6278] mt-2">
          Generate personalized affiliate tracking URLs and monitor campaign
          performance efficiently.
        </p>
      </div>

      {/* CARD */}
      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
        {/* TOP */}
        <div className="border-b border-gray-200 px-6 py-5 bg-linear-to-r from-blue-50 to-indigo-50">
          <h2 className="text-lg font-semibold text-gray-900">
            Generate Tracking Link
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Select an affiliate and offer to create a unique tracking URL.
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleGenerate} className="p-6 sm:p-8 space-y-6">
          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* AFFILIATE */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Users size={16} />
                Affiliate
              </label>

              <select
                value={form.affiliateId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    affiliateId: e.target.value,
                  })
                }
                className="
                  w-full border border-gray-300
                  rounded-2xl px-4 py-3
                  bg-white
                  outline-none
                  focus:ring-4 focus:ring-blue-100
                  focus:border-blue-500
                  transition
                "
              >
                <option value="">Select Affiliate</option>

                {affiliates.map((affiliate) => (
                  <option key={affiliate.id} value={affiliate.id}>
                    {affiliate.name}
                  </option>
                ))}
              </select>
            </div>

            {/* OFFER */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <BadgeDollarSign size={16} />
                Offer
              </label>

              <select
                value={form.offerId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    offerId: e.target.value,
                  })
                }
                className="
                  w-full border border-gray-300
                  rounded-2xl px-4 py-3
                  bg-white
                  outline-none
                  focus:ring-4 focus:ring-blue-100
                  focus:border-blue-500
                  transition
                "
              >
                <option value="">Select Offer</option>

                {offers.map((offer) => (
                  <option key={offer.id} value={offer.id}>
                    {offer.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full sm:w-auto
              bg-blue-600 hover:bg-blue-700
              text-white
              px-6 py-3
              rounded-2xl
              font-semibold
              transition
              disabled:opacity-50
              disabled:cursor-not-allowed
              cursor-pointer
              shadow-sm
            "
          >
            {loading ? "Generating..." : "Generate Tracking Link"}
          </button>
        </form>

        {/* GENERATED LINK */}
        {generatedLink && (
          <div className="border-t border-gray-200 bg-gray-50 p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Link2 size={18} className="text-blue-600" />
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  Generated Tracking URL
                </h3>

                <p className="text-sm text-gray-500">
                  Copy and share this link with your affiliate.
                </p>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-3">
              <input
                readOnly
                value={generatedLink}
                className="
                  flex-1
                  border border-gray-300
                  rounded-2xl
                  px-4 py-3
                  bg-white
                  text-sm text-gray-700
                  outline-none
                "
              />

              <button
                onClick={copyLink}
                type="button"
                className="
                  flex items-center justify-center
                  gap-2
                  bg-black hover:bg-gray-800
                  text-white
                  px-6 py-3
                  rounded-2xl
                  font-medium
                  transition
                  cursor-pointer
                  whitespace-nowrap
                "
              >
                <Copy size={18} />
                Copy Link
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingLinks;
