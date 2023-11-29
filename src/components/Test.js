import React, { useState } from 'react';
import Papa from 'papaparse';

function Test() {
  const [textContent, setTextContent] = useState('');

  const handleCsvFile = (event) => {
    const file = event.target.files[0];

    Papa.parse(file, {
      complete: handleParseComplete,
      header: false, 
    });
  };

  const handleParseComplete = (result) => {
    const convertedText = convertToText(result.data);
    setTextContent(convertedText);
  };

  const convertToText = (parsedData) => {
    let textContent = '';

    parsedData.forEach((row) => {
      row.forEach((cell) => {
        textContent += cell + ' ';
      });
      textContent += '\n';
    });

    return textContent;
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleCsvFile} />
      <pre>{textContent}</pre>
    </div>
  );
}

export default Test;
