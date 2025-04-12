const rainbowColors = [
  "rgba(255, 179, 186, OPACITY)",
  "rgba(255, 223, 186, OPACITY)",
  "rgba(255, 255, 186, OPACITY)",
  "rgba(186, 255, 201, OPACITY)",
  "rgba(186, 225, 255, OPACITY)",
];

const PARTICLE_LIMITS = {
  MIN_SIZE: 0.2,
  ADD_INTERVAL: 10,
};
const SHADOW_BLUR = 30;

class Particle {
  constructor(canvasWidth, canvasHeight) {
    this.x = Math.random() * canvasWidth;
    this.y = canvasHeight + Math.random() * 100;
    this.size = Math.pow(Math.random(), 1.5) * 30 + 0.5;
    const factor = (32 - this.size) / 32;
    this.speedX = (Math.random() - 0.5) * 1.5 * factor;
    this.speedY = -Math.random() * 3.5 * factor - 0.5;
    this.opacity = 0.1 + (this.size / 30) * 0.4;
    this.color = this._getColorWithOpacity();
  }

  _getColorWithOpacity = () => {
    const baseColor =
      rainbowColors[Math.floor(Math.random() * rainbowColors.length)];
    return baseColor.replace("OPACITY", this.opacity.toFixed(2));
  };

  update = () => {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.size > PARTICLE_LIMITS.MIN_SIZE) this.size -= 0.03;
  };

  draw = (ctx) => {
    ctx.shadowColor = this.color;
    ctx.shadowBlur = SHADOW_BLUR;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  };

  isDead = () => {
    return this.size <= PARTICLE_LIMITS.MIN_SIZE || this.y < -100;
  };
}

const startParticles = () => {
  const canvas = document.getElementById("particles");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  let frame = 0;

  const addParticles = (count) => {
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(canvas.width, canvas.height));
    }
  };

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      p.update();
      p.draw(ctx);
    });

    const alive = particles.filter((p) => !p.isDead());
    particles.length = 0;
    particles.push(...alive);

    if (frame % PARTICLE_LIMITS.ADD_INTERVAL === 0) {
      addParticles(1);
    }

    frame++;
    requestAnimationFrame(animate);
  };

  animate();
};

export { startParticles };