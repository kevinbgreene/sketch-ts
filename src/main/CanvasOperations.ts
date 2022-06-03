import {
  Box,
  Circle,
  CSSColor,
  ICanvasOperations,
  Line,
  Point,
  Size,
} from './types';

export class CanvasOperations implements ICanvasOperations {
  #context: CanvasRenderingContext2D;
  #canvas: HTMLCanvasElement;
  #drawingState: {
    mousePosition: { x: number; y: number };
    isMouseDown: boolean;
    // https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
    downKeys: Set<string>;
  } = {
    mousePosition: { x: 0, y: 0 },
    isMouseDown: false,
    downKeys: new Set(),
  };

  constructor(context: CanvasRenderingContext2D) {
    this.#context = context;
    this.#canvas = context.canvas;

    this.#canvas.addEventListener('pointerdown', () => {
      this.#drawingState.isMouseDown = true;
    });

    this.#canvas.addEventListener('pointerup', () => {
      this.#drawingState.isMouseDown = false;
    });

    this.#canvas.addEventListener('pointermove', (e) => {
      this.#drawingState.mousePosition.x = e.clientX;
      this.#drawingState.mousePosition.y = e.clientX;
    });

    this.#canvas.addEventListener('keydown', (e) => {
      this.#drawingState.downKeys.add(e.key);
    });

    this.#canvas.addEventListener('keydown', (e) => {
      this.#drawingState.downKeys.delete(e.key);
    });
  }

  get isMouseDown(): boolean {
    return this.#drawingState.isMouseDown;
  }

  get mousePosition(): Point {
    return this.#drawingState.mousePosition;
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
    this.#context.fillStyle = 'white';
    this.#context.lineWidth = weight ?? 3;
    this.#context.strokeStyle = 'black';
    this.#context.beginPath();
    this.#context.moveTo(from.x, from.y);
    this.#context.lineTo(to.x, to.y);
    this.#context.stroke();
    this.#context.closePath();
  }

  resize(size: Size): void {
    this.#canvas.width = size.width;
    this.#canvas.height = size.height;
  }
}
