export interface FractalVar {
  id: string;
  label: string;
  type: "slider" | "toggle";
  def: number;
  range?: number;
  col?: string;
}

export interface FractalDefinition {
  id: string;
  title: string;
  shaderSource: string;
  formula: (vars: Record<string, number>) => string;
  vars: FractalVar[];
}
