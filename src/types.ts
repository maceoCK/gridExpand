export interface GridSettings {
  squareSize: number; // Size of each grid square in inches
  paperWidth: number; // Paper width in inches
  paperHeight: number; // Paper height in inches
  title: string;
  notes: string;
}

export interface ProjectData {
  settings: GridSettings;
  uploadedImage: string | null;
  croppedImage: string | null;
  completedSquares: Record<string, boolean>;
}

export interface GridSquare {
  row: number;
  col: number;
  x: number;
  y: number;
  width: number;
  height: number;
}