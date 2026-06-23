const weddingTarget = new Date("2026-09-13T07:30:00+05:30").getTime();
const $ = (selector) => document.querySelector(selector);
const envelopeGate = $("#envelopeGate");
const openInviteButton = $("#openInvite");

function updateCountdown() {
  const now = Date.now();
  const distance = Math.max(0, weddingTarget - now);
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  $("#days").textContent = String(days).padStart(3, "0");
  $("#hours").textContent = String(hours).padStart(2, "0");
  $("#minutes").textContent = String(minutes).padStart(2, "0");
  $("#seconds").textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

function openInvitationGate() {
  if (!envelopeGate || envelopeGate.classList.contains("opening")) return;
  envelopeGate.classList.add("opening");
  document.body.classList.remove("invitation-locked");
  playAttachedMusic();

  setTimeout(() => {
    envelopeGate.classList.add("opened");
  }, 1250);

  setTimeout(() => {
    envelopeGate.remove();
  }, 2300);
}

openInviteButton?.addEventListener("click", openInvitationGate);

function createSparkles() {
  const layer = $("#particles");
  for (let i = 0; i < 70; i += 1) {
    const spark = document.createElement("span");
    spark.className = "spark";
    spark.style.left = `${Math.random() * 100}%`;
    spark.style.animationDuration = `${7 + Math.random() * 10}s`;
    spark.style.animationDelay = `${Math.random() * 9}s`;
    spark.style.opacity = `${0.35 + Math.random() * 0.65}`;
    layer.appendChild(spark);
  }
}

function createPetal() {
  const layer = $("#petals");
  const petal = document.createElement("span");
  petal.className = "petal";
  petal.style.left = `${Math.random() * 100}%`;
  petal.style.setProperty("--drift", `${-70 + Math.random() * 140}px`);
  petal.style.animationDuration = `${7 + Math.random() * 7}s`;
  petal.style.opacity = `${0.35 + Math.random() * 0.38}`;
  layer.appendChild(petal);
  setTimeout(() => petal.remove(), 15000);
}

createSparkles();
setInterval(createPetal, 900);

const canvas = $("#scratchCanvas");
const scratchCard = $("#scratchCard");
const ctx = canvas.getContext("2d");
let scratching = false;
let revealed = false;

function sizeScratchCanvas() {
  const rect = scratchCard.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(rect.width * ratio);
  canvas.height = Math.floor(rect.height * ratio);
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  paintScratchCover(rect.width, rect.height);
}

function paintScratchCover(width, height) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#f9e39a");
  gradient.addColorStop(0.34, "#c58b2f");
  gradient.addColorStop(0.7, "#fff1b6");
  gradient.addColorStop(1, "#9f671f");
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "rgba(57, 25, 10, 0.34)";
  for (let x = -width; x < width * 2; x += 28) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + height, height);
    ctx.lineWidth = 10;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.stroke();
  }
  ctx.fillStyle = "#3a170d";
  ctx.font = "700 18px Montserrat, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Scratch Here", width / 2, height / 2 - 8);
  ctx.font = "600 30px Cinzel, serif";
  ctx.fillText("Golden Date", width / 2, height / 2 + 34);
}

function pointerPosition(event) {
  const rect = canvas.getBoundingClientRect();
  const point = event.touches ? event.touches[0] : event;
  return {
    x: point.clientX - rect.left,
    y: point.clientY - rect.top
  };
}

function scratch(event) {
  if (!scratching || revealed) return;
  event.preventDefault();
  const { x, y } = pointerPosition(event);
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(x, y, 26, 0, Math.PI * 2);
  ctx.fill();
  checkRevealProgress();
}

function checkRevealProgress() {
  const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let clear = 0;
  for (let i = 3; i < image.data.length; i += 16) {
    if (image.data[i] < 20) clear += 1;
  }
  if (clear / (image.data.length / 16) > 0.42) {
    revealed = true;
    canvas.style.transition = "opacity 0.8s ease";
    canvas.style.opacity = "0";
    burstCelebration();
  }
}

function burstCelebration() {
  for (let i = 0; i < 42; i += 1) {
    setTimeout(createPetal, i * 25);
  }
}

["mousedown", "touchstart"].forEach((eventName) => {
  canvas.addEventListener(eventName, (event) => {
    scratching = true;
    scratch(event);
  }, { passive: false });
});

["mousemove", "touchmove"].forEach((eventName) => {
  canvas.addEventListener(eventName, scratch, { passive: false });
});

["mouseup", "mouseleave", "touchend", "touchcancel"].forEach((eventName) => {
  canvas.addEventListener(eventName, () => {
    scratching = false;
  });
});

window.addEventListener("resize", () => {
  if (!revealed) sizeScratchCanvas();
});

window.addEventListener("load", sizeScratchCanvas);

const music = $("#weddingMusic");
const musicButton = $("#musicToggle");
music.volume = 0.35;

function setMusicButton(isPlaying) {
  musicButton.querySelector(".music-label").textContent = isPlaying ? "Mute Music" : "Tap to Play Music";
  musicButton.querySelector("i").className = isPlaying ? "fa-solid fa-volume-high" : "fa-solid fa-music";
  musicButton.setAttribute("aria-label", isPlaying ? "Mute music" : "Play music");
}

async function playAttachedMusic() {
  try {
    music.muted = false;
    await music.play();
    window.lastMusicError = "";
    setMusicButton(true);
    return true;
  } catch (error) {
    window.lastMusicError = error.message;
    setMusicButton(false);
    return false;
  }
}

function pauseAttachedMusic() {
  music.pause();
  setMusicButton(false);
}

musicButton.addEventListener("click", async () => {
  if (music.paused) {
    await playAttachedMusic();
  } else {
    pauseAttachedMusic();
  }
});

window.addEventListener("load", () => {
  playAttachedMusic();
});

document.addEventListener("pointerdown", () => {
  if (music.paused) {
    playAttachedMusic();
  }
}, { once: true });
