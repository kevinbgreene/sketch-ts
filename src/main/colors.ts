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
