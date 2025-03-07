import React, { useRef } from 'react';
import { Upload } from 'lucide-react';

interface ImageUploaderProps {
  onUpload: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onUpload(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-brown-700 rounded-lg bg-brown-900 bg-opacity-50">
      <h2 className="text-xl font-bold mb-4 text-brown-200">Upload Your Image</h2>
      <p className="text-brown-300 mb-6 text-center">
        Select an image to use for your grid drawing project.
      </p>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      <button
        onClick={handleClick}
        className="px-6 py-3 bg-brown-800 hover:bg-brown-700 text-brown-100 rounded-lg flex items-center gap-2"
      >
        <Upload size={20} /> Select Image
      </button>
    </div>
  );
};

export default ImageUploader;