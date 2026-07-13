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

function renderPlans() {
  const mount = document.getElementById("planGrid");
  const plans = db.plans.list();
  mount.innerHTML = plans.map(p => `
    <div class="plan-card ${p.popular ? "popular" : ""}" data-reveal>
      ${p.popular ? '<span class="plan-badge">Most popular</span>' : ""}
      <div>
        <h3>${p.name}</h3>
        <p class="muted" style="margin-top:6px; font-size:.9rem;">${p.description}</p>
      </div>
      <div class="plan-price">$${p.price}<span>/${p.period}</span></div>
      <ul class="plan-features">${p.features.map(f => `<li>${f}</li>`).join("")}</ul>
      <a href="appointment.html" class="btn ${p.popular ? "btn-primary" : "btn-outline"} btn-block">Book this package</a>
    </div>
  `).join("");
  initReveal();
}
document.addEventListener("DOMContentLoaded", renderPlans);
