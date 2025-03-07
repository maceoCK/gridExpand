import React, { useState, useRef } from 'react';
import { Grid, Upload, Save, FileUp } from 'lucide-react';
import SettingsForm from './components/SettingsForm';
import ImageUploader from './components/ImageUploader';
import ImageCropper from './components/ImageCropper';
import GridDrawing from './components/GridDrawing';
import { GridSettings, ProjectData } from './types';
import { saveProjectToFile, loadProjectFromFile } from './utils/fileUtils';
import useStore from './store/useStore';
import { compressImage } from './utils/imageUtils';
import ProjectLoader from './components/ProjectLoader';

const App: React.FC = () => {
  const {
    step,
    settings,
    uploadedImage,
    croppedImage,
    completedSquares,
    setStep,
    setSettings,
    setUploadedImage,
    setCroppedImage,
    updateSquareCompletion,
    loadProject,
    resetProject
  } = useStore();
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle settings submission
  const handleSettingsSubmit = (newSettings: GridSettings) => {
    setSettings(newSettings);
    setStep(2);
  };

  // Handle image upload with compression
  const handleImageUpload = (file: File) => {
    try {
      // Check file size - limit to 10MB
      if (file.size > 10 * 1024 * 1024) {
        alert("Image is too large. Please select an image under 10MB.");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const result = e.target?.result as string;
          if (result) {
            // Compress the image before storing
            const compressed = await compressImage(result, 1500, 0.8);
            setUploadedImage(compressed);
            setStep(3);
          } else {
            alert("Failed to read the image. Please try another one.");
          }
        } catch (err) {
          console.error("Error in reader.onload:", err);
          alert("Error processing the image. Please try another one.");
        }
      };
      
      reader.onerror = () => {
        alert("Error reading the file. Please try another image.");
      };
      
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Error in handleImageUpload:", err);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  // Handle crop complete with compression
  const handleCropComplete = async (croppedImageData: string) => {
    try {
      // Compress the cropped image to save storage space
      const compressed = await compressImage(croppedImageData, 1200, 0.75);
      setCroppedImage(compressed);
      setStep(4);
    } catch (err) {
      console.error("Error in handleCropComplete:", err);
      alert("Failed to process the cropped image. Please try again.");
    }
  };

  // Handle square completion
  const handleSquareComplete = (key: string, completed: boolean) => {
    updateSquareCompletion(key, completed);
  };

  // Handle save project
  const handleSaveProject = () => {
    if (!settings || !uploadedImage || !croppedImage) return;
    
    const projectData: ProjectData = {
      settings,
      uploadedImage,
      croppedImage,
      completedSquares
    };
    
    saveProjectToFile(projectData);
  };

  // Handle load project
  const handleLoadProject = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    loadProjectFromFile(file)
      .then(projectData => {
        loadProject(projectData);
      })
      .catch(error => {
        console.error('Error loading project:', error);
        alert('Failed to load project file.');
      });
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-black text-brown-100">
      <header className="w-full bg-brown-900 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-brown-100 flex items-center gap-2">
            <Grid className="text-brown-300" /> Grid Drawing Assistant
          </h1>
          <div className="flex gap-2">
            {step > 1 && (
              <button
                onClick={() => resetProject()}
                className="px-4 py-2 bg-brown-800 hover:bg-brown-700 text-brown-100 rounded-lg"
              >
                New Project
              </button>
            )}
            {/* Always show load project button */}
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleLoadProject}
                accept=".json"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-brown-800 hover:bg-brown-700 text-brown-100 rounded-lg flex items-center gap-2"
              >
                <FileUp size={16} /> Load Project
              </button>
            </div>
            {step === 4 && (
              <button
                onClick={handleSaveProject}
                className="px-4 py-2 bg-brown-800 hover:bg-brown-700 text-brown-100 rounded-lg flex items-center gap-2"
              >
                <Save size={16} /> Save Project
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Progress bar - full width */}
      <div className="w-full bg-brown-900 h-2">
        <div
          className="bg-brown-500 h-full transition-all duration-300"
          style={{ width: `${(step / 4) * 100}%` }}
        ></div>
      </div>

      <main className="container mx-auto p-4 max-w-4xl">
        {/* Debug information */}
        <div className="mb-4 p-2 bg-brown-900 text-xs">
          Debug: step={step}, settings={settings ? 'yes' : 'no'}, 
          image={croppedImage ? 'yes' : 'no'}, 
          squareSize={settings?.squareSize}
        </div>
        
        {step === 1 && (
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <SettingsForm onSubmit={handleSettingsSubmit} />
            </div>
            <div className="flex-1">
              <ProjectLoader />
            </div>
          </div>
        )}
        
        {step === 2 && (
          <ImageUploader onUpload={handleImageUpload} />
        )}
        
        {step === 3 && uploadedImage && settings && (
          <ImageCropper 
            imageUrl={uploadedImage} 
            settings={settings}
            onComplete={handleCropComplete} 
          />
        )}
        
        {step === 4 && settings && croppedImage && (
          <GridDrawing
            imageUrl={croppedImage}
            gridSize={settings.squareSize}
            paperWidth={settings.paperWidth}
            paperHeight={settings.paperHeight}
            completedSquares={completedSquares}
            onSquareComplete={handleSquareComplete}
          />
        )}
      </main>
    </div>
  );
}

export default App;