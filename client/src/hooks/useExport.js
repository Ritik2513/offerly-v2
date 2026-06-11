import API from "../api/axios";

const useExport = () => {
  const exportFile = async (url, filename) => {
    const response = await API.get(url, {
      responseType: "blob",
    });

    const blob = new Blob([response.data]);

    const link = document.createElement("a");

    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };
  return { exportFile };
};

export default useExport;
