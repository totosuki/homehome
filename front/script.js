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
  // 取得済みなら表示
  if (Object.keys(receivedHome).length !== 0) {
    message.innerText = receivedHome.sentence;
  } else {
    // 褒め言葉を取得
    const response = await apiFetch("/homes");
    message.innerText = response.sentence;
  }

  playSound("get");

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

function playSound(key) {
  if (sounds[key]) {
    sounds[key].currentTime = 0; // 再生位置をリセット
    sounds[key].volume = 0.5;
    sounds[key].play();
  }
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

window.onload = () => {
  startParticles();
}
