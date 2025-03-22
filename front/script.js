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
      this.size = Math.random() * 4 + 1;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = -Math.random() * 2.5 - 0.5;
      this.opacity = Math.random() * 0.5 + 0.3;  
      const baseColor = rainbowColors[Math.floor(Math.random() * rainbowColors.length)];
      this.color = baseColor.replace("OPACITY", this.opacity);
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.size > 0.2) this.size -= 0.005;
    }
    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    particlesArray = [];
    for (let i = 0; i < 200; i++) {
      particlesArray.push(new Particle());
    }
  }  

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
    }
    requestAnimationFrame(animateParticles);
  }

  initParticles();
  animateParticles();
}

window.onload = () => {
  startParticles();
};