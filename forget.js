"use strict";

const forgetForm    = document.getElementById("forgetForm");
const emailInput    = document.getElementById("emailInput");
const errorBox      = document.getElementById("errorBox");
const errorMsg      = document.getElementById("errorMsg");
const submitBtn     = document.getElementById("submitBtn");
const stepOne       = document.getElementById("stepOne");
const stepTwo       = document.getElementById("stepTwo");
const submittedEmail= document.getElementById("submittedEmail");
const newPassword   = document.getElementById("newPassword");
const errorBox2     = document.getElementById("errorBox2");
const errorMsg2     = document.getElementById("errorMsg2");
const resetBtn      = document.getElementById("resetBtn");
const eyeBtn        = document.getElementById("eyeBtn");
const eyeIcon       = document.getElementById("eyeIcon");

function showError(box, msgEl, text) {
  msgEl.textContent = text;
  box.classList.add("visible");
  box.style.animation = "none";
  void box.offsetHeight;
  box.style.animation = "";
}

function hideError(box) {
  box.classList.remove("visible");
}

emailInput.addEventListener("input", function() {
  hideError(errorBox);
});

newPassword.addEventListener("input", function() {
  hideError(errorBox2);
});

eyeBtn.addEventListener("click", function() {
  const isPass = newPassword.type === "password";
  newPassword.type = isPass ? "text" : "password";
  eyeIcon.className = isPass ? "fa-solid fa-eye-slash" : "fa-solid fa-eye";
  eyeBtn.style.transform = "translateY(-50%) rotateY(180deg)";
  setTimeout(function() {
    eyeBtn.style.transform = "translateY(-50%) rotateY(0deg)";
  }, 200);
});

function delay(ms) {
  return new Promise(function(resolve) { setTimeout(resolve, ms); });
}

forgetForm.addEventListener("submit", async function(e) {
  e.preventDefault();
  hideError(errorBox);

  const val = emailInput.value.trim();

  if (!val) {
    return showError(errorBox, errorMsg, "Please enter your email or username.");
  }

  submitBtn.classList.add("loading");
  submitBtn.disabled = true;

  await delay(1000);

  submitBtn.classList.remove("loading");
  submitBtn.disabled = false;

  submittedEmail.textContent = val;

  stepOne.style.transition = "opacity 0.3s, transform 0.3s";
  stepOne.style.opacity    = "0";
  stepOne.style.transform  = "translateY(-12px)";

  await delay(300);

  stepOne.style.display = "none";
  document.getElementById("stepInfo").style.display = "none";

  stepTwo.style.display   = "block";
  stepTwo.style.opacity   = "0";
  stepTwo.style.transform = "translateY(12px)";
  stepTwo.style.transition = "opacity 0.35s, transform 0.35s";

  await delay(20);
  stepTwo.style.opacity   = "1";
  stepTwo.style.transform = "translateY(0)";
});

resetBtn.addEventListener("click", async function() {
  hideError(errorBox2);

  const newPass = newPassword.value;

  if (!newPass || newPass.length < 6) {
    return showError(errorBox2, errorMsg2, "Password must be at least 6 characters.");
  }

  resetBtn.classList.add("loading");
  resetBtn.disabled = true;

  await delay(900);

  localStorage.setItem("password", newPass);

  resetBtn.classList.remove("loading");
  resetBtn.innerHTML = `
    <span class="btn-text">Password Updated!</span>
    <span class="btn-icon"><i class="fa-solid fa-check"></i></span>
    <div class="btn-shine"></div>
  `;
  resetBtn.style.background  = "linear-gradient(135deg, #2ecc71, #27ae60)";
  resetBtn.style.boxShadow   = "0 16px 48px rgba(46,204,113,0.4)";

  await delay(1200);
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