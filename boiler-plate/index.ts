const canvas = document.querySelector("canvas");
const c = canvas!.getContext("2d");
let coords: { x: number; y: number } = {
  x: 0,
  y: 0,
};

const colors = [
  "#0abde3",
  "#feca57",
  "#576574",
  "#341f97",
  "#54a0ff",
  "#ee5253",
];

class Particle {
  public color: string;
  constructor(public x: number, public y: number, public radius: number) {
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }
  public draw() {
    c?.beginPath();
    c?.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c!.fillStyle = this.color;
    c?.fill();
  }
  public update() {
    this.draw();
  }
}
document.addEventListener("DOMContentLoaded", function () {
  if (canvas) {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  }
  animate();
});
window.addEventListener("resize", () => {
  canvas!.width = innerWidth;
  canvas!.height = innerHeight;
  init();
});

window.addEventListener("mousemove", ({ x, y }) => {
  coords = { x, y };
});
const init = () => {};

let particles: Particle[] = [];
init();

function animate() {
  c?.clearRect(0, 0, innerWidth, innerHeight);
  particles.forEach((particle) => {
    particle.update();
  });
  requestAnimationFrame(animate);
}
