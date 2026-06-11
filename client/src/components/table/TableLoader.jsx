const TableLoader = ({ rows = 5, cols = 8 }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <table className="w-full">
        <tbody>
          {[...Array(rows)].map((_, row) => (
            <tr key={row} className="border-b">
              {[...Array(cols)].map((_, col) => (
                <td key={col} className="p-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableLoader;
