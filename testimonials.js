function initNavToggle() {
  const toggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  if (!toggle || !navLinks) return;
  toggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
  navLinks.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => { navLinks.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); })
  );
}
function initReveal() {
  const items = document.querySelectorAll("[data-reveal]");
  if (!items.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.style.opacity = 1; e.target.style.transform = "translateY(0)"; obs.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  items.forEach((el) => {
    el.style.opacity = 0; el.style.transform = "translateY(18px)";
    el.style.transition = "opacity .6s ease, transform .6s ease"; obs.observe(el);
  });
}
document.addEventListener("DOMContentLoaded", () => { initNavToggle(); initReveal(); });

function renderTestGrid() {
  const mount = document.getElementById("testGrid");
  const items = db.testimonials.list();
  mount.innerHTML = items.map(t => `
    <div class="test-card" data-reveal>
      <div class="stars">${"★".repeat(t.rating)}${"☆".repeat(5-t.rating)}</div>
      <p class="test-quote">"${t.quote}"</p>
      <div class="test-person"><img src="${t.image}" alt="${t.name}"><div><b>${t.name}</b><span>${t.role}</span></div></div>
    </div>
  `).join("");
  initReveal();
}
document.addEventListener("DOMContentLoaded", renderTestGrid);
