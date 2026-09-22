async function atualizarContador() {
  const elemento = document.getElementById("visits");

  try {
    const caminho = location.pathname || "/";

    const resposta = await fetch(
      `https://silvaresjs.goatcounter.com/counter/${encodeURIComponent(caminho)}.json`,
      { cache: "no-store" }
    );

    if (!resposta.ok) throw new Error(resposta.status);

    const dados = await resposta.json();
    elemento.textContent = dados.count ?? "—";
  } catch (erro) {
    console.error("Erro no contador:", erro);
    elemento.textContent = "—";
  }
}

atualizarContador();

// Discord (Lanyard API)
const DISCORD_ID = "1079886343850696744";
const avatarEl = document.getElementById("avatar");
const profileNameEl = document.getElementById("profileName");
const discordStatusDot = document.getElementById("discordStatusDot");

function updateDiscordCard(data) {
  const user = data.discord_user;
  const status = data.discord_status || "offline";

  const avatarExt =
    user.avatar && user.avatar.startsWith("a_") ? "gif" : "png";

  const avatarUrl = user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${avatarExt}?size=128`
    : `https://cdn.discordapp.com/embed/avatars/0.png`;

  avatarEl.innerHTML = `<img src="${avatarUrl}" alt="Avatar de ${
    user.global_name || user.username
  }">`;

  profileNameEl.textContent = user.global_name || user.username;
  discordStatusDot.className = "discord-status-dot " + status;
}

async function fetchDiscordPresence() {
  try {
    const res = await fetch(
      `https://api.lanyard.rest/v1/users/${DISCORD_ID}`
    );

    const json = await res.json();

    if (json.success) {
      updateDiscordCard(json.data);
    }
  } catch {
    // Falha na API: mantém o avatar/nome padrão
    // que já está no HTML.
  }
}

fetchDiscordPresence();
setInterval(fetchDiscordPresence, 60000);

// Tela "click here"
const gate = document.getElementById("gate");
const audio = document.getElementById("audio");

let entered = false;

function enterSite() {
  if (entered) return;

  entered = true;

  gate.classList.add("hidden");
  document.body.classList.remove("locked");

  audio.play().catch(() => {
    // Autoplay pode ser bloqueado pelo navegador.
  });

  setTimeout(() => gate.remove(), 600);
}

gate.addEventListener("click", enterSite);

gate.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    enterSite();
  }
});

gate.setAttribute("tabindex", "0");
gate.setAttribute("role", "button");
gate.setAttribute(
  "aria-label",
  "Clique para entrar no site e iniciar a música"
);

// Parallax suave
let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;

function updateParallax(x, y) {
  targetX = (x / innerWidth - 0.5) * 18;
  targetY = (y / innerHeight - 0.5) * 12;
}

addEventListener(
  "pointermove",
  (event) => {
    updateParallax(event.clientX, event.clientY);
  },
  { passive: true }
);

addEventListener(
  "touchmove",
  (event) => {
    const touch = event.touches[0];

    if (touch) {
      updateParallax(touch.clientX, touch.clientY);
    }
  },
  { passive: true }
);

function animateParallax() {
  currentX += (targetX - currentX) * 0.035;
  currentY += (targetY - currentY) * 0.035;

  document.body.style.setProperty("--mx", `${currentX}px`);
  document.body.style.setProperty("--my", `${currentY}px`);

  requestAnimationFrame(animateParallax);
}

animateParallax();

// Partículas
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

let particles = [];

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}

function make() {
  particles = Array.from({ length: 55 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + 0.3,
    vx: (Math.random() - 0.5) * 0.18,
    vy: (Math.random() - 0.5) * 0.18,
  }));
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(255,255,255,.65)";

  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > canvas.width) {
      p.vx *= -1;
    }

    if (p.y < 0 || p.y > canvas.height) {
      p.vy *= -1;
    }

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(animate);
}

addEventListener("resize", () => {
  resize();
  make();
});

resize();
make();
animate();