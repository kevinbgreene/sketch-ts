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
