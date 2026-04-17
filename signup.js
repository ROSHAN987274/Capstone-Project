"use strict";

const signupForm   = document.getElementById("signupForm");
const fullnameEl   = document.getElementById("fullname");
const emailEl      = document.getElementById("email");
const usernameEl   = document.getElementById("username");
const passwordEl   = document.getElementById("password");
const confirmEl    = document.getElementById("confirmPassword");
const errorBox     = document.getElementById("errorBox");
const errorMsg     = document.getElementById("errorMsg");
const submitBtn    = document.getElementById("submitBtn");
const strengthFill = document.getElementById("strengthFill");
const strengthLabel= document.getElementById("strengthLabel");

function toggleEye(inputEl, iconEl) {
  const isPass = inputEl.type === "password";
  inputEl.type  = isPass ? "text" : "password";
  iconEl.className = isPass ? "fa-solid fa-eye-slash" : "fa-solid fa-eye";
}

document.getElementById("eyeBtn1").addEventListener("click", function() {
  toggleEye(passwordEl, document.getElementById("eyeIcon1"));
});

document.getElementById("eyeBtn2").addEventListener("click", function() {
  toggleEye(confirmEl, document.getElementById("eyeIcon2"));
});

function showError(msg) {
  errorMsg.textContent = msg;
  errorBox.classList.add("visible");
  errorBox.style.animation = "none";
  void errorBox.offsetHeight;
  errorBox.style.animation = "";
}

function hideError() {
  errorBox.classList.remove("visible");
}

[fullnameEl, emailEl, usernameEl, passwordEl, confirmEl].forEach(function(el) {
  el.addEventListener("input", hideError);
});

passwordEl.addEventListener("input", function() {
  const val = passwordEl.value;
  const strength = getStrength(val);

  const colors = ["#e8394b", "#e87d2b", "#e8b84b", "#27ae60"];
  const labels = ["Weak", "Fair", "Good", "Strong"];
  const widths = ["25%", "50%", "75%", "100%"];

  if (val.length === 0) {
    strengthFill.style.width = "0%";
    strengthLabel.textContent = "Password strength";
    return;
  }

  strengthFill.style.width      = widths[strength];
  strengthFill.style.background = colors[strength];
  strengthLabel.textContent     = labels[strength];
});

function getStrength(pw) {
  let score = 0;
  if (pw.length >= 8)               score++;
  if (/[A-Z]/.test(pw))             score++;
  if (/[0-9]/.test(pw))             score++;
  if (/[^A-Za-z0-9]/.test(pw))      score++;
  return Math.min(score - 1, 3);
}

function delay(ms) {
  return new Promise(function(resolve) { setTimeout(resolve, ms); });
}

signupForm.addEventListener("submit", async function(e) {
  e.preventDefault();
  hideError();

  const name     = fullnameEl.value.trim();
  const email    = emailEl.value.trim();
  const username = usernameEl.value.trim();
  const password = passwordEl.value;
  const confirm  = confirmEl.value;

  if (!name)                              { return showError("Please enter your full name."); }
if (!email || !/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.com$/.test(email)) {
    return showError("Enter email in format like a@a.com");
}  if (!username || username.length < 3)   { return showError("Username must be at least 3 characters."); }
  if (!password || password.length < 6)   { return showError("Password must be at least 6 characters."); }
  if (password !== confirm)               { return showError("Passwords do not match."); }

  submitBtn.classList.add("loading");
  submitBtn.disabled = true;

  await delay(900);

  localStorage.setItem("username", username);
  localStorage.setItem("password", password);
  localStorage.setItem("fullname", name);
  localStorage.setItem("email", email);

  submitBtn.classList.remove("loading");
  submitBtn.innerHTML = `
    <span class="btn-text">Account Created!</span>
    <span class="btn-icon"><i class="fa-solid fa-check"></i></span>
    <div class="btn-shine"></div>
  `;
  submitBtn.style.background   = "linear-gradient(135deg, #2ecc71, #27ae60)";
  submitBtn.style.boxShadow    = "0 16px 48px rgba(46,204,113,0.4)";

  await delay(1000);
  window.location.href = "index.html";
});

(function initParticles() {
  const canvas = document.getElementById("particleCanvas");
  const ctx    = canvas.getContext("2d");
  let W, H, particles;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function newParticle(randomY) {
    return {
      x:     Math.random() * W,
      y:     randomY ? Math.random() * H : H + 10,
      r:     Math.random() * 1.4 + 0.3,
      vy:    -(Math.random() * 0.4 + 0.15),
      vx:    (Math.random() - 0.5) * 0.15,
      alpha: Math.random() * 0.45 + 0.1,
      gold:  Math.random() > 0.5,
    };
  }

  function init() {
    particles = Array.from({ length: 80 }, function() { return newParticle(true); });
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(function(p, i) {
      p.y     += p.vy;
      p.x     += p.vx;
      p.alpha -= 0.0007;
      if (p.y < -10 || p.alpha <= 0) { particles[i] = newParticle(false); return; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.gold
        ? `hsla(35, 75%, 62%, ${p.alpha})`
        : `hsla(355, 75%, 62%, ${p.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", function() { resize(); init(); });
  resize();
  init();
  animate();
})();