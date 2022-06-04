import { Box, Circle, Line, Point, Size, Text } from './shapes';
import { CSSColor } from './colors';

export interface ICanvasOperations {
  canvas: Size;
  isPointerDown: boolean;
  pointerPosition: Point;
  isKeyDown(...keys: ReadonlyArray<string>): boolean;
  circle(shape: Circle): void;
  rect(shape: Box): void;
  clear(): void;
  fill(color: CSSColor): void;
  line(line: Line): void;
  fontSize(size: number): void;
  text(text: Text): void;
  resize(size: Size): void;
}

export class CanvasOperations implements ICanvasOperations {
  #context: CanvasRenderingContext2D;
  #canvas: HTMLCanvasElement;
  #drawingState: {
    pointerPosition: { x: number; y: number };
    isPointerDown: boolean;
    // https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
    downKeys: Set<string>;
    fontSize: number;
  } = {
    pointerPosition: { x: 0, y: 0 },
    isPointerDown: false,
    downKeys: new Set(),
    fontSize: 12,
  };

  constructor(context: CanvasRenderingContext2D) {
    this.#context = context;
    this.#canvas = context.canvas;

    this.#canvas.addEventListener('pointerdown', () => {
      this.#drawingState.isPointerDown = true;
    });

    this.#canvas.addEventListener('pointerup', () => {
      this.#drawingState.isPointerDown = false;
    });

    this.#canvas.addEventListener('pointermove', (e) => {
      this.#drawingState.pointerPosition.x = e.clientX;
      this.#drawingState.pointerPosition.y = e.clientX;
    });

    document.addEventListener('keydown', (e) => {
      this.#drawingState.downKeys.add(e.key);
    });

    document.addEventListener('keyup', (e) => {
      this.#drawingState.downKeys.delete(e.key);
    });
  }

  get canvas(): Size {
    return {
      width: this.#canvas.width,
      height: this.#canvas.height,
    };
  }

  get isPointerDown(): boolean {
    return this.#drawingState.isPointerDown;
  }

  get pointerPosition(): Point {
    return this.#drawingState.pointerPosition;
  }

  isKeyDown(...keys: ReadonlyArray<string>): boolean {
    for (const key of keys) {
      if (!this.#drawingState.downKeys.has(key)) {
        return false;
      }
    }

    return true;
  }

  circle(shape: Circle): void {
    this.#context.beginPath();
    this.#context.ellipse(
      shape.location.x,
      shape.location.y,
      shape.radius,
      shape.radius,
      Math.PI / 4,
      0,
      2 * Math.PI,
    );
    this.#context.stroke();
    this.#context.closePath();
  }

  rect(shape: Box): void {
    this.#context.fillStyle = 'white';
    this.#context.lineWidth = 3;
    this.#context.strokeStyle = 'black';
    this.#context.strokeRect(
      shape.location.x,
      shape.location.y,
      shape.size.width,
      shape.size.height,
    );
  }

  clear(): void {
    this.#context.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
  }

  fill(color: CSSColor): void {
    this.clear();
    this.#context.fillStyle = color;
    this.#context.fillRect(0, 0, this.#canvas.width, this.#canvas.height);
  }

  line({ from, to, weight }: Line): void {
    this.#context.lineWidth = weight ?? 3;
    this.#context.strokeStyle = 'black';
    this.#context.beginPath();
    this.#context.moveTo(from.x, from.y);
    this.#context.lineTo(to.x, to.y);
    this.#context.stroke();
    this.#context.closePath();
  }

  fontSize(size: number): void {
    this.#drawingState.fontSize = size;
  }

  text(text: Text): void {
    this.#context.font = `${this.#drawingState.fontSize}px sans-serif`;
    this.#context.fillText(text.text, text.location.x, text.location.y);
  }

  resize(size: Size): void {
    this.#canvas.width = size.width;
    this.#canvas.height = size.height;
  }
}
