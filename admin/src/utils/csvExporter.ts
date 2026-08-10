/**
 * Exports data objects to a downloadable UTF-8 CSV file with BOM (compatible with Excel & LibreOffice)
 */
export function exportToCSV(filename: string, headers: string[], data: any[][]) {
  // Format cells: wrap in quotes if contains commas or newlines
  const formatCell = (val: any) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvRows: string[] = [];
  
  // Header row
  csvRows.push(headers.map(formatCell).join(','));

  // Data rows
  data.forEach((row) => {
    csvRows.push(row.map(formatCell).join(','));
  });

  const csvString = csvRows.join('\r\n');
  
  // Add UTF-8 BOM (\uFEFF) so Excel displays accented characters (ç, ã, é) correctly
  const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
