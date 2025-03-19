import React, { useRef, useEffect } from 'react';
import { GridSettings } from '../types';

interface PrintableGridProps {
  imageUrl: string;
  settings: GridSettings;
  completedSquares: Record<string, boolean>;
  showCompleted: boolean;
  showLabels: boolean;
  lineOpacity: number; // 0.1 to 0.8
  lineThickness: number; // 0.5 to 2
}

const PrintableGrid: React.FC<PrintableGridProps> = ({
  imageUrl,
  settings,
  completedSquares,
  showCompleted,
  showLabels = true,
  lineOpacity = 0.5,
  lineThickness = 1
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Calculate grid dimensions
  const gridColumns = Math.floor(settings.paperWidth / settings.squareSize);
  const gridRows = Math.floor(settings.paperHeight / settings.squareSize);
  
  // Draw the grid on the canvas when the component mounts or props change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const img = new Image();
    img.onload = () => {
      // Set canvas dimensions based on image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw the image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Calculate grid cell dimensions
      const cellWidth = canvas.width / gridColumns;
      const cellHeight = canvas.height / gridRows;
      
      // Draw grid lines with adjusted opacity and thickness
      ctx.strokeStyle = `rgba(0, 0, 0, ${lineOpacity})`;
      ctx.lineWidth = lineThickness;
      
      // Draw vertical grid lines
      for (let col = 0; col <= gridColumns; col++) {
        const x = col * cellWidth;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      // Draw horizontal grid lines
      for (let row = 0; row <= gridRows; row++) {
        const y = row * cellHeight;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Optionally mark completed squares
      if (showCompleted) {
        ctx.fillStyle = 'rgba(0, 255, 0, 0.15)'; // More transparent highlight
        
        Object.entries(completedSquares).forEach(([key, completed]) => {
          if (completed) {
            const [row, col] = key.split('-').map(Number);
            ctx.fillRect(
              col * cellWidth,
              row * cellHeight,
              cellWidth,
              cellHeight
            );
          }
        });
      }
      
      // Optionally add grid references (A1, A2, B1, etc.) at each cell
      if (showLabels) {
        ctx.fillStyle = `rgba(0, 0, 0, ${lineOpacity})`;
        // Smaller font size relative to cell size
        const fontSize = Math.max(8, Math.floor(cellWidth / 8));
        ctx.font = `${fontSize}px Arial`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        
        for (let row = 0; row < gridRows; row++) {
          for (let col = 0; col < gridColumns; col++) {
            const cellRef = `${String.fromCharCode(65 + col)}${row + 1}`;
            ctx.fillText(
              cellRef,
              col * cellWidth + 2,
              row * cellHeight + 2,
              cellWidth - 4
            );
          }
        }
      }
      
      // Add title and notes if available
      if (settings.title || settings.notes) {
        const footerHeight = 40;
        const totalHeight = canvas.height + footerHeight;
        
        // Resize canvas to accommodate footer
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = totalHeight;
        
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
          // Copy original canvas content
          tempCtx.drawImage(canvas, 0, 0);
          
          // Add footer with title and notes
          tempCtx.fillStyle = 'white';
          tempCtx.fillRect(0, canvas.height, canvas.width, footerHeight);
          
          tempCtx.fillStyle = 'black';
          tempCtx.font = '14px Arial';
          tempCtx.textAlign = 'left';
          tempCtx.textBaseline = 'top';
          
          let footerText = '';
          if (settings.title) {
            footerText += `Title: ${settings.title}`;
          }
          if (settings.notes) {
            footerText += footerText ? ` | Notes: ${settings.notes}` : `Notes: ${settings.notes}`;
          }
          
          tempCtx.fillText(
            footerText,
            10,
            canvas.height + 10,
            canvas.width - 20
          );
          
          // Copy back to original canvas (resized)
          canvas.height = totalHeight;
          ctx.drawImage(tempCanvas, 0, 0);
        }
      }
    };
    
    img.src = imageUrl;
  }, [imageUrl, settings, completedSquares, showCompleted, showLabels, lineOpacity, lineThickness, gridColumns, gridRows]);
  
  return (
    <div className="print-container" style={{ display: 'none' }}>
      <canvas ref={canvasRef} className="printable-canvas"></canvas>
    </div>
  );
};

export default PrintableGrid; 