import { CanvasOperations } from './CanvasOperations';
import { Size } from './shapes';

export type LoopCallback = (ops: CanvasOperations) => void;

export type SketchOptions = Readonly<{
  root: HTMLElement;
  canvas: Size;
}>;

export class Sketch {
  static DEFAULT_SIZE: Size = {
    width: 200,
    height: 200,
  };

  #canvas: HTMLCanvasElement | null = null;
  #context: CanvasRenderingContext2D | null = null;
  #operations: CanvasOperations | null = null;
  #callbacks: Array<LoopCallback> = [];
  #loopID: number | null = null;
  #options: SketchOptions = {
    root: document.body,
    canvas: Sketch.DEFAULT_SIZE,
  };

  init(options: Partial<SketchOptions>): void {
    if (this.#canvas == null) {
      this.#options = {
        ...this.#options,
        ...options,
      };
    } else {
      console.warn(
        `Canvas is already initialized, change state via loop operations`,
      );
    }
  }

  loop(cb: LoopCallback): void {
    this.#startLoop();
    this.#callbacks.push(cb);
  }

  cancelLoop(): void {
    if (this.#loopID != null) {
      cancelAnimationFrame(this.#loopID);
      this.#loopID = null;
    }
  }

  reset(): void {
    this.cancelLoop();
    this.#callbacks = [];
  }

  #getCanvas(): HTMLCanvasElement {
    if (this.#canvas != null) {
      return this.#canvas;
    }

    this.#canvas = document.createElement('canvas');
    this.#canvas.width = this.#options.canvas.width;
    this.#canvas.height = this.#options.canvas.height;
    this.#options.root.append(this.#canvas);
    return this.#canvas;
  }

  #getContext(): CanvasRenderingContext2D {
    if (this.#context) {
      return this.#context;
    }

    this.#context = this.#getCanvas().getContext('2d');

    if (this.#context == null) {
      throw new Error(`Unable to get 2d context from canvas`);
    }

    return this.#context;
  }

  #startLoop(): void {
    if (this.#loopID != null) {
      return;
    }

    this.#loopID = window.requestAnimationFrame(() => {
      for (const cb of this.#callbacks) {
        cb(this.#getCanvasOperations());
      }

      // Process infinite loop
      this.#loopID = null;
      this.#startLoop();
    });
  }

  #getCanvasOperations(): CanvasOperations {
    if (this.#operations != null) {
      return this.#operations;
    }

    this.#operations = new CanvasOperations(this.#getContext());
    return this.#operations;
  }
}
