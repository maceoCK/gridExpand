# Grid Expand - Technical Documentation

This document provides technical details about the Grid Expand application architecture, code structure, and implementation details.

## Project Architecture

Grid Expand is built as a single-page React application with TypeScript. It uses a component-based architecture with Zustand for state management.

### Directory Structure

```
src/
├── components/         # React UI components
├── store/              # Zustand state management
├── utils/              # Utility functions
├── types.ts            # TypeScript type definitions
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## State Management

State management is handled using Zustand, a lightweight state management solution. The main state store is defined in `src/store/useStore.ts`.

### Key State Elements:

- **step**: Controls the application workflow (1-4)
- **settings**: Stores grid and paper dimensions
- **uploadedImage**: The original uploaded image
- **croppedImage**: The processed image after cropping
- **completedSquares**: Records which grid squares have been completed

### Persistence:

The application uses a custom persistence layer that tries to use localStorage first, then falls back to sessionStorage if localStorage is full or unavailable.

## Core Components

### SettingsForm (`src/components/SettingsForm.tsx`)

Allows users to configure:
- Grid square size (in inches)
- Paper dimensions (width and height in inches)
- Project title and notes

### ImageUploader (`src/components/ImageUploader.tsx`)

- Uses react-dropzone for drag-and-drop file uploads
- Supports common image formats (JPG, PNG, WebP)
- Implements client-side image compression before storage

### ImageCropper (`src/components/ImageCropper.tsx`)

- Uses react-image-crop for interactive cropping
- Enforces aspect ratio based on paper dimensions
- Processes and optimizes the cropped image

### GridDrawing (`src/components/GridDrawing.tsx`)

The most complex component that:
- Renders the image with an overlaid grid
- Implements interactive features:
  - Clicking on grid squares
  - Zooming in/out
  - Rotation
  - Marking squares as complete
- Uses HTML Canvas for rendering

### PrintButton (`src/components/PrintButton.tsx`)

- Provides UI for printing configuration options
- Manages print state and triggers print generation
- Includes options for customizing the print output:
  - Toggle visibility of completed squares
  - Toggle visibility of grid reference labels
  - Control grid line thickness (0.5-2px)
  - Adjust grid line opacity (10-80%)
- Features simple and advanced option views

### PrintableGrid (`src/components/PrintableGrid.tsx`)

- Creates a high-quality canvas rendering for printing
- Generates customizable grid lines with adjustable opacity and thickness
- Adds optional grid reference labels (A1, B2, etc.)
- Shows optional completed square indicators
- Optimizes output for print media
- Adds project metadata (title, notes) to the printed output

### SquarePopup (`src/components/SquarePopup.tsx`)

- Shows a detailed view of a selected grid square
- Allows marking squares as complete/incomplete

## Utility Functions

### Image Utilities (`src/utils/imageUtils.ts`)

- `compressImage()`: Resizes and compresses images to reduce storage requirements

### File Utilities (`src/utils/fileUtils.ts`)

- `saveProjectToFile()`: Exports project data to JSON file
- `loadProjectFromFile()`: Imports project data from JSON file

### Print Utilities (`src/utils/printUtils.ts`)

- `printElement()`: Prints an HTML element with proper formatting for print media
- `printCanvas()`: Optimizes and prints a canvas element with print-friendly styles

## Data Models

Key TypeScript interfaces are defined in `src/types.ts`:

### GridSettings

```typescript
interface GridSettings {
  squareSize: number;  // Size of each grid square in inches
  paperWidth: number;  // Paper width in inches
  paperHeight: number; // Paper height in inches
  title: string;
  notes: string;
}
```

### ProjectData

```typescript
interface ProjectData {
  settings: GridSettings;
  uploadedImage: string | null;
  croppedImage: string | null;
  completedSquares: Record<string, boolean>;
}
```

### GridSquare

```typescript
interface GridSquare {
  row: number;
  col: number;
  x: number;
  y: number;
  width: number;
  height: number;
}
```

## Application Workflow

1. **Settings Configuration** (step 1)
   - User sets up grid square size and paper dimensions
   - Title and notes are optional

2. **Image Upload** (step 2)
   - Image is uploaded and automatically compressed
   - Client-side processing reduces server requirements

3. **Image Cropping** (step 3)
   - Image is cropped to match paper aspect ratio
   - Cropped image is processed and stored in state

4. **Grid Drawing** (step 4)
   - Interactive grid is displayed over the image
   - User can mark squares as completed
   - Progress is automatically saved to browser storage
   - Grid can be printed with reference markings and gridlines

## Project Export/Import

Projects are serialized to JSON format containing:
- Grid settings (square size, paper dimensions)
- Original and cropped images as data URLs
- Completed squares tracking data

## Performance Considerations

- **Image Compression**: Images are resized and compressed to reduce memory usage
- **Custom Storage**: Falls back to sessionStorage if localStorage is full
- **Canvas Rendering**: Uses HTML Canvas for efficient grid rendering
- **Lazy Loading**: Components are only rendered when needed based on the current step

## Browser Compatibility

The application is designed to work in modern browsers with these requirements:
- ES6+ JavaScript support
- HTML5 Canvas API
- localStorage/sessionStorage support
- Modern CSS features (flexbox, grid)

## Future Development Considerations

Potential areas for future enhancement:

- **Offline Support**: Implement service workers for full offline functionality
- **Multi-layer Support**: Allow for multiple reference images or drawing layers
- **Collaborative Features**: Real-time collaboration between multiple artists
- **Advanced Drawing Tools**: Integrate basic drawing tools for digital sketching
- **Export Options**: Additional export formats beyond JSON (PDF, PNG) 