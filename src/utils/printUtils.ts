/**
 * Prints the provided HTML element
 * 
 * @param elementId ID of the element to print
 * @param title Optional title for the print window
 */
export const printElement = (elementId: string, title?: string): void => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with ID ${elementId} not found.`);
    return;
  }
  
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow pop-ups to print the grid.');
    return;
  }
  
  // Get the element's HTML content
  const content = element.innerHTML;
  
  // Create print-friendly document
  printWindow.document.open();
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title || 'Grid Drawing'}</title>
        <style>
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            
            canvas {
              max-width: 100%;
              height: auto;
              display: block;
              margin: 0 auto;
              page-break-inside: avoid;
            }
            
            @page {
              size: auto;
              margin: 0.5cm;
            }
          }
          
          body {
            font-family: Arial, sans-serif;
            background: white;
            color: black;
          }
          
          .print-header {
            text-align: center;
            margin-bottom: 10px;
            font-size: 14px;
          }
          
          .print-footer {
            text-align: center;
            margin-top: 15px;
            font-size: 12px;
            color: #555;
          }
        </style>
      </head>
      <body>
        <div class="print-header">
          <h2>${title || 'Grid Drawing'}</h2>
          <p>Printed from Grid Expand - Grid Drawing Assistant</p>
        </div>
        ${content}
        <div class="print-footer">
          <p>Use this grid as a reference for your drawing. Each square is labeled to help you track your progress.</p>
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 100);
            }, 500);
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};

/**
 * Prints a canvas element directly
 * 
 * @param canvas The canvas element to print
 * @param title Optional title for the print window
 */
export const printCanvas = (canvas: HTMLCanvasElement, title?: string): void => {
  // Convert canvas to data URL
  const dataUrl = canvas.toDataURL('image/png');
  
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow pop-ups to print the grid.');
    return;
  }
  
  // Create print-friendly document with the canvas image
  printWindow.document.open();
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title || 'Grid Drawing'}</title>
        <style>
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            
            img {
              max-width: 100%;
              height: auto;
              display: block;
              margin: 0 auto;
              page-break-inside: avoid;
            }
            
            @page {
              size: auto;
              margin: 0.5cm;
            }
          }
          
          body {
            font-family: Arial, sans-serif;
            background: white;
            color: black;
          }
          
          .print-header {
            text-align: center;
            margin-bottom: 10px;
            font-size: 14px;
          }
          
          .print-footer {
            text-align: center;
            margin-top: 15px;
            font-size: 12px;
            color: #555;
          }
        </style>
      </head>
      <body>
        <div class="print-header">
          <h2>${title || 'Grid Drawing'}</h2>
          <p>Printed from Grid Expand - Grid Drawing Assistant</p>
        </div>
        <img src="${dataUrl}" alt="Grid Drawing" />
        <div class="print-footer">
          <p>Use this grid as a reference for your drawing. Each square is labeled to help you track your progress.</p>
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 100);
            }, 500);
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}; 