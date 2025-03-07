import React from 'react';
import useStore from '../store/useStore';

const SaveProjectButton: React.FC = () => {
  const { settings, exportProject } = useStore();
  
  const handleSave = () => {
    try {
      const projectData = exportProject();
      
      if (!projectData.croppedImage) {
        alert('Nothing to save yet. Please complete the setup first.');
        return;
      }
      
      // Convert to JSON
      const jsonData = JSON.stringify(projectData, null, 2);
      
      // Create a blob and download link
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const a = document.createElement('a');
      a.href = url;
      a.download = `${settings?.title || 'grid-drawing'}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error saving project:', err);
      alert(`Failed to save project: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };
  
  return (
    <button
      onClick={handleSave}
      className="px-4 py-2 bg-brown-800 hover:bg-brown-700 text-brown-100 rounded"
    >
      Save Project
    </button>
  );
};

export default SaveProjectButton; 