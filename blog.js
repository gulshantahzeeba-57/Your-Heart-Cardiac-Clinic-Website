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

function renderPosts() {
  const mount = document.getElementById("postGrid");
  const items = db.posts.list();
  mount.innerHTML = items.map(p => `
    <a href="blog-post.html?id=${p.id}" class="post-card" data-reveal>
      <img src="${p.image}" alt="${p.title}">
      <div class="body">
        <span class="tag">${p.category}</span>
        <h3>${p.title}</h3>
        <p class="muted" style="font-size:.9rem;">${p.excerpt}</p>
        <div class="meta-row"><span>${p.author}</span><span>${new Date(p.date).toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"})}</span></div>
      </div>
    </a>
  `).join("");
  initReveal();
}
document.addEventListener("DOMContentLoaded", renderPosts);
