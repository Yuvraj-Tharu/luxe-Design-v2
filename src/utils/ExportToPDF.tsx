import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Explicitly import autoTable
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
interface ExportToPDFProps {
  tableData: Record<string, any>[];
  headers: string[];
}

const ExportToPDF = ({ tableData, headers }: ExportToPDFProps) => {
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Appointment Request Data', 14, 10);

    const tableColumn = headers;
    const tableRows = tableData.map((row) =>
      headers.map((header) => row[header])
    );

    autoTable(doc, {
      // Use autoTable function explicitly
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save('Appointment Details.pdf');
  };

  return (
    <button
      onClick={exportPDF}
      style={{
        border: 'none',
        background: 'none',
        fontSize: '12px',
        display: 'flex',
        gap: 4,
        fontFamily: 'roboto',
      }}
    >
      <PictureAsPdfIcon fontSize="small" style={{ paddingBottom: 6 }} />
      Export to PDF
    </button>
  );
};

export default ExportToPDF;
