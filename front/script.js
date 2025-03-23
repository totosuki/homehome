const rainbowColors = [
  "rgba(255, 179, 186, OPACITY)",
  "rgba(255, 223, 186, OPACITY)",
  "rgba(255, 255, 186, OPACITY)",
  "rgba(186, 255, 201, OPACITY)",
  "rgba(186, 225, 255, OPACITY)"
];

function praise() {
  const message = document.getElementById("praiseMessage");
  const initial = document.getElementById("initialMessage");
  const button = document.getElementById("praiseButton");

  message.innerText = "えらいね";

  // 背景変更（フェードは前の回答で）
  document.getElementById("bg2").style.background = "linear-gradient(135deg, #f6e6ff, #e0f7fa, #ffe0f0, #e0ffe0)";
  document.getElementById("bg2").style.opacity = 1;

  // 初期メッセージ消去
  initial.classList.add("fade-out");
  setTimeout(() => {
    initial.style.display = "none";
    message.classList.add("pop"); // ← ポップアップクラス付与
  }, 600);

  document.body.onclick = null;
  startParticles();

  setTimeout(() => button.classList.add("show"), 5000);
}



function showPraiseForm() {
  const main = document.getElementById("mainContainer");
  const form = document.getElementById("praiseFormContainer");
  const sendBtn = document.getElementById("sendPraiseButton");

  main.classList.add("fade-out");
  setTimeout(() => {
    main.classList.add("hidden");
    form.classList.remove("hidden");
    form.style.display = "flex";
    form.classList.add("fade-in");
    sendBtn.classList.add("show");
  }, 600);
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
    if (frame % 10 === 0) addParticles(1);
    particlesArray.forEach(p => { p.update(); p.draw(); });
    frame++;
    requestAnimationFrame(animateParticles);
  }

  animateParticles();
}

window.onload = startParticles;