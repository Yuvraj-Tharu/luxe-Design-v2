import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { IconFileTypeXls } from '@tabler/icons-react';

interface ExportToExcelProps {
  tableData: Record<string, any>[];
  headers: string[];
}
const ExportToExcel = ({ tableData, headers }: ExportToExcelProps) => {
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const data = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    saveAs(data, 'Appointment Details.xlsx');
  };

  return (
    <button
      onClick={exportExcel}
      style={{
        border: 'none',
        background: 'none',
        fontSize: '12px',
        color: '#fffff',
        display: 'flex',
        fontFamily: 'roboto',
      }}
    >
      <IconFileTypeXls fontSize="small" style={{ paddingBottom: 8 }} />
      Export to Excel
    </button>
  );
};

export default ExportToExcel;
