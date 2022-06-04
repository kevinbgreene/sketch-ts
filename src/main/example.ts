import { sketch } from '.';

sketch.init({
  canvas: {
    width: 400,
    height: 300,
  },
});

let posX = 200;
let posY = 150;

sketch.loop((ops) => {
  ops.clear();
  ops.fill(`rgba(100, 100, 100, 0.5)`);

  ops.circle({
    location: {
      x: posX,
      y: posY,
    },
    radius: 20,
  });

  if (ops.isKeyDown('ArrowUp')) {
    posY -= 2;
  }

  if (ops.isKeyDown('ArrowDown')) {
    posY += 2;
  }
});
