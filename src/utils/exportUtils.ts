import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const exportToCSV = (filename: string, rows: Record<string, any>[]) => {
  if (!rows || !rows.length) return;
  const separator = ',';
  const keys = Object.keys(rows[0]);
  const csvContent =
    keys.join(separator) +
    '\n' +
    rows
      .map((row) => {
        return keys
          .map((k) => {
            let cell = row[k] === null || row[k] === undefined ? '' : row[k];
            cell = cell instanceof Date ? cell.toLocaleString() : cell.toString();
            cell = cell.replace(/"/g, '""');
            if (cell.search(/("|,|\n)/g) >= 0) {
              cell = `"${cell}"`;
            }
            return cell;
          })
          .join(separator);
      })
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToExcel = (filename: string, sheetName: string, data: Record<string, any>[]) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export const exportToPDF = (
  title: string,
  headers: string[],
  data: (string | number)[][],
  filename: string
) => {
  const doc = new jsPDF();

  // Header background (Dark Blue N' Tandinho #0F172A)
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 30, 'F');

  // Title
  doc.setTextColor(245, 163, 0); // Orange #F5A300
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text("TRANSPORTES N' TANDINHO S.A.", 14, 15);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Relatório Executivo: ${title}`, 14, 23);

  // Subhead Date
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(9);
  doc.text(`Gerado em: ${new Date().toLocaleString()} | Sistema de Gestão Empresarial`, 14, 37);

  autoTable(doc, {
    startY: 42,
    head: [headers],
    body: data,
    theme: 'grid',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [245, 163, 0],
      fontStyle: 'bold',
      fontSize: 10
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [30, 41, 59]
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    }
  });

  doc.save(`${filename}.pdf`);
};

export const generateInvoicePDF = (invoice: any) => {
  const doc = new jsPDF();

  // Top Bar
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 35, 'F');

  doc.setTextColor(245, 163, 0);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text("TRANSPORTES N' TANDINHO S.A.", 14, 16);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text("Av. das Indústrias #402, Nampula - Moçambique | NUIT: 400982310", 14, 25);
  doc.text("geral@ntandinho.co.mz | Tel: +258 84 000 0000", 14, 30);

  // Invoice Number & Status
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`FATURA / INVOICE: ${invoice.code}`, 14, 48);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Data de Emissão: ${invoice.issueDate}`, 14, 56);
  doc.text(`Data de Vencimento: ${invoice.dueDate}`, 14, 62);
  doc.text(`Estado: ${invoice.status}`, 14, 68);

  // Customer Box
  doc.setFillColor(241, 245, 249);
  doc.rect(120, 42, 76, 30, 'F');
  doc.setFont('helvetica', 'bold');
  doc.text("CLIENTE / DESTINATÁRIO:", 124, 48);
  doc.setFont('helvetica', 'normal');
  doc.text(`${invoice.customerName}`, 124, 55);
  doc.text(`NUIT: ${invoice.nuit || '400129841'}`, 124, 61);

  // Items Table
  const tableData = invoice.items.map((item: any) => [
    item.description,
    item.quantity,
    `${item.unitPriceMzn.toLocaleString()} MZN`,
    `${item.totalMzn.toLocaleString()} MZN`
  ]);

  autoTable(doc, {
    startY: 78,
    head: [['Descrição do Serviço', 'Qtd', 'Preço Unitário', 'Total']],
    body: tableData,
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [245, 163, 0]
    }
  });

  const finalY = (doc as any).lastAutoTable.previous.finalY || 120;

  // Totals
  doc.setFont('helvetica', 'normal');
  doc.text(`Subtotal:`, 130, finalY + 15);
  doc.text(`${invoice.amountMzn.toLocaleString()} MZN`, 170, finalY + 15);

  doc.text(`IVA (17%):`, 130, finalY + 22);
  doc.text(`${invoice.taxMzn.toLocaleString()} MZN`, 170, finalY + 22);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`TOTAL A PAGAR:`, 130, finalY + 30);
  doc.text(`${invoice.totalAmountMzn.toLocaleString()} MZN`, 170, finalY + 30);

  // Banking Info
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text("Dados Bancários para Pagamento:", 14, finalY + 45);
  doc.text("Banco: Millennium BIM | Conta MZN: 102938475 | NIB: 0001 0000 102938475 22", 14, finalY + 51);
  doc.text("Banco: BCI | Conta MZN: 994827162 | NIB: 0008 0000 994827162 10", 14, finalY + 56);

  doc.save(`Fatura_${invoice.code}.pdf`);
};
