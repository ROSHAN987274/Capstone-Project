

/* ---- DOM refs ---- */
const loginForm  = document.getElementById("loginForm");
const usernameEl = document.getElementById("username");
const passwordEl = document.getElementById("password");
const eyeBtn     = document.getElementById("eyeBtn");
const eyeIcon    = document.getElementById("eyeIcon");
const errorBox   = document.getElementById("errorBox");
const errorMsg   = document.getElementById("errorMsg");
const submitBtn  = document.getElementById("submitBtn");
const card       = document.getElementById("loginCard");


const canvas = document.getElementById("particleCanvas");
const ctx    = canvas.getContext("2d");
let W, H, particles;

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

class Particle {
  constructor() { this.reset(true); }

  reset(init = false) {
    this.x  = Math.random() * W;
    this.y  = init ? Math.random() * H : H + 10;
    this.r  = Math.random() * 1.4 + 0.3;
    this.vy = -(Math.random() * 0.4 + 0.15);
    this.vx = (Math.random() - 0.5) * 0.15;
    this.alpha = Math.random() * 0.5 + 0.15;
    // Vary between gold and red tints
    this.hue = Math.random() > 0.5
      ? `${Math.floor(Math.random()*15 + 20)}, 80%, 65%`  // gold
      : `${Math.floor(Math.random()*10 + 355)}, 80%, 65%`; // red
  }

  update() {
    this.y += this.vy;
    this.x += this.vx;
    this.alpha -= 0.0008;
    if (this.y < -10 || this.alpha <= 0) this.reset(false);
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${this.hue}, ${this.alpha})`;
    ctx.fill();
  }
}

function initParticles() {
  particles = Array.from({ length: 90 }, () => new Particle());
}

function animateParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}

window.addEventListener("resize", () => { resize(); initParticles(); });
resize();
initParticles();
animateParticles();



document.addEventListener("mousemove", (e) => {
  const rect = card.getBoundingClientRect();
  const cx   = rect.left + rect.width  / 2;
  const cy   = rect.top  + rect.height / 2;
  const dx   = (e.clientX - cx) / (W / 2);
  const dy   = (e.clientY - cy) / (H / 2);
  const rotX =  dy * -5;  // degrees
  const rotY =  dx *  5;
  card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
});

document.addEventListener("mouseleave", () => {
  card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
});

// Password Toggle

eyeBtn.addEventListener("click", () => {
  const isPassword = passwordEl.type === "password";
  passwordEl.type  = isPassword ? "text" : "password";
  eyeIcon.className = isPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye";

  // Quick flip animation
  eyeBtn.style.transform = "translateY(-50%) rotateY(180deg)";
  setTimeout(() => { eyeBtn.style.transform = "translateY(-50%) rotateY(0deg)"; }, 200);
});

// Show/Hide Error


function showError(msg) {
  errorMsg.textContent = msg;
  errorBox.classList.add("visible");
  // Re-trigger shake on repeated errors
  errorBox.style.animation = "none";
  void errorBox.offsetHeight; // reflow
  errorBox.style.animation = "";
}

function hideError() {
  errorBox.classList.remove("visible");
  errorMsg.textContent = "";
}

// Clear Error in Input

usernameEl.addEventListener("input", hideError);
passwordEl.addEventListener("input", hideError);

// Form Submit

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideError();

  const username = usernameEl.value.trim();
  const password = passwordEl.value;

  // Basic client-side validation
  if (!username) {
    usernameEl.focus();
    showError("Please enter your username.");
    return;
  }
  if (!password) {
    passwordEl.focus();
    showError("Please enter your password.");
    return;
  }

  // Loading state
  submitBtn.classList.add("loading");
  submitBtn.disabled = true;

  // Simulate async auth (replace with real API call)
  await delay(900);

  const savedUser = localStorage.getItem("username");
  const savedPass = localStorage.getItem("password");

  submitBtn.classList.remove("loading");
  submitBtn.disabled = false;

  if (username === savedUser && password === savedPass) {

    // Remember me
    if (document.getElementById("remember").checked) {
      sessionStorage.setItem("rememberUser", username);
    }

    // Success animation
    card.classList.add("success");
    submitBtn.innerHTML = `
      <span class="btn-text">Welcome back!</span>
      <span class="btn-icon"><i class="fa-solid fa-check"></i></span>
      <div class="btn-shine"></div>
    `;
    submitBtn.style.background = "linear-gradient(135deg, #2ecc71, #27ae60)";
    submitBtn.style.boxShadow  = "0 16px 48px rgba(46,204,113,0.4)";

    setTimeout(() => {
      window.location.href = "./home.html";
    }, 1000);

  } else {
    showError("Incorrect username or password. Please try again.");
    // Shake the card subtly
    card.style.transform = "perspective(900px) translateX(-6px)";
    setTimeout(() => card.style.transform = "perspective(900px) translateX(6px)", 80);
    setTimeout(() => card.style.transform = "perspective(900px) translateX(-4px)", 160);
    setTimeout(() => card.style.transform = "perspective(900px) translateX(0)", 240);
  }
});

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


const remembered = sessionStorage.getItem("rememberUser");
if (remembered) {
  usernameEl.value = remembered;
  document.getElementById("remember").checked = true;
}
