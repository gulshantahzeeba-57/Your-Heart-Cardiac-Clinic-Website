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

function renderDoctors() {
  const mount = document.getElementById("doctorGrid");
  const items = db.doctors.list();
  mount.innerHTML = items.map(d => `
    <div class="doctor-card" data-reveal>
      <img src="${d.image}" alt="${d.name}">
      <div class="body">
        <h3 style="font-size:1.05rem;">${d.name}</h3>
        <div class="role">${d.title}</div>
        <p>${d.bio}</p>
        <p class="muted" style="font-size:.78rem; margin-top:10px;">${d.specialty} · ${d.experience}</p>
      </div>
    </div>
  `).join("");
}
document.addEventListener("DOMContentLoaded", renderDoctors);
