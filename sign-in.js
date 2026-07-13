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

document.getElementById("signInForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("siEmail").value;
  const user = db.users.list().find(u => u.email.toLowerCase() === email.toLowerCase());
  if (user) {
    localStorage.setItem("yourheart_session", JSON.stringify(user));
    showToast("Welcome back, " + user.name + "!");
    setTimeout(() => { window.location.href = user.role === "admin" ? "admin.html" : "index.html"; }, 900);
  } else {
    showToast("No account found for that email — try Create one.");
  }
});
