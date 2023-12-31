const canvas = document.querySelector("canvas");
let c = canvas?.getContext("2d");

const colors = [
  "#1abc9c",
  "#341f97",
  "#7f8c8d",
  "#34495e",
  "#54a0ff",
  "#f1c40f",
  "#0abde3",
  "#ee5253",
  "#e74c3c",
  "#576574",
  "#8e44ad",
  "#feca57",
  "#2c3e50",
  "#f39c12",
  "#d35400",
  "#c0392b",
  "#2980b9",
  "#16a085",
  "#27ae60",
  "#e67e22",
];

function randomIntFromRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function resolveCollision(
  particle: {
    x: number;
    y: number;
    velocity: { x: number; y: number };
    mass: number;
  },
  otherParticle: {
    x: number;
    y: number;
    velocity: { x: number; y: number };
    mass: number;
  }
): void {
  const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
  const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

  const xDist = otherParticle.x - particle.x;
  const yDist = otherParticle.y - particle.y;

  // Prevent accidental overlap of particles
  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
    // Grab angle between the two colliding particles
    const angle = -Math.atan2(
      otherParticle.y - particle.y,
      otherParticle.x - particle.x
    );

    // Store mass in var for better readability in collision equation
    const m1 = particle.mass;
    const m2 = otherParticle.mass;

    // Velocity before equation
    const u1 = rotate(particle.velocity, angle);
    const u2 = rotate(otherParticle.velocity, angle);

    // Velocity after 1d collision equation
    const v1 = {
      x: (u1.x * (m1 - m2)) / (m1 + m2) + (u2.x * 2 * m2) / (m1 + m2),
      y: u1.y,
    };
    const v2 = {
      x: (u2.x * (m1 - m2)) / (m1 + m2) + (u1.x * 2 * m2) / (m1 + m2),
      y: u2.y,
    };

    // Final velocity after rotating axis back to original location
    const vFinal1 = rotate(v1, -angle);
    const vFinal2 = rotate(v2, -angle);

    // Swap particle velocities for realistic bounce effect
    particle.velocity.x = vFinal1.x;
    particle.velocity.y = vFinal1.y;

    otherParticle.velocity.x = vFinal2.x;
    otherParticle.velocity.y = vFinal2.y;
  }
}

function rotate(
  velocity: { x: number; y: number },
  angle: number
): { x: number; y: number } {
  const rotatedVelocities = {
    x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
    y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle),
  };

  return rotatedVelocities;
}

document.addEventListener("DOMContentLoaded", () => {
  canvas!.height = innerHeight;
  canvas!.width = innerWidth;
});

let mouse: {
  x: number;
  y: number;
} = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", ({ x, y }) => {
  mouse = { x, y };
});

class Particle {
  public velocity: {
    x: number;
    y: number;
  };
  public opacity: number;
  public mass: number;
  constructor(
    public x: number,
    public y: number,
    public radius: number,
    public color: string
  ) {
    this.velocity = {
      x: (Math.random() - 0.5) * 5,
      y: (Math.random() - 0.5) * 5,
    };
    this.mass = 1;
    this.opacity = 0;
  }
  public draw() {
    c?.beginPath();
    c?.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    c!.strokeStyle = this.color;
    c?.save();
    c!.globalAlpha = this.opacity;
    c!.fillStyle = this.color;
    c?.fill();
    c?.restore();
    c?.stroke();
    c?.closePath();
  }
  public update(particles: Particle[]) {
    for (let p of particles) {
      if (this === p) {
        continue;
      }
      const d = getDistance(this.x, this.y, p.x, p.y);
      if (d - p.radius * 2 < 0) {
        resolveCollision(this, p);
      }
      const dist = getDistance(mouse.x, mouse.y, this.x, this.y);
      if (dist < 120 && this.opacity < 0.2) {
        this.opacity += 0.02;
      } else if (this.opacity > 0) {
        this.opacity -= 0.02;
        this.opacity = Math.max(0, this.opacity);
      }
    }
    if (this.x - this.radius <= 0 || this.x + this.radius >= innerWidth) {
      this.velocity.x = -this.velocity.x;
    }
    if (this.y - this.radius <= 0 || this.y + this.radius >= innerHeight) {
      this.velocity.y = -this.velocity.y;
    }
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.draw();
  }
}

let particles: Particle[] = [];

function init() {
  for (let i = 0; i < 150; i += 1) {
    const r = 20;
    let x = randomIntFromRange(r, innerWidth - r);
    let y = randomIntFromRange(r, innerHeight - r);
    if (i >= 1) {
      for (let j = 0; j < particles.length; j += 1) {
        const d = getDistance(x, y, particles[j].x, particles[j].y);
        if (d - particles[j].radius * 2 < 0) {
          x = randomIntFromRange(r, innerWidth - r);
          y = randomIntFromRange(r, innerHeight - r);
          j = -1;
        }
      }
    }
    const color = colors[Math.floor(Math.random() * colors.length)];
    particles.push(new Particle(x, y, r, color));
  }
}

function getDistance(x1: number, y1: number, x2: number, y2: number) {
  let xDistance: number = x2 - x1;
  let yDistance: number = y2 - y1;
  return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

init();

animate();

function animate() {
  requestAnimationFrame(animate);
  c?.clearRect(0, 0, canvas!.width, canvas!.height);
  particles.forEach((particle) => {
    particle.update(particles);
  });
}
