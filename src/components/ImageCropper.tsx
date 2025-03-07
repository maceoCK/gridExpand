import React, { useState, useCallback, useEffect } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Check } from 'lucide-react';
import { GridSettings } from '../types';

interface ImageCropperProps {
  imageUrl: string;
  settings: GridSettings;
  onComplete: (croppedImageData: string) => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ imageUrl, settings, onComplete }) => {
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 80,
    height: 80,
    x: 10,
    y: 10,
  });
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Calculate aspect ratio based on paper dimensions if they exist
  const aspectRatio = settings.paperWidth && settings.paperHeight 
    ? settings.paperWidth / settings.paperHeight 
    : 1; // Default to square if dimensions aren't provided

  // Update crop when aspect ratio changes
  useEffect(() => {
    if (imageRef) {
      // Recalculate initial crop with the correct aspect ratio
      initializeCrop(imageRef);
    }
  }, [aspectRatio, imageRef]);

  const initializeCrop = useCallback((img: HTMLImageElement) => {
    const imgWidth = img.width;
    const imgHeight = img.height;
    const imgAspect = imgWidth / imgHeight;
    
    let cropWidth, cropHeight, x, y;
    
    if (imgAspect > aspectRatio) {
      // Image is wider than crop aspect ratio
      cropHeight = imgHeight;
      cropWidth = cropHeight * aspectRatio;
      x = (imgWidth - cropWidth) / 2;
      y = 0;
    } else {
      // Image is taller than crop aspect ratio
      cropWidth = imgWidth;
      cropHeight = cropWidth / aspectRatio;
      x = 0;
      y = (imgHeight - cropHeight) / 2;
    }
    
    setCrop({
      unit: 'px',
      width: cropWidth,
      height: cropHeight,
      x,
      y,
    });
  }, [aspectRatio]);

  const onImageLoad = useCallback((img: HTMLImageElement) => {
    setImageRef(img);
    initializeCrop(img);
  }, [initializeCrop]);

  const getCroppedImg = () => {
    try {
      if (!imageRef) {
        setError("Image not loaded yet. Please wait.");
        return;
      }

      const canvas = document.createElement('canvas');
      const scaleX = imageRef.naturalWidth / imageRef.width;
      const scaleY = imageRef.naturalHeight / imageRef.height;
      
      // Ensure we have numeric values for the crop
      const cropX = (crop.x || 0) * scaleX;
      const cropY = (crop.y || 0) * scaleY;
      const cropWidth = (crop.width || 0) * scaleX;
      const cropHeight = (crop.height || 0) * scaleY;

      // Set canvas dimensions to match the cropped image
      canvas.width = cropWidth;
      canvas.height = cropHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setError("Could not get canvas context. Your browser might not support this feature.");
        return;
      }
      
      ctx.drawImage(
        imageRef,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );

      // Get the data URL from the canvas
      const croppedImageData = canvas.toDataURL('image/jpeg');
      onComplete(croppedImageData);
    } catch (err) {
      console.error('Error cropping image:', err);
      setError("An error occurred while processing the image. Please try again with a different image.");
    }
  };

  // Display the paper dimensions in the UI
  const paperInfo = settings.paperWidth && settings.paperHeight 
    ? `${settings.paperWidth}" × ${settings.paperHeight}"`
    : 'Custom size';

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold mb-4 text-brown-200">Crop Your Image</h2>
      <p className="text-brown-300 mb-2 text-center">
        Drag and resize the crop area to fit your desired region. This will become your grid.
      </p>
      <p className="text-brown-400 mb-6 text-center">
        Paper size: {paperInfo}
      </p>

      {error && (
        <div className="bg-red-900 text-red-100 p-4 mb-4 rounded-md w-full">
          Error: {error}
        </div>
      )}
      
      <div className="max-w-full overflow-auto mb-6 bg-brown-900 p-4 rounded-lg">
        {imageUrl ? (
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            aspect={aspectRatio} // Use calculated aspect ratio
            circularCrop={false}
          >
            <img 
              src={imageUrl} 
              alt="Crop preview" 
              onLoad={(e) => onImageLoad(e.currentTarget)}
              style={{ maxHeight: '70vh' }}
            />
          </ReactCrop>
        ) : (
          <div className="text-center p-8 text-brown-500">Image loading failed. Please try again.</div>
        )}
      </div>
      
      <button
        onClick={getCroppedImg}
        className="px-6 py-3 bg-brown-800 hover:bg-brown-700 text-brown-100 rounded-lg flex items-center gap-2"
        disabled={!imageRef}
      >
        <Check size={20} /> Confirm Crop
      </button>
    </div>
  );
};

export default ImageCropper;