import { Download, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useExport from "../hooks/useExport";
import API from "../api/axios";
import AffiliateTable from "../components/affiliates/AffiliateTable";
import Modal from "../components/ui/Modal";
import AffiliateForm from "../components/affiliates/AffiliateForm";
import TableToolbar from "../components/table/TableToolbar";
import TablePagination from "../components/table/TablePagination";
import Header from "../components/ui/Header";

const Affiliates = () => {
  const [affiliates, setAffiliates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalAffiliates: 0,
  });
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // custom hook to download csv
  const { exportFile } = useExport();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchAffiliates();
  }, [page, debouncedSearch, status]);

  const fetchAffiliates = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/users", {
        params: {
          page,
          limit: 10,
          search: debouncedSearch,
          status,
        },
      });

      setAffiliates(data.data.users || []);
      setPagination(data.data.pagination);
    } catch (error) {
      toast.error("Failed to fetch affiliates");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (affiliate) => {
    try {
      const { data } = await API.patch(`/users/${affiliate._id}/status`);

      setAffiliates((prev) =>
        prev.map((item) => (item._id === affiliate._id ? data.user : item)),
      );

      toast.success(
        affiliate.isActive ? "Affiliate disabled" : "Affiliate enabled",
      );
    } catch (error) {
      toast.error("Failed to update affiliate");
    }
  };

  const handleExportAffiliates = () => {
    exportFile("/users/export", "affiliates.csv");
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <Header
        title="Affiliates"
        description="Manage affiliate accounts."
        actions={[
          {
            label: "Export",
            icon: <Download size={18} />,
            variant: "secondary",
            onClick: handleExportAffiliates,
          },
          {
            label: "Create Affiliate",
            icon: <Plus size={18} />,
            onClick: () => setOpenModal(true),
          },
        ]}
      />

      <TableToolbar
        search={search}
        setSearch={(value) => {
          setPage(1);
          setSearch(value);
        }}
        status={status}
        setStatus={(value) => {
          setPage(1);
          setStatus(value);
        }}
        placeholder="Search Affiliates"
        statusOptions={[
          { value: "true", label: "Active" },
          { value: "false", label: "Inactive" },
        ]}
      />

      {/* TABLE */}
      <AffiliateTable
        affiliates={affiliates}
        loading={loading}
        onToggleStatus={handleToggleStatus}
      />

      <TablePagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalAffiliates}
        onPageChange={setPage}
      />

      {/* MODAL */}
      <Modal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        title="Create Affiliate"
      >
        <AffiliateForm
          onSuccess={(user) => {
            setAffiliates((prev) => [user, ...prev]);

            setOpenModal(false);
          }}
        />
      </Modal>
    </div>
  );
};

export default Affiliates;
