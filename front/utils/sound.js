const sounds = {
  get: new Audio("assets/audios/get.mp3"),
  next: new Audio("assets/audios/next.mp3"),
  post: new Audio("assets/audios/post.mp3"),
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

export { playSound };