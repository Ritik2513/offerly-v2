import { useState, useEffect } from "react";
import API from "../api/axios";
import { toast } from "sonner";
import { Download } from "lucide-react";
import ConversionTable from "../components/conversions/ConversionTable";
import ConversionStats from "../components/conversions/ConversionStats";
import Header from "../components/ui/Header";
import TableToolbar from "../components/table/TableToolbar";
import TablePagination from "../components/table/TablePagination";
import useExport from "../hooks/useExport"; //custom hook

const Conversions = () => {
  const [conversions, setConversions] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Custom hook to download csv file
  const { exportFile } = useExport();

  // Fetch conversions
  const fetchConversions = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/conversions", {
        params: {
          page,
          limit: 10,
          search: debouncedSearch,
          status,
        },
      });
      setConversions(data.data?.conversions || []);
      setAnalytics(data.data?.analytics || {});
      setPagination(data.data?.pagination);
    } catch (error) {
      toast.error("Failed to fetch conversions");
    } finally {
      setLoading(false);
    }
  };

  //search after user type whole word
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // fetch data with certain conditions
  useEffect(() => {
    fetchConversions();
  }, [page, debouncedSearch, status]);

  const handleExportConversions = () => {
    exportFile("/conversions/export", "conversions.csv");
  };

  return (
    <div className="space-y-6 font-inter">
      {/* PAGE HEADER */}
      <Header
        title="Conversions"
        description="Review, manage, and monitor affiliate conversion activity."
        actions={[
          {
            label: "Export CSV",
            icon: <Download size={18} />,
            variant: "secondary",
            onClick: handleExportConversions,
          },
        ]}
      />

      {/* STATS */}
      <ConversionStats analytics={analytics} />

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
        placeholder="Search conversions..."
        statusOptions={[
          {
            value: "approved",
            label: "Approved",
          },
          {
            value: "pending",
            label: "Pending",
          },
          {
            value: "rejected",
            label: "Rejected",
          },
        ]}
      />

      {/* TABLE */}
      <div className="p-0">
        <ConversionTable conversions={conversions} loading={loading} />
      </div>

      <TablePagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        onPageChange={setPage}
      />
    </div>
  );
};

export default Conversions;
