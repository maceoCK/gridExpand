# Grid Expand - Grid Drawing Assistant

Grid Expand is a web application designed to help artists create grid-based drawings from reference images. This tool simplifies the process of transferring an image to paper or canvas using the grid method, a classic technique used by artists for centuries.

## Features

- **Dynamic Grid Configuration**: Set custom grid sizes and paper dimensions.
- **Image Upload & Cropping**: Upload reference images and crop them to your preferred composition.
- **Interactive Grid Drawing**: Navigate through grid squares with zoom and rotation capabilities.
- **Progress Tracking**: Mark completed squares as you work through your drawing.
- **Project Management**: Save and load projects for continuous work.
- **Responsive Design**: Works on both desktop and mobile devices.

## Getting Started

### Prerequisites

- Node.js (v14 or later recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/gridExpand.git
   cd gridExpand
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

The build will be available in the `dist` directory.

## How to Use

1. **Configure Project Settings**:
   - Set your grid square size (in inches)
   - Define your paper dimensions
   - Add a project title and optional notes

2. **Upload a Reference Image**:
   - Upload any JPG, PNG, or WebP image
   - Images are automatically compressed for optimal performance

3. **Crop Your Image**:
   - Adjust the crop area to match your desired composition

4. **Draw Using the Grid**:
   - Use the interactive grid display to help with your drawing
   - Click on grid squares to view them in detail
   - Mark squares as completed as you work through your drawing
   - Use zoom and rotation tools to see details more clearly

5. **Save Your Progress**:
   - Save your project to continue working on it later
   - Load saved projects to resume your work

## Technologies Used

- **React**: Frontend UI framework
- **TypeScript**: Type-safe JavaScript
- **Zustand**: State management
- **TailwindCSS**: Styling
- **Vite**: Build tool and development server
- **React Image Crop**: Image cropping functionality

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 