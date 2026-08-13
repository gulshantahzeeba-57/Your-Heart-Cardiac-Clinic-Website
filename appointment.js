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

document.addEventListener("DOMContentLoaded", () => { initNavToggle(); initReveal(); });

document.addEventListener("DOMContentLoaded", () => {
  let session = null;
  try { session = JSON.parse(localStorage.getItem("yourheart_session")); } catch (err) {}

  const gate = document.getElementById("authGate");
  const apptSection = document.getElementById("apptSection");

  if (!session) {
    gate.hidden = false;
    apptSection.hidden = true;
    sessionStorage.setItem("redirectAfterLogin", "appointment.html");
  } else {
    gate.hidden = true;
    apptSection.hidden = false;
    document.getElementById("apName").value = session.name || "";
    document.getElementById("apEmail").value = session.email || "";
  }
});

document.getElementById("apptForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const appt = {
    name: document.getElementById("apName").value,
    email: document.getElementById("apEmail").value,
    date: document.getElementById("apDate").value,
    time: document.getElementById("apTime").value,
    doctor: document.getElementById("apDoctor").value,
    goal: document.getElementById("apGoal").value,
    notes: document.getElementById("apNotes").value,
    status: "Pending",
    createdAt: new Date().toISOString(),
  };
  db.appointments.create(appt);
  showToast("Appointment requested — we'll confirm by email.");
  e.target.reset();
});
