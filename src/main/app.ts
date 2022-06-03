import { sketch } from '.';

sketch.init({
  canvas: {
    width: 400,
    height: 300,
  },
});

sketch.loop((ops) => {
  ops.fill(`rgba(100, 100, 100, 0.5)`);
});
