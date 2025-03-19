# Grid Expand - Developer Guide

This guide is intended for developers who want to contribute to or modify the Grid Expand application. It covers development environment setup, coding standards, and contribution guidelines.

## Development Environment Setup

### Prerequisites

- Node.js (v14 or later recommended)
- npm or yarn
- Git
- A code editor (VS Code, WebStorm, etc.)

### Getting Started

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

4. The application will be available at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint to check for code quality issues

## Project Structure

```
gridExpand/
├── src/                # Application source code
│   ├── components/     # React components
│   ├── store/          # Zustand state management
│   ├── utils/          # Utility functions
│   ├── types.ts        # TypeScript type definitions
│   ├── App.tsx         # Main application component
│   ├── main.tsx        # Application entry point
│   └── index.css       # Global styles
├── public/             # Static assets
├── .git/               # Git repository
├── node_modules/       # Dependencies
├── .gitignore          # Git ignore configuration
├── package.json        # Project metadata and dependencies
├── package-lock.json   # Dependency lock file
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite configuration
├── eslint.config.js    # ESLint configuration
└── tailwind.config.js  # Tailwind CSS configuration
```

## Architecture and Data Flow

### Application Flow

1. The application starts with the main App component (`src/App.tsx`)
2. State is managed through Zustand (`src/store/useStore.ts`)
3. The UI is rendered through a series of components based on the current step

### State Management

State is centralized using Zustand. The main store (`src/store/useStore.ts`) includes:

```typescript
interface AppState {
  step: number;
  settings: GridSettings | null;
  uploadedImage: string | null;
  croppedImage: string | null;
  completedSquares: Record<string, boolean>;
  
  // Actions
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
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define interfaces for all component props
- Use proper type annotations for functions and variables
- Avoid using `any` type when possible

### React Components

- Use functional components with hooks
- Follow the single responsibility principle
- Keep components small and focused
- Use appropriate component composition

### CSS/Styling

- Use TailwindCSS for styling
- Follow the utility-first approach
- Use consistent naming for custom classes

### Naming Conventions

- Use PascalCase for component names: `GridDrawing.tsx`
- Use camelCase for variables and functions: `handleImageUpload`
- Use camelCase for file names, except for components: `fileUtils.ts`
- Use descriptive names that indicate purpose

## Adding New Features

### Component Development

1. Create a new component in the `src/components` directory
2. Define the component's props interface with TypeScript
3. Implement the component with proper hooks and state management
4. Add the component to the appropriate parent component

### State Management

1. Update the state interface in `src/store/useStore.ts` if needed
2. Add new state variables and actions
3. Ensure persistence is properly configured for any new state

### Utility Functions

1. Add utility functions to the appropriate file in `src/utils`
2. Write pure functions when possible
3. Document function parameters and return values

## Testing

Currently, the project does not have formal tests. When adding tests:

1. Use Jest for unit testing
2. Use React Testing Library for component testing
3. Focus on testing business logic and user interactions

## Build and Deployment

### Building for Production

```bash
npm run build
# or
yarn build
```

The build will be available in the `dist` directory.

### Deployment

The application is a static site and can be deployed to any static hosting service:

1. Build the application
2. Upload the contents of the `dist` directory to your hosting provider
3. Configure the server to handle single-page application routing if necessary

## Common Issues and Solutions

### Large Images

- The application uses client-side image compression to handle large images
- If users experience performance issues, consider adjusting the compression settings in `imageUtils.ts`

### Browser Storage Limitations

- The application uses a fallback mechanism for browser storage
- Monitor storage usage and consider implementing more efficient storage strategies for large projects

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

Please follow the established coding standards and include proper documentation for new features. 