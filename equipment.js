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

function renderEquipment() {
  const mount = document.getElementById("equipmentGrid");
  const items = db.equipment.list();
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
document.addEventListener("DOMContentLoaded", renderEquipment);
