const rainbowColors = [
  "rgba(255, 179, 186, OPACITY)",
  "rgba(255, 223, 186, OPACITY)",
  "rgba(255, 255, 186, OPACITY)",
  "rgba(186, 255, 201, OPACITY)",
  "rgba(186, 225, 255, OPACITY)",
];

const player = document.getElementById("se");
const sounds = {
  get: new Audio("assets/audios/get.mp3"),
  next: new Audio("assets/audios/next.mp3"),
  post: new Audio("assets/audios/post.mp3"),
};

async function praise() {
  const message = document.getElementById("praiseMessage");
  const initial = document.getElementById("initialMessage");
  const button = document.getElementById("praiseButton");

  // 今日の褒め言葉を取得済みかどうかを確認する
  const receivedHome = await fetchReceivedHome();
  if (receivedHome.length > 0) {
    message.innerText = receivedHome.sentence;
  } else {
    // 褒め言葉を取得
    const response = await apiFetch("/homes");
    message.innerText = response.sentence;
  }

  playSound("get");

  // 背景変更（フェードは前の回答で）
  document.getElementById("bg2").style.background =
    "linear-gradient(135deg, #f6e6ff, #e0f7fa, #ffe0f0, #e0ffe0)";
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

  playSound("next");

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
  if (!praiseText.trim()) return;

  playSound("post");

  const form = document.getElementById("praiseFormContainer");

  // フォームをフェードアウト
  form.classList.remove("fade-in");
  form.classList.add("fade-out");
  form.classList.add("hidden");

  // テキストを落とす
  const fallingText = document.createElement("div");
  fallingText.classList.add("praise-text-drop");
  fallingText.innerText = praiseText;
  document.body.appendChild(fallingText);

  // 終了画面を表示
  const thankYouMessage = document.createElement("div");
  thankYouMessage.classList.add("thank-you");
  thankYouMessage.innerText = "ありがとう！";
  document.body.appendChild(thankYouMessage);
  const bg = document.getElementById("bg2");
  bg.style.opacity = 0;
  setTimeout(() => {
    thankYouMessage.style.opacity = 1;
  }, 2000);

  // サーバーに送信
  const body = { sentence: praiseText };
  apiFetch("/homes", {
    method: "POST",
    body: JSON.stringify(body),
  });
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
      const baseColor =
        rainbowColors[Math.floor(Math.random() * rainbowColors.length)];
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
    particlesArray = particlesArray.filter((p) => !p.isDead());
    if (frame % 10 === 0) addParticles(1);
    particlesArray.forEach((p) => {
      p.update();
      p.draw();
    });
    frame++;
    requestAnimationFrame(animateParticles);
  }

  animateParticles();
}

function playSound(key) {
  if (sounds[key]) {
    sounds[key].currentTime = 0; // 再生位置をリセット
    sounds[key].volume = 0.5;
    sounds[key].play();
  }
}

async function onload() {
  startParticles();
}

async function fetchReceivedHome() {
  // 受け取り済みの home があれば返す
  const res = await apiFetch("/homes/received");
  return res;
}

async function apiFetch(endpoint, options = {}) {
  // fetch() の ラッパー
  const url = `${config.BASE_URL}${endpoint}`;
  const defaultHeaders = {
    "Content-Type": "application/json",
  };
  options.headers = { ...defaultHeaders, ...options.headers };

  const response = await fetch(url, options);

  if (!response.ok) {
    // エラーハンドリング
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

window.onload = onload();
