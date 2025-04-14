import { playSound } from "./utils/sound.js";
import { startParticles } from "./utils/particle.js";

const elems = {
  message: document.getElementById("homeMessage"),
  initialSub: document.getElementById("initialMessageSub"),
  initial: document.getElementById("initialMessage"),
  button: document.getElementById("homeButton"),
  bg: document.getElementById("bg2"),
  main: document.getElementById("mainContainer"),
  form: document.getElementById("homeFormContainer"),
  sendBtn: document.getElementById("sendHomeButton"),
  input: document.getElementById("homeInput"),
  modal: document.getElementById("myModal"),
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

// 文字数制限関係
const MAX_LENGTH = 20;

const updateCharCount = () => {
  const count = elems.input.value.trim().length;
  const counterEl = document.getElementById("charCount");
  counterEl.innerText = `${count}/${MAX_LENGTH}`;
  if (count > MAX_LENGTH) {
    counterEl.style.color = "red";
  } else {
    counterEl.style.color = "#666";
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

const transitionToHomeView = () => {
  // クリックを無効化
  document.body.onclick = null;
  // 背景色を上乗せ
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

const transitionToFormView = () => {
  fadeOut(elems.main);
  setTimeout(() => {
    fadeIn(elems.form);
    elems.sendBtn.classList.add("show");
    // 文字数制限を開始
    updateCharCount();
    elems.input.addEventListener("input", updateCharCount);
  }, 600);
};

const transitionToEndView = () => {
  // 上乗せした背景を消して初期背景に戻す
  elems.bg.style.opacity = 0;

  // ありがとう を ２秒後 に表示
  const thankYou = document.createElement("div");
  thankYou.className = "thank-you";
  thankYou.innerText = "ありがとう！";
  document.body.appendChild(thankYou);
  setTimeout(() => {
    thankYou.style.opacity = 1;
  }, 2000);
};

const setReceivedView = (receivedHome) => {
  // 取得済みの今日の褒め言葉を表示
  elems.initial.innerText = receivedHome.sentence;
  elems.initialSub.hidden = false;
  document.body.onclick = null;
};

const showFallingText = (text) => {
  elems.form.classList.replace("fade-in", "fade-out");
  elems.form.classList.add("hidden");

  const fallingText = document.createElement("div");
  fallingText.className = "home-text-drop";
  fallingText.innerText = text;
  const inputRect = elems.input.getBoundingClientRect();
  fallingText.style.position = "fixed";
  fallingText.style.top = `${inputRect.top + inputRect.height / 2}px`;
  fallingText.style.left = `${inputRect.left + inputRect.width / 2}px`;
  fallingText.style.transform = "translate(-50%, -50%) scale(1)";
  document.body.appendChild(fallingText);
};

// メイン処理 //
const beforeLoad = async () => {
  const loginHash = localStorage.getItem("login_hash");
  if (loginHash) {
    // ログイン履歴がある
    const receivedHome = await apiFetch(`/homes/received?hash=${loginHash}`);
    if (receivedHome) {
      // 今日のログイン履歴がある：今日の褒め言葉を表示
      setReceivedView(receivedHome);
      return;
    }
  }
  // 今日の初回ログイン：褒め言葉を取得してセット
  elems.initial.innerText = "> ほめてもらう <";
};

// 褒め言葉を表示
const showHome = async () => {
  try {
    const home = await apiFetch("/homes");
    elems.message.innerText = home.sentence;
    // ログイン情報を保存
    localStorage.setItem("login_hash", home.hash);
    // 効果音
    playSound("get");
    // 初期画面 -> 褒め言葉表示画面 に遷移
    transitionToHomeView();
  } catch (error) {
    // エラーモーダルを表示
    elems.modal.classList.add("active");
  }
};

// 褒めフォームを表示
const showHomeForm = () => {
  // 効果音
  playSound("next");
  // 褒め言葉表示画面 -> 褒め言葉入力画面 に遷移
  transitionToFormView();
};

// 褒め言葉を送信
const sendNewHome = async () => {
  // 褒め言葉に関する条件を満たしたらPOST
  const newSentence = elems.input.value.trim();
  if (!newSentence) {
    alert("褒め言葉を入力してください。");
    return;
  }
  if (newSentence.length > MAX_LENGTH) {
    alert(`褒め言葉は${MAX_LENGTH}文字以内でお願いします。`);
    return;
  }
  if (newSentence.includes(",")) {
    alert("カンマ（,）は使えません。全角の「，」をご使用ください。");
    return;
  }

  // 褒め言葉をPOST
  const loginHash = localStorage.getItem("login_hash");
  await apiFetch("/homes", {
    method: "POST",
    body: JSON.stringify({ sentence: newSentence, hash: loginHash }),
  });

  // 効果音
  playSound("post");
  // 演出
  showFallingText(newSentence);
  // 褒め言葉入力画面 -> 終了画面 に遷移
  transitionToEndView();
};

// HTMLから呼び出す関数を登録
window.showHome = showHome;
window.showHomeForm = showHomeForm;
window.sendNewHome = sendNewHome;

// 初期化
await beforeLoad();
startParticles();
