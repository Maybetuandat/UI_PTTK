export interface CurrentBox {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export interface Scale {
  x: number;
  y: number;
}

export interface DisplayDimensions {
  width: number;
  height: number;
}

export interface MessageState {
  open: boolean;
  text: string;
  severity: "success" | "error" | "info" | "warning";
}
