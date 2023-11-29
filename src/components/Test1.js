import React, { useState } from 'react';
import * as XLSX from 'xlsx';

function ExcelToTextConverter() {
  const [textData, setTextData] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const text = sheetData.map(row => row.join('\t')).join('\n');
      setTextData(text);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <pre>{textData}</pre>
    </div>
  );
}

export default ExcelToTextConverter;
