/* Homepage-specific script. Nav toggle + toast are duplicated in every
   page's own JS file on purpose, so each page file works standalone. */

function initNavToggle() {
  const toggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  if (!toggle || !navLinks) return;
  toggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
  navLinks.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      navLinks.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
}

function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  requestAnimationFrame(() => toast.classList.add("show"));
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), 2800);
}

function initReveal() {
  const items = document.querySelectorAll("[data-reveal]");
  if (!items.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.style.opacity = 1;
        e.target.style.transform = "translateY(0)";
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach((el) => {
    el.style.opacity = 0;
    el.style.transform = "translateY(18px)";
    el.style.transition = "opacity .6s ease, transform .6s ease";
    obs.observe(el);
  });
}

function renderEquipPreview() {
  const mount = document.getElementById("equipPreview");
  const items = db.equipment.list().slice(0, 3);
  mount.innerHTML = items.map(eq => `
    <div class="machine-card" data-reveal>
      <img src="${eq.image}" alt="${eq.name}">
      <div class="body">
        <span class="machine-tag">${eq.category}</span>
        <h3 style="margin-top:10px; font-size:1.05rem;">${eq.name}</h3>
        <p class="muted" style="font-size:.88rem; margin-top:8px;">${eq.description}</p>
      </div>
    </div>
  `).join("");
}

function renderTestPreview() {
  const mount = document.getElementById("testPreview");
  const items = db.testimonials.list().slice(0, 3);
  mount.innerHTML = items.map(t => `
    <div class="test-card" data-reveal>
      <div class="stars">${"★".repeat(t.rating)}${"☆".repeat(5-t.rating)}</div>
      <p class="test-quote">"${t.quote}"</p>
      <div class="test-person">
        <img src="${t.image}" alt="${t.name}">
        <div><b>${t.name}</b><span>${t.role}</span></div>
      </div>
    </div>
  `).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  initNavToggle();
  renderEquipPreview();
  renderTestPreview();
  initReveal();
});
