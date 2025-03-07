export interface GridSettings {
  squareSize: number; // Size of each grid square in inches
  paperWidth: number; // Paper width in inches
  paperHeight: number; // Paper height in inches
  title: string;
  notes: string;
}

export interface ProjectData {
  settings: GridSettings;
  imageData: string; // This is the field name used in the save/load functions
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