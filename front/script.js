const player = document.getElementById("se");
const sounds = {
  get: new Audio("assets/audios/get.mp3"),
  next: new Audio("assets/audios/next.mp3"),
  post: new Audio("assets/audios/post.mp3"),
};

const elems = {
  message: document.getElementById("praiseMessage"),
  initial: document.getElementById("initialMessage"),
  button: document.getElementById("praiseButton"),
  bg: document.getElementById("bg2"),
  main: document.getElementById("mainContainer"),
  form: document.getElementById("praiseFormContainer"),
  sendBtn: document.getElementById("sendPraiseButton"),
  input: document.getElementById("praiseInput"),
};

// サウンド再生
const playSound = (key) => {
  if (sounds[key]) {
    const sound = sounds[key];
    sound.currentTime = 0;
    sound.volume = 0.05;
    sound.play();
  }
};

// API ラッパー
const apiFetch = async (endpoint, options = {}) => {
  const url = `${config.BASE_URL}${endpoint}`;
  const defaultHeaders = { "Content-Type": "application/json" };
  options.headers = { ...defaultHeaders, ...options.headers };

  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`API Error: ${response.status}`);
  return response.json();
};

const getHome = async () => {
  // 褒め言葉を取得済みならそれを、そうでなければ新規取得して返す
  const receivedHome = await apiFetch("/homes/received");
  if (receivedHome) {
    return receivedHome.sentence;
  } else {
    return await apiFetch("/homes").sentence;
  }
};

// アニメーション用ユーティリティ
const fadeOut = (el, duration = 600) => {
  el.classList.add("fade-out");
  setTimeout(() => {
    el.style.display = "none";
  }, duration);
};

const fadeIn = (el, display = "flex") => {
  el.classList.remove("hidden");
  el.style.display = display;
  el.classList.add("fade-in");
};

const transitionToPraiseView = () => {
  // クリックを無効化
  document.body.onclick = null;
  // 背景色を変更
  Object.assign(elems.bg.style, {
    background: "linear-gradient(135deg, #f6e6ff, #e0f7fa, #ffe0f0, #e0ffe0)",
    opacity: 1,
  });

  startParticles();
  fadeOut(elems.initial);

  // 褒め言葉を表示
  setTimeout(() => elems.message.classList.add("pop"), 600);
  // 次へ進むボタンは 5秒後 に表示
  setTimeout(() => elems.button.classList.add("show"), 5000);
};

// 褒め言葉を表示
const praise = async () => {
  // 褒め言葉を取得してセット
  elems.message.innerText = await getHome();
  // 効果音
  playSound("get");
  // 初期画面 -> 褒め言葉表示画面に遷移
  transitionToPraiseView();
};

// 褒めフォームを表示
const showPraiseForm = () => {
  playSound("next");

  fadeOut(elems.main);
  setTimeout(() => {
    fadeIn(elems.form);
    elems.sendBtn.classList.add("show");
  }, 600);
};

// 褒め言葉を送信
const sendPraise = () => {
  const text = elems.input.value.trim();
  if (!text) return;

  playSound("post");
  elems.form.classList.replace("fade-in", "fade-out");
  elems.form.classList.add("hidden");

  const inputRect = elems.input.getBoundingClientRect();

  const fallingText = document.createElement("div");
  fallingText.className = "praise-text-drop";
  fallingText.innerText = text;

  fallingText.style.position = "fixed";
  fallingText.style.top = `${inputRect.top + inputRect.height / 2}px`;
  fallingText.style.left = `${inputRect.left + inputRect.width / 2}px`;
  fallingText.style.transform = "translate(-50%, -50%) scale(1)";

  document.body.appendChild(fallingText);

  const thankYou = document.createElement("div");
  thankYou.className = "thank-you";
  thankYou.innerText = "ありがとう！";
  document.body.appendChild(thankYou);

  elems.bg.style.opacity = 0;
  setTimeout(() => {
    thankYou.style.opacity = 1;
  }, 2000);

  apiFetch("/homes", {
    method: "POST",
    body: JSON.stringify({ sentence: text }),
  });
};

// 初期化
window.onload = () => {
  startParticles();
};
