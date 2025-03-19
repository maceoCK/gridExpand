import React, { useState, useRef } from 'react';
import { Printer, Settings } from 'lucide-react';
import PrintableGrid from './PrintableGrid';
import { printCanvas } from '../utils/printUtils';
import { GridSettings } from '../types';

interface PrintButtonProps {
  imageUrl: string;
  settings: GridSettings;
  completedSquares: Record<string, boolean>;
}

const PrintButton: React.FC<PrintButtonProps> = ({
  imageUrl,
  settings,
  completedSquares
}) => {
  const [isPrinting, setIsPrinting] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [lineOpacity, setLineOpacity] = useState(0.3); // Default to more transparent
  const [lineThickness, setLineThickness] = useState(0.5); // Default to thinner lines
  const [showPrintOptions, setShowPrintOptions] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const printableRef = useRef<HTMLCanvasElement>(null);
  
  const handlePrint = () => {
    setIsPrinting(true); // Set printing state to trigger render
    
    // Use setTimeout to ensure the canvas is fully rendered
    setTimeout(() => {
      const canvas = document.querySelector('.printable-canvas') as HTMLCanvasElement;
      if (canvas) {
        // Get a clean title for the print
        const title = settings.title 
          ? `${settings.title} - Grid Drawing` 
          : 'Grid Drawing';
        
        printCanvas(canvas, title);
      } else {
        alert('Could not generate printable grid. Please try again.');
      }
      
      setIsPrinting(false);
    }, 500);
  };
  
  return (
    <>
      <div className="relative">
        <button
          onClick={() => setShowPrintOptions(!showPrintOptions)}
          className="px-4 py-2 bg-brown-800 hover:bg-brown-700 text-brown-100 rounded-lg flex items-center gap-2"
        >
          <Printer size={16} /> Print Grid
        </button>
        
        {showPrintOptions && (
          <div className="absolute right-0 top-full mt-2 bg-brown-900 rounded-lg p-4 shadow-lg z-10 w-72">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-brown-100 font-semibold">Print Options</h3>
              <button 
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                className="text-xs text-brown-300 hover:text-brown-100 flex items-center gap-1"
              >
                <Settings size={14} /> {showAdvancedOptions ? 'Simple Options' : 'Advanced Options'}
              </button>
            </div>
            
            <div className="mb-3">
              <label className="flex items-center text-brown-100 mb-2">
                <input
                  type="checkbox"
                  checked={showCompleted}
                  onChange={() => setShowCompleted(!showCompleted)}
                  className="mr-2"
                />
                Show completed squares
              </label>
              
              <label className="flex items-center text-brown-100 mb-2">
                <input
                  type="checkbox"
                  checked={showLabels}
                  onChange={() => setShowLabels(!showLabels)}
                  className="mr-2"
                />
                Show grid labels (A1, B2, etc.)
              </label>
            </div>
            
            {showAdvancedOptions && (
              <div className="mb-4 bg-brown-800 p-3 rounded-md">
                <div className="mb-3">
                  <label className="block text-brown-300 text-sm mb-1">
                    Grid Line Thickness: {lineThickness}px
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={lineThickness}
                    onChange={(e) => setLineThickness(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-brown-400 mt-1">
                    <span>Thin</span>
                    <span>Thick</span>
                  </div>
                </div>
                
                <div className="mb-1">
                  <label className="block text-brown-300 text-sm mb-1">
                    Grid Line Opacity: {Math.round(lineOpacity * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="0.8"
                    step="0.05"
                    value={lineOpacity}
                    onChange={(e) => setLineOpacity(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-brown-400 mt-1">
                    <span>Faint</span>
                    <span>Visible</span>
                  </div>
                </div>
              </div>
            )}
            
            <button
              onClick={handlePrint}
              className="w-full px-4 py-2 bg-brown-700 hover:bg-brown-600 text-brown-100 rounded-lg flex items-center justify-center gap-2"
            >
              <Printer size={16} /> Print Now
            </button>
          </div>
        )}
      </div>
      
      {/* Hidden printable grid component that will be rendered when printing */}
      {isPrinting && (
        <PrintableGrid
          imageUrl={imageUrl}
          settings={settings}
          completedSquares={completedSquares}
          showCompleted={showCompleted}
          showLabels={showLabels}
          lineOpacity={lineOpacity}
          lineThickness={lineThickness}
        />
      )}
    </>
  );
};

export default PrintButton; 