import { GUI } from "dat.gui";
const canvas = document.querySelector("canvas");
const gui = new GUI();
const c = canvas!.getContext("2d");
// let coords: { x: number; y: number } = {
//   x: 0,
//   y: 0,
// };

const colors = [
  "#0abde3",
  "#feca57",
  "#576574",
  "#341f97",
  "#54a0ff",
  "#ee5253",
];

// class Particle {
//   public color: string;
//   constructor(public x: number, public y: number, public radius: number) {
//     this.color = colors[Math.floor(Math.random() * colors.length)];
//   }
//   public draw() {
//     c?.beginPath();
//     c?.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
//     c!.fillStyle = this.color;
//     c?.fill();
//   }
//   public update() {
//     this.draw();
//   }
// }
let wave: {
  y: number;
  length: number;
  amplitude: number;
  frequency: number;
};

let strokeColor: {
  h: number;
  s: number;
  l: number;
} = {
  h: 200,
  s: 100,
  l: 100,
};

const backgroundColor: { r: number; g: number; b: number; a: number } = {
  r: 0,
  g: 0,
  b: 0,
  a: 0.01,
};

document.addEventListener("DOMContentLoaded", function () {
  if (canvas) {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  }
  let h = innerHeight ?? 100;
  const w = innerWidth ?? 100;
  c?.moveTo(0, h / 2);
  wave = {
    y: h,
    length: 0.01,
    amplitude: 100,
    frequency: 0.01,
  };
  const waveFolder = gui.addFolder("wave");
  waveFolder.add(wave, "y", 0, innerHeight);
  waveFolder.add(wave, "length", -0.01, 0.01);
  waveFolder.add(wave, "amplitude", -300, 300);
  waveFolder.add(wave, "frequency", 0.01, 1);
  waveFolder.open();

  const strokeColorFolder = gui.addFolder("strokeColor");
  strokeColorFolder.add(strokeColor, "h", 0, 255);
  strokeColorFolder.add(strokeColor, "s", 0, 50);
  strokeColorFolder.add(strokeColor, "l", 0, 50);
  strokeColorFolder.open();
  const backgroundColorFolder = gui.addFolder("bg-color-folder");
  backgroundColorFolder.add(backgroundColor, "r", 0, 255);
  backgroundColorFolder.add(backgroundColor, "g", 0, 255);
  backgroundColorFolder.add(backgroundColor, "b", 0, 255);
  backgroundColorFolder.add(backgroundColor, "a", 0, 1);
  backgroundColorFolder.open();
  animate();
});
// window.addEventListener("resize", () => {
//   canvas!.width = innerWidth;
//   canvas!.height = innerHeight;
//   init();
// });

// window.addEventListener("mousemove", ({ x, y }) => {
//   coords = { x, y };
// });
// const init = () => {};

// let particles: Particle[] = [];
// init();
// @ts-ignore
let increment = typeof wave !== "undefined" ? wave?.frequency : 0;
function animate() {
  c!.fillStyle = `rgba(${backgroundColor.r}, ${backgroundColor.g}, ${backgroundColor.b}, ${backgroundColor.a})`;
  c?.fillRect(0, 0, innerWidth, innerHeight);
  requestAnimationFrame(animate);
  c?.beginPath();
  for (let i = 0; i < innerWidth; i++) {
    c?.lineTo(
      i,
      wave.y / 2 +
        Math.sin(i * wave.length + increment) *
          wave.amplitude *
          Math.sin(increment)
    );
  }
  c!.strokeStyle = `hsl(${Math.abs(strokeColor.h * Math.sin(increment))}, ${
    strokeColor.s
  }%, ${strokeColor.l}%)`;
  increment += wave.frequency;
  c?.stroke();
}
