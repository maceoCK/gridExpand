import React, { useState } from 'react';
import { RotateCw, RotateCcw, X, Check } from 'lucide-react';

interface SquarePopupProps {
  squareKey: string;
  imageUrl: string;
  onClose: () => void;
  gridSize: number;
  row: number;
  col: number;
}

const SquarePopup: React.FC<SquarePopupProps> = ({ 
  squareKey, 
  imageUrl, 
  onClose, 
  gridSize, 
  row, 
  col 
}) => {
  const [rotation, setRotation] = useState(0);
  const [markCompleted, setMarkCompleted] = useState(false);

  const rotateClockwise = () => {
    setRotation((prev) => prev + 90);
  };

  const rotateCounterClockwise = () => {
    setRotation((prev) => prev - 90);
  };

  // Calculate the clip-path for the specific grid square
  const clipPercentage = 100 / gridSize;
  const clipTop = row * clipPercentage;
  const clipLeft = col * clipPercentage;
  
  const clipStyle = {
    clipPath: `inset(${clipTop}% ${100 - clipLeft - clipPercentage}% ${100 - clipTop - clipPercentage}% ${clipLeft}%)`,
    transform: `scale(${gridSize}) rotate(${rotation}deg)`,
    transformOrigin: 'center center',
    width: '100%',
    height: '100%',
    transition: 'transform 0.3s ease'
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
      <div className="w-full h-full flex flex-col">
        <div className="p-4 flex justify-between items-center">
          <div className="text-brown-300 text-xl">Square {row+1}×{col+1}</div>
          <div className="flex gap-4">
            <button 
              onClick={rotateCounterClockwise} 
              className="p-2 bg-brown-900 text-brown-200 rounded-full hover:bg-brown-800"
              aria-label="Rotate counter-clockwise"
            >
              <RotateCcw size={24} />
            </button>
            <button 
              onClick={rotateClockwise} 
              className="p-2 bg-brown-900 text-brown-200 rounded-full hover:bg-brown-800"
              aria-label="Rotate clockwise"
            >
              <RotateCw size={24} />
            </button>
            <button 
              onClick={onClose} 
              className="p-2 bg-brown-900 text-brown-200 rounded-full hover:bg-brown-800"
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <div className="relative w-[90vh] h-[90vh] max-w-full max-h-full">
            <img 
              src={imageUrl} 
              alt={`Square ${squareKey}`} 
              style={clipStyle} 
              className="absolute top-0 left-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SquarePopup; 