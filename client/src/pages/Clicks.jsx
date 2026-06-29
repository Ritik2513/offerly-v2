import { useEffect, useState } from "react";
import { toast } from "sonner";
import Header from "../components/ui/Header";
import API from "../api/axios";
import TableToolbar from "../components/table/TableToolbar";
import TablePagination from "../components/table/TablePagination";
import ClickTable from "../components/clicks/ClickTable";

const Clicks = () => {
  const [clicks, setClicks] = useState([]);
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

  const fetchClicks = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/clicks", {
        params: {
          page,
          limit: 10,
          search: debouncedSearch,
          status,
        },
      });
      setClicks(data.data?.clicks || []);
      setPagination(data.data?.pagination);
    } catch (error) {
      toast.error("Failed to fetch clicks");
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
    fetchClicks();
  }, [page, debouncedSearch, status]);
  return (
    <>
      <div className="space-y-6 font-inter">
        <Header
          title="Click Logs"
          description="Raw click events streamed in real time."
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
          placeholder="Search Clicks..."
          statusOptions={[
            {
              value: "converted",
              label: "Converted",
            },
            {
              value: "pending",
              label: "Pending",
            },
          ]}
        />

        {/* TABLE */}
        <div className="p-0">
          <ClickTable clicks={clicks} loading={loading} />
        </div>

        <TablePagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          onPageChange={setPage}
        />
      </div>
    </>
  );
};

export default Clicks;
