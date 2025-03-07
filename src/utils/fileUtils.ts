import { ProjectData } from '../types';

// Save project data to a file
export const saveProjectToFile = (projectData: ProjectData): void => {
  const dataStr = JSON.stringify(projectData);
  const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
  
  const exportName = `grid-drawing-project-${new Date().toISOString().slice(0, 10)}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportName);
  linkElement.click();
};

// Load project data from a file
export const loadProjectFromFile = (file: File): Promise<ProjectData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const projectData = JSON.parse(event.target?.result as string) as ProjectData;
        resolve(projectData);
      } catch (error) {
        reject(new Error('Invalid project file format'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsText(file);
  });
};