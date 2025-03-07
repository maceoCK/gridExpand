import { create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import { GridSettings, ProjectData } from '../types';

interface AppState {
  step: number;
  settings: GridSettings | null;
  uploadedImage: string | null;
  croppedImage: string | null;
  completedSquares: Record<string, boolean>;
  
  setStep: (step: number) => void;
  setSettings: (settings: GridSettings | null) => void;
  setUploadedImage: (image: string | null) => void;
  setCroppedImage: (image: string | null) => void;
  setCompletedSquares: (squares: Record<string, boolean>) => void;
  updateSquareCompletion: (key: string, completed: boolean) => void;
  loadProject: (data: ProjectData) => void;
  resetProject: () => void;
  exportProject: () => ProjectData;
}

interface ProjectData {
  settings: GridSettings;
  uploadedImage: string | null;
  croppedImage: string | null;
  completedSquares: Record<string, boolean>;
}

// Custom storage that handles large data or falls back to sessionStorage
const createCustomStorage = () => {
  // Create a combined storage that tries localStorage first, then falls back to sessionStorage
  return {
    getItem: (name: string) => {
      try {
        const value = localStorage.getItem(name);
        return value;
      } catch (err) {
        console.warn('localStorage access failed, falling back to sessionStorage', err);
        return sessionStorage.getItem(name);
      }
    },
    setItem: (name: string, value: string) => {
      try {
        localStorage.setItem(name, value);
      } catch (err) {
        console.warn('localStorage set failed, falling back to sessionStorage', err);
        try {
          // If localStorage fails, try sessionStorage
          sessionStorage.setItem(name, value);
        } catch (innerErr) {
          console.error('All storage methods failed', innerErr);
          // At this point we can't store the data in the browser
          throw new Error('Storage quota exceeded. Try using a smaller image.');
        }
      }
    },
    removeItem: (name: string) => {
      try {
        localStorage.removeItem(name);
      } catch (err) {
        sessionStorage.removeItem(name);
      }
    }
  };
};

// Persist options with custom storage
const persistOptions: PersistOptions<AppState> = {
  name: 'grid-drawing-storage',
  storage: createCustomStorage()
};

// Create the store with persistence
const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      step: 1,
      settings: null,
      uploadedImage: null,
      croppedImage: null,
      completedSquares: {},
      
      setStep: (step) => set({ step }),
      setSettings: (settings) => set({ settings }),
      setUploadedImage: (uploadedImage) => set({ uploadedImage }),
      setCroppedImage: (croppedImage) => set({ croppedImage }),
      setCompletedSquares: (completedSquares) => set({ completedSquares }),
      updateSquareCompletion: (key, completed) => 
        set((state) => ({
          completedSquares: { ...state.completedSquares, [key]: completed }
        })),
      loadProject: (data: ProjectData) => {
        try {
          console.log('Setting project data in store');
          
          // Validate the image data before setting
          if (!data.croppedImage) {
            throw new Error('Project is missing required image data');
          }
          
          // Pre-load the image to verify it's valid
          const img = new Image();
          img.onload = () => {
            // Image loaded successfully, now set the state
            set({
              settings: data.settings,
              uploadedImage: data.uploadedImage,
              croppedImage: data.croppedImage,
              completedSquares: data.completedSquares || {},
              step: 4 // Jump directly to drawing step
            });
          };
          
          img.onerror = () => {
            throw new Error('Failed to load image data from project file');
          };
          
          // Start loading the image
          img.src = data.croppedImage;
        } catch (err) {
          console.error('Error in loadProject:', err);
          alert(`Failed to load project: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
      },
      resetProject: () => set({
        step: 1,
        settings: null,
        uploadedImage: null,
        croppedImage: null,
        completedSquares: {}
      }),
      exportProject: () => {
        const state = get();
        return {
          settings: state.settings || {
            squareSize: 2,
            paperWidth: 18,
            paperHeight: 24,
            title: 'Untitled Project',
            notes: ''
          },
          uploadedImage: state.uploadedImage,
          croppedImage: state.croppedImage,
          completedSquares: state.completedSquares
        };
      }
    }),
    persistOptions
  )
);

export default useStore; 