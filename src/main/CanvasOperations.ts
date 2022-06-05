import { Box, Circle, Line, Point, Size, Text } from './shapes';
import { CSSColor } from './colors';

type DrawingState = {
  pointerPosition: { x: number; y: number };
  isPointerDown: boolean;
  // https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
  pressedKeys: Set<string>;
  fontSize: number;
  fillColor: CSSColor;
  strokeColor: CSSColor;
  strokeWidth: number;
};

export class CanvasOperations {
  static DEFAULT_STROKE_WIDTH: number = 3;

  #context: CanvasRenderingContext2D;
  #canvas: HTMLCanvasElement;
  #drawingState: DrawingState = {
    pointerPosition: { x: 0, y: 0 },
    isPointerDown: false,
    pressedKeys: new Set(),
    fontSize: 12,
    fillColor: 'white',
    strokeColor: 'black',
    strokeWidth: CanvasOperations.DEFAULT_STROKE_WIDTH,
  };

  constructor(context: CanvasRenderingContext2D) {
    this.#context = context;
    this.#canvas = context.canvas;

    this.#addEventListeners();
  }

  #addEventListeners(): void {
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
      this.#drawingState.pressedKeys.add(e.key);
    });

    document.addEventListener('keyup', (e) => {
      this.#drawingState.pressedKeys.delete(e.key);
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

  isKeyPressed(...keys: ReadonlyArray<string>): boolean {
    for (const key of keys) {
      if (!this.#drawingState.pressedKeys.has(key)) {
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
    this.#context.lineWidth = this.#drawingState.strokeWidth;
    this.#context.strokeStyle = this.#drawingState.strokeColor;
    this.#context.stroke();
    this.#context.closePath();
  }

  rect(shape: Box): void {
    this.#context.fillStyle = this.#drawingState.fillColor;
    this.#context.lineWidth = this.#drawingState.strokeWidth;
    this.#context.strokeStyle = this.#drawingState.strokeColor;
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

  line({ from, to }: Line): void {
    this.#context.lineWidth = this.#drawingState.strokeWidth;
    this.#context.strokeStyle = this.#drawingState.strokeColor;
    this.#context.beginPath();
    this.#context.moveTo(from.x, from.y);
    this.#context.lineTo(to.x, to.y);
    this.#context.stroke();
    this.#context.closePath();
  }

  fontSize(size: number): void {
    this.#drawingState.fontSize = size;
  }

  fillColor(color: CSSColor): void {
    this.#drawingState.fillColor = color;
  }

  strokeColor(color: CSSColor): void {
    this.#drawingState.strokeColor = color;
  }

  strokeWidth(width: number): void {
    this.#drawingState.strokeWidth = width;
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
