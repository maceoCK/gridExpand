import React, { useState } from 'react';
import useStore from '../store/useStore';

const ProjectLoader: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const loadProject = useStore((state) => state.loadProject);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setLoading(true);
    const file = event.target.files?.[0];
    
    if (!file) {
      setLoading(false);
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        console.log('Trying to import project:', data);
        
        // Handle potential format differences between versions
        const projectData = {
          settings: {
            // Handle both squareSize and gridSize terminology
            squareSize: data.settings.squareSize || data.settings.gridSize || 2,
            paperWidth: data.settings.paperWidth || 18,
            paperHeight: data.settings.paperHeight || 24,
            title: data.settings.title || 'Imported Project',
            notes: data.settings.notes || ''
          },
          // Handle different image field names
          uploadedImage: data.uploadedImage || null,
          croppedImage: data.croppedImage || data.imageData || null,
          completedSquares: data.completedSquares || {}
        };
        
        // Validate image data
        if (!projectData.croppedImage) {
          throw new Error('Project file missing image data');
        }

        console.log('Loading project with migrated data:', projectData);
        loadProject(projectData);
        setLoading(false);
      } catch (err) {
        console.error('Error loading project:', err);
        setError(`Failed to load project: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setLoading(false);
      }
    };
    
    reader.onerror = () => {
      setError('Error reading file');
      setLoading(false);
    };
    
    reader.readAsText(file);
  };
  
  return (
    <div className="bg-brown-900 p-4 rounded-lg">
      <h2 className="text-xl text-brown-200 mb-4">Load Existing Project</h2>
      
      <div className="mb-4">
        <label className="block text-brown-300 mb-2">
          Upload your saved project file (.json)
        </label>
        <input
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          className="w-full p-2 bg-black border border-brown-700 rounded text-brown-100"
        />
      </div>
      
      {loading && (
        <div className="p-3 bg-brown-800 text-brown-100 rounded-lg mb-4">
          Loading project...
        </div>
      )}
      
      {error && (
        <div className="p-3 bg-red-900 text-red-100 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      <div className="mt-4 p-3 bg-brown-800 text-brown-100 rounded-lg text-sm">
        <p className="font-bold mb-2">Troubleshooting:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Make sure your project file contains image data</li>
          <li>Try exporting a new project file with the Save Project button</li>
          <li>If loading old projects, some data conversion may be needed</li>
        </ul>
      </div>
    </div>
  );
};

export default ProjectLoader; 