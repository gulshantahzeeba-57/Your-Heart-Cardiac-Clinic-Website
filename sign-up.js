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

document.getElementById("signUpForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("suEmail").value;
  if (db.users.list().some(u => u.email.toLowerCase() === email.toLowerCase())) {
    showToast("An account with that email already exists.");
    return;
  }
  const user = db.users.create({
    name: document.getElementById("suName").value,
    email,
    role: "member",
    joined: new Date().toISOString().slice(0, 10),
  });
  localStorage.setItem("yourheart_session", JSON.stringify(user));
  showToast("Account created — welcome to Your Heart!");
  setTimeout(() => { window.location.href = "index.html"; }, 900);
});
