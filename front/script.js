const rainbowColors = [
  "rgba(255, 179, 186, OPACITY)",
  "rgba(255, 223, 186, OPACITY)",
  "rgba(255, 255, 186, OPACITY)",
  "rgba(186, 255, 201, OPACITY)",
  "rgba(186, 225, 255, OPACITY)"
];

function praise() {
  document.getElementById("praiseMessage").innerText = "えらいね";
  document.body.style.background = "linear-gradient(135deg, #f6e6ff, #e0f7fa, #ffe0f0, #e0ffe0)";
  const initial = document.getElementById("initialMessage");
  initial.classList.add("hidden");
  initial.style.display = "none";
  document.getElementById("praiseMessage").classList.add("show");
  document.body.onclick = null;
  startParticles();
  setTimeout(() => document.getElementById("praiseButton").classList.add("show"), 5000);
}

function showPraiseForm() {
  document.getElementById("mainContainer").classList.add("hidden");
  const form = document.getElementById("praiseFormContainer");
  form.classList.remove("hidden");
  form.style.display = "flex";
  setTimeout(() => {
    form.classList.add("show");
    document.getElementById("sendPraiseButton").classList.add("show");
  }, 50);
}

function sendPraise() {
  const praiseText = document.getElementById("praiseInput").value;
  if (praiseText.trim()) alert("あなたの褒め言葉: " + praiseText);
}

function startParticles() {
  const canvas = document.getElementById("particles");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let particlesArray = [];

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + Math.random() * 100;
      this.size = Math.pow(Math.random(), 1.5) * 30 + 0.5;
      const factor = (32 - this.size) / 32;
      this.speedX = (Math.random() - 0.5) * 1.5 * factor;
      this.speedY = -Math.random() * 3.5 * factor - 0.5;
      this.opacity = 0.1 + (this.size / 30) * 0.4;
      const baseColor = rainbowColors[Math.floor(Math.random() * rainbowColors.length)];
      this.color = baseColor.replace("OPACITY", this.opacity.toFixed(2));
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.size > 0.2) this.size -= 0.03;
    }

    draw() {
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 30;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    isDead() {
      return this.size <= 0.2 || this.y < -100;
    }
  }

  function addParticles(n) {
    for (let i = 0; i < n; i++) {
      particlesArray.push(new Particle());
    }
  }

  let frame = 0;
  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray = particlesArray.filter(p => !p.isDead());
    if (frame % 20 === 0) addParticles(1);
    particlesArray.forEach(p => { p.update(); p.draw(); });
    frame++;
    requestAnimationFrame(animateParticles);
  }

  animateParticles();
}

window.onload = startParticles;