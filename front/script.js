async function praise() {
  // TODO GET
  const response = await fetch("http://localhost:8000/home");
  const json = await response.json();
  const home = JSON.stringify(json);
  document.getElementById("praiseMessage").innerText = home.sentence;

  document.body.style.background = "white";
  document.getElementById("initialMessage").classList.add("hidden");
  document.getElementById("praiseMessage").classList.add("show");
  document.body.onclick = null; // 一度クリックしたら無効にする

  startParticles();

  // 5秒後にボタンを表示
  setTimeout(() => {
    document.getElementById("praiseButton").classList.add("show");
  }, 5000);
}

function showPraiseForm() {
  document.getElementById("mainContainer").classList.add("hidden");
  document.getElementById("praiseFormContainer").classList.remove("hidden");
  document.getElementById("praiseFormContainer").classList.add("show");
}

function sendPraise() {
  const praiseText = document.getElementById("praiseInput").value;

  // TODO POST
  // 確認用仮
  if (praiseText.trim() !== "") {
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
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 5 + 2;
      this.speedX = (Math.random() - 0.5) * 2;
      this.speedY = (Math.random() - 0.5) * 2;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.size > 0.2) this.size -= 0.02;
    }
    draw() {
      ctx.fillStyle = "rgb(255, 191, 17)";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    particlesArray = [];
    for (let i = 0; i < 100; i++) {
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
