const rainbowColors = [
  "rgba(255, 179, 186, OPACITY)", // ピンク
  "rgba(255, 223, 186, OPACITY)", // オレンジ
  "rgba(255, 255, 186, OPACITY)", // イエロー
  "rgba(186, 255, 201, OPACITY)", // グリーン
  "rgba(186, 225, 255, OPACITY)"  // ブルー
];

function praise() {
  // GET
  document.getElementById("praiseMessage").innerText = "えらいね";

  document.body.style.background = "linear-gradient(135deg, #f6e6ff, #e0f7fa, #ffe0f0, #e0ffe0)";
  document.getElementById("initialMessage").classList.add("hidden");
  document.getElementById("initialMessage").style.display = "none";
  document.getElementById("praiseMessage").classList.add("show");
  document.body.onclick = null; // 一度クリックしたら無効にする

  startParticles();

  // 5秒後にボタンを表示
  setTimeout(() => {
    const btn = document.getElementById("praiseButton");
    btn.classList.add("show");
  }, 5000);
  
}

function showPraiseForm() {
  document.getElementById("mainContainer").classList.add("hidden");
  const form = document.getElementById("praiseFormContainer");
  form.classList.remove("hidden");
  form.style.display = "flex";
  setTimeout(() => {
    form.classList.add("show");
    const sendButton = document.getElementById("sendPraiseButton");
    sendButton.classList.add("show");
  }, 50);
}


function sendPraise() {
  const praiseText = document.getElementById("praiseInput").value;

  if (praiseText.trim() !== "") {
    // POST
    alert("あなたの褒め言葉: " + praiseText);
  }
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

      // 振れ幅の大きなサイズ（指数分布）
      this.size = Math.pow(Math.random(), 1.5) * 30 + 0.5;

      const speedFactor = (32 - this.size) / 32;
      this.speedX = (Math.random() - 0.5) * 1.5 * speedFactor;
      this.speedY = -Math.random() * 3.5 * speedFactor - 0.5;

      this.opacity = 0.1 + (this.size / 30) * 0.4; // 全体的に薄めに

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
      ctx.shadowBlur = 30; // ふんわり強めのぼかし
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

  function addParticles(amount) {
    for (let i = 0; i < amount; i++) {
      particlesArray.push(new Particle());
    }
  }

  let frameCount = 0;

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray = particlesArray.filter(p => !p.isDead());

    // フレームカウントで追加頻度を落とす（約30FPSなら1秒に1〜2個）
    if (frameCount % 20 === 0) {
      addParticles(1);
    }

    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
    }

    frameCount++;
    requestAnimationFrame(animateParticles);
  }

  animateParticles();
}




window.onload = () => {
  startParticles();
};