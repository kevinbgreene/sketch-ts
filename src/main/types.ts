export type Point = Readonly<{
  x: number;
  y: number;
}>;

export type Line = Readonly<{
  from: Point;
  to: Point;
  weight?: number;
}>;

export type Size = Readonly<{
  width: number;
  height: number;
}>;

// A rectangle where location is top left corner
export type Box = Readonly<{
  location: Point;
  size: Size;
}>;

// A circle where location is the center
export type Circle = Readonly<{
  location: Point;
  radius: number;
}>;

export type HexChar =
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9;

// Color Keywords reference
// https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color_keywords
export type CSSColor =
  | 'black'
  | 'white'
  | 'red'
  | 'yellow'
  | 'blue'
  | `#${HexChar}${HexChar}${HexChar}`
  | `hsl(${number}, ${number}%, ${number}%)`
  | `hsla(${number}, ${number}%, ${number}%, ${number})`
  | `rgb(${number},${number},${number})`
  | `rgba(${number},${number},${number},${number})`;

export interface ICanvasOperations {
  isMouseDown: boolean;
  mousePosition: Point;
  isKeyDown(...keys: ReadonlyArray<string>): boolean;
  circle(shape: Circle): void;
  rect(shape: Box): void;
  clear(): void;
  fill(color: CSSColor): void;
  line(line: Line): void;
  resize(size: Size): void;
}

export type Initializer = () => void;

export type LoopCallback = (ops: ICanvasOperations) => void;
