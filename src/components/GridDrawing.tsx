import React, { useState, useEffect, useRef } from 'react';

interface GridDrawingProps {
  imageUrl: string;
  gridSize: number;
  paperWidth: number;
  paperHeight: number;
  completedSquares: Record<string, boolean>;
  onSquareComplete: (key: string, completed: boolean) => void;
}

interface GridSquare {
  row: number;
  col: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface SelectedSquareInfo {
  key: string;
  row: number;
  col: number;
}

const GridDrawing: React.FC<GridDrawingProps> = ({
  imageUrl,
  gridSize,
  paperWidth,
  paperHeight,
  completedSquares,
  onSquareComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);
  
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [gridSquares, setGridSquares] = useState<GridSquare[]>([]);
  const [selectedSquare, setSelectedSquare] = useState<SelectedSquareInfo | null>(null);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [originalImageDimensions, setOriginalImageDimensions] = useState({ width: 0, height: 0 });
  const [rotation, setRotation] = useState(0); // 0, 90, 180, or 270 degrees
  
  // Calculate grid dimensions
  const gridColumns = Math.floor(paperWidth / gridSize);
  const gridRows = Math.floor(paperHeight / gridSize);
  
  // Calculate scale to fit image in canvas
  const calculateScale = (imgWidth: number, imgHeight: number) => {
    if (!canvasRef.current) return 1;
    
    const canvas = canvasRef.current;
    const containerWidth = canvas.clientWidth;
    
    // Calculate scale to fit width
    return containerWidth / imgWidth;
  };
  
  // Load and draw the image with grid
  useEffect(() => {
    if (!canvasRef.current || !imageUrl) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setImageError("Could not get canvas context");
      return;
    }
    
    setImageError(null);
    console.log("Loading image:", imageUrl);
    console.log("Grid dimensions:", gridColumns, "x", gridRows);
    console.log("Paper size:", paperWidth, "x", paperHeight);
    console.log("Grid size:", gridSize);
    
    const img = new Image();
    
    img.onload = () => {
      try {
        // Store the original image for high-quality zooming
        originalImageRef.current = img;
        setOriginalImageDimensions({ width: img.width, height: img.height });
        
        // Calculate scale to fit image in canvas
        const newScale = calculateScale(img.width, img.height);
        setScale(newScale);
        
        // Set canvas size based on image dimensions and aspect ratio
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Calculate grid square dimensions
        const squareWidth = canvas.width / gridColumns;
        const squareHeight = canvas.height / gridRows;
        
        // Draw grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 2;
        
        // Store grid squares for click detection
        const squares: GridSquare[] = [];
        
        // Draw vertical lines and store grid squares
        for (let col = 0; col <= gridColumns; col++) {
          const x = col * squareWidth;
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
          
          if (col < gridColumns) {
            for (let row = 0; row < gridRows; row++) {
              squares.push({
                row,
                col,
                x: col * squareWidth,
                y: row * squareHeight,
                width: squareWidth,
                height: squareHeight
              });
            }
          }
        }
        
        // Draw horizontal lines
        for (let row = 0; row <= gridRows; row++) {
          const y = row * squareHeight;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
        
        // Mark completed squares
        Object.entries(completedSquares).forEach(([key, completed]) => {
          if (completed) {
            const [row, col] = key.split('-').map(Number);
            
            ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
            ctx.fillRect(
              col * squareWidth,
              row * squareHeight,
              squareWidth,
              squareHeight
            );
          }
        });
        
        setGridSquares(squares);
        setImageLoaded(true);
        console.log("Image loaded successfully, grid squares:", squares.length);
      } catch (err) {
        console.error("Error drawing on canvas:", err);
        setImageError(`Error drawing image: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    };
    
    img.onerror = () => {
      console.error("Failed to load image");
      setImageError("Failed to load the image. The image data may be corrupted or in an unsupported format.");
    };
    
    try {
      img.src = imageUrl;
    } catch (err) {
      console.error("Error setting image source:", err);
      setImageError(`Error loading image: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [imageUrl, gridColumns, gridRows, completedSquares, paperWidth, paperHeight, gridSize]);
  
  // Handle canvas click to select a square
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!canvasRef.current || gridSquares.length === 0) {
      console.log("Canvas click but no grid squares available");
      return;
    }
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / (scale * zoom);
    const y = (e.clientY - rect.top) / (scale * zoom);
    
    console.log("Canvas clicked at:", x, y);
    
    // Find the clicked square
    const clickedSquare = gridSquares.find(
      (square) =>
        x >= square.x &&
        x <= square.x + square.width &&
        y >= square.y &&
        y <= square.y + square.height
    );
    
    if (clickedSquare) {
      console.log("Found clicked square:", clickedSquare);
      setSelectedSquare({ 
        key: `${clickedSquare.row}-${clickedSquare.col}`, 
        row: clickedSquare.row, 
        col: clickedSquare.col 
      });
      setIsFullscreenOpen(true);
    } else {
      console.log("No square found at click position");
    }
  };
  
  // Toggle square completion status
  const toggleSquareComplete = () => {
    if (!selectedSquare) return;
    
    const key = `${selectedSquare.row}-${selectedSquare.col}`;
    const isCompleted = !completedSquares[key];
    onSquareComplete(key, isCompleted);
  };
  
  // Handle zoom in/out
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };
  
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };
  
  // Rotate image clockwise
  const rotateClockwise = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Rotate image counter-clockwise
  const rotateCounterClockwise = () => {
    setRotation((prev) => (prev - 90 + 360) % 360);
  };

  // Reset rotation
  const resetRotation = () => {
    setRotation(0);
  };

  // Close fullscreen view and reset rotation
  const closeFullscreen = () => {
    setIsFullscreenOpen(false);
    setSelectedSquare(null);
    setRotation(0); // Reset rotation when closing
  };
  
  // Render high-quality zoomed square
  const renderHighQualitySquare = () => {
    if (!selectedSquare || !originalImageRef.current) return null;
    
    // Create a new canvas for high-quality rendering
    const highQualityCanvas = document.createElement('canvas');
    const squareWidth = originalImageDimensions.width / gridColumns;
    const squareHeight = originalImageDimensions.height / gridRows;
    
    // Set canvas size to be large for high quality
    const maxSize = 1000; // Maximum size for the zoomed view
    const aspectRatio = squareWidth / squareHeight;
    
    let canvasWidth, canvasHeight;
    if (aspectRatio > 1) {
      canvasWidth = maxSize;
      canvasHeight = maxSize / aspectRatio;
    } else {
      canvasHeight = maxSize;
      canvasWidth = maxSize * aspectRatio;
    }
    
    // For rotated views (90 or 270 degrees), swap width and height
    if (rotation === 90 || rotation === 270) {
      [canvasWidth, canvasHeight] = [canvasHeight, canvasWidth];
    }
    
    highQualityCanvas.width = canvasWidth;
    highQualityCanvas.height = canvasHeight;
    
    const ctx = highQualityCanvas.getContext('2d');
    if (!ctx) return null;
    
    // Apply rotation transformation
    ctx.save();
    ctx.translate(canvasWidth / 2, canvasHeight / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    
    // Calculate the drawing position based on rotation
    let drawX, drawY, drawWidth, drawHeight;
    
    if (rotation === 0) {
      drawX = -canvasWidth / 2;
      drawY = -canvasHeight / 2;
      drawWidth = canvasWidth;
      drawHeight = canvasHeight;
    } else if (rotation === 90) {
      drawX = -canvasHeight / 2;
      drawY = -canvasWidth / 2;
      drawWidth = canvasHeight;
      drawHeight = canvasWidth;
    } else if (rotation === 180) {
      drawX = -canvasWidth / 2;
      drawY = -canvasHeight / 2;
      drawWidth = canvasWidth;
      drawHeight = canvasHeight;
    } else { // 270 degrees
      drawX = -canvasHeight / 2;
      drawY = -canvasWidth / 2;
      drawWidth = canvasHeight;
      drawHeight = canvasWidth;
    }
    
    // Draw the selected portion of the original image at high quality
    ctx.drawImage(
      originalImageRef.current,
      selectedSquare.col * squareWidth,
      selectedSquare.row * squareHeight,
      squareWidth,
      squareHeight,
      drawX,
      drawY,
      drawWidth,
      drawHeight
    );
    
    // Draw grid lines if needed
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    
    // Draw a 4x4 grid inside the zoomed square for reference
    const subGridSize = 4; // Changed from 10 to 4 for fewer, clearer grid lines
    for (let i = 1; i < subGridSize; i++) {
      // Vertical lines
      const x = (i / subGridSize) * drawWidth + drawX;
      ctx.beginPath();
      ctx.moveTo(x, drawY);
      ctx.lineTo(x, drawY + drawHeight);
      ctx.stroke();
      
      // Horizontal lines
      const y = (i / subGridSize) * drawHeight + drawY;
      ctx.beginPath();
      ctx.moveTo(drawX, y);
      ctx.lineTo(drawX + drawWidth, y);
      ctx.stroke();
    }
    
    ctx.restore();
    
    return highQualityCanvas.toDataURL('image/png');
  };
  
  // Count completed squares
  const completedCount = Object.values(completedSquares).filter(Boolean).length;
  const totalSquares = gridColumns * gridRows;
  
  return (
    <div className="bg-brown-900 p-4 rounded-lg">
      <h2 className="text-xl text-brown-200 mb-4">Grid Drawing</h2>
      
      <div className="mb-4">
        <p className="text-brown-300">
          Paper: {paperWidth}″ × {paperHeight}″
        </p>
        <p className="text-brown-300">
          Grid: {gridColumns} columns × {gridRows} rows ({gridSize}″ squares)
        </p>
        <p className="text-brown-300">
          Squares completed: {completedCount} of {totalSquares}
        </p>
      </div>
      
      {imageError && (
        <div className="p-3 bg-red-900 text-red-100 rounded-lg mb-4">
          {imageError}
        </div>
      )}
      
      <div className="relative mb-4 border border-brown-700">
        <canvas 
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="w-full cursor-pointer"
          style={{ 
            transform: `scale(${zoom})`, 
            transformOrigin: 'top left',
            height: canvasRef.current ? canvasRef.current.height * scale * zoom : 'auto'
          }}
        />
      </div>
      
      <div className="flex justify-between mb-4">
        <div>
          <button 
            onClick={handleZoomIn}
            className="px-3 py-1 bg-brown-800 hover:bg-brown-700 text-brown-100 rounded mr-2"
          >
            Zoom In (+)
          </button>
          <button 
            onClick={handleZoomOut}
            className="px-3 py-1 bg-brown-800 hover:bg-brown-700 text-brown-100 rounded"
          >
            Zoom Out (-)
          </button>
        </div>
      </div>
      
      <div className="p-3 bg-brown-800 rounded-lg mb-4">
        <p className="text-brown-200">
          Click on any grid square to enlarge it for drawing.
        </p>
      </div>
      
      {isFullscreenOpen && selectedSquare && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50">
          <div className="bg-brown-900 p-6 rounded-lg max-w-4xl w-full max-h-screen overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl text-brown-200">
                Square {selectedSquare.row + 1},{selectedSquare.col + 1}
              </h3>
              <div className="flex items-center">
                <span className="text-brown-300 mr-2">Rotation: {rotation}°</span>
                <button 
                  onClick={closeFullscreen}
                  className="px-2 py-1 bg-brown-800 hover:bg-brown-700 text-brown-100 rounded"
                >
                  Close
                </button>
              </div>
            </div>
            
            <div className="mb-4 bg-black p-2 rounded">
              {/* High-quality image rendering */}
              <img 
                src={renderHighQualitySquare() || ''}
                alt={`Grid square ${selectedSquare.row + 1},${selectedSquare.col + 1}`}
                className="w-full"
              />
            </div>
            
            <div className="flex justify-between">
              <button 
                onClick={toggleSquareComplete}
                className={`px-4 py-2 ${
                  completedSquares[selectedSquare.key] 
                    ? 'bg-red-800 hover:bg-red-700' 
                    : 'bg-green-800 hover:bg-green-700'
                } text-brown-100 rounded`}
              >
                {completedSquares[selectedSquare.key] ? 'Mark Incomplete' : 'Mark Complete'}
              </button>
              
              <div className="flex space-x-2">
                <button
                  onClick={rotateCounterClockwise}
                  className="px-3 py-1 bg-brown-800 hover:bg-brown-700 text-brown-100 rounded"
                  title="Rotate 90° Counter-Clockwise"
                >
                  ↺ 90°
                </button>
                <button
                  onClick={resetRotation}
                  className="px-3 py-1 bg-brown-800 hover:bg-brown-700 text-brown-100 rounded"
                  title="Reset Rotation"
                >
                  Reset
                </button>
                <button
                  onClick={rotateClockwise}
                  className="px-3 py-1 bg-brown-800 hover:bg-brown-700 text-brown-100 rounded"
                  title="Rotate 90° Clockwise"
                >
                  ↻ 90°
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GridDrawing;