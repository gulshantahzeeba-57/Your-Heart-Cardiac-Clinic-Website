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

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(location.search);
  const post = db.posts.get(params.get("id")) || db.posts.list()[0];
  if (post) {
    document.title = post.title + " — Your Heart";
    document.getElementById("postCategory").textContent = post.category;
    document.getElementById("postTitle").textContent = post.title;
    document.getElementById("postCrumb").textContent = post.title;
    document.getElementById("postImage").src = post.image;
    document.getElementById("postImage").alt = post.title;
    document.getElementById("postText").textContent = post.body;
    document.getElementById("postAuthor").textContent = post.author;
    document.getElementById("postDate").textContent = new Date(post.date).toLocaleDateString(undefined,{month:"long",day:"numeric",year:"numeric"});
    const related = db.posts.list().filter(p => p.id !== post.id).slice(0, 3);
    document.getElementById("relatedPosts").innerHTML = related.map(p => `
      <a href="blog-post.html?id=${p.id}" style="display:flex; gap:12px; align-items:center;">
        <img src="${p.image}" alt="${p.title}" style="width:56px; height:56px; border-radius:10px; object-fit:cover;">
        <span style="font-size:.85rem; font-weight:600; color:var(--dark);">${p.title}</span>
      </a>
    `).join("");
  } else {
    document.getElementById("postTitle").textContent = "Post not found";
  }
});
