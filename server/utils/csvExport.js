import { Parser } from "json2csv";

export const exportCSV = (res, data, fields, fileName) => {
  const parser = new Parser({ fields });

  const csv = parser.parse(data);

  res.header("Content-Type", "text/csv");

  res.attachment(`${fileName}.csv`);

  return res.send(csv);
};
