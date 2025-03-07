import React, { useState } from 'react';
import { GridSettings } from '../types';

interface SettingsFormProps {
  onSubmit: (settings: GridSettings) => void;
}

const SettingsForm: React.FC<SettingsFormProps> = ({ onSubmit }) => {
  const [squareSize, setSquareSize] = useState<number>(2); // Default 2-inch squares
  const [title, setTitle] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [paperWidth, setPaperWidth] = useState<number>(24); 
  const [paperHeight, setPaperHeight] = useState<number>(18);
  const [useCustomSize, setUseCustomSize] = useState<boolean>(true);

  const handleSquareSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > 0) {
      setSquareSize(value);
    }
  };

  const handlePaperWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > 0) {
      setPaperWidth(value);
    }
  };

  const handlePaperHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > 0) {
      setPaperHeight(value);
    }
  };

  // Calculate grid squares based on paper size and square size
  const calculateGridSquares = () => {
    const gridColumns = Math.floor(paperWidth / squareSize);
    const gridRows = Math.floor(paperHeight / squareSize);
    return { gridColumns, gridRows, totalSquares: gridColumns * gridRows };
  };

  const { gridColumns, gridRows, totalSquares } = calculateGridSquares();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const settings: GridSettings = { 
      squareSize: squareSize || 2, // Renamed from gridSize to squareSize
      paperWidth: paperWidth || 18,
      paperHeight: paperHeight || 24,
      title, 
      notes
    };
    
    onSubmit(settings);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-brown-900 p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-brown-200">Project Settings</h2>
      
      <div className="mb-4">
        <label className="block text-brown-300 mb-2">Project Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 bg-black border border-brown-700 rounded text-brown-100"
          placeholder="My Drawing Project"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-brown-300 mb-2">Square Size (inches)</label>
        <div className="flex items-center">
          <input
            type="range"
            min="0.5"
            max="4"
            step="0.5"
            value={squareSize}
            onChange={handleSquareSizeChange}
            className="w-full mr-4"
          />
          <span className="text-brown-100 text-xl font-bold">{squareSize}×{squareSize}</span>
        </div>
        <p className="text-brown-400 text-sm mt-1">
          Each grid square will be {squareSize}×{squareSize} inches.
        </p>
      </div>
      
      <div className="mb-4">
        <label className="block text-brown-300 mb-2">Paper Dimensions</label>
        <div className="flex gap-4 mt-2">
          <div>
            <label className="block text-brown-400 text-sm mb-1">Width (inches)</label>
            <input
              type="number"
              min="1"
              max="100"
              value={paperWidth.toString()}
              onChange={handlePaperWidthChange}
              className="w-full p-2 bg-black border border-brown-700 rounded text-brown-100"
            />
          </div>
          <div>
            <label className="block text-brown-400 text-sm mb-1">Height (inches)</label>
            <input
              type="number"
              min="1"
              max="100"
              value={paperHeight.toString()}
              onChange={handlePaperHeightChange}
              className="w-full p-2 bg-black border border-brown-700 rounded text-brown-100"
            />
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-brown-300 text-sm mb-1">Grid Preview:</p>
        <p className="text-brown-200 mb-3">
          Your grid will have {gridColumns} columns × {gridRows} rows = {totalSquares} total squares.
        </p>
      </div>
      
      <div className="mb-4">
        <label className="block text-brown-300 mb-2">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full p-2 bg-black border border-brown-700 rounded text-brown-100 h-24"
          placeholder="Add any notes about this project..."
        />
      </div>
      
      <button
        type="submit"
        className="px-6 py-3 bg-brown-800 hover:bg-brown-700 text-brown-100 rounded-lg w-full"
      >
        Continue
      </button>
    </form>
  );
};

export default SettingsForm;