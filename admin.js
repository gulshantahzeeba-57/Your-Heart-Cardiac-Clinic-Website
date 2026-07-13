/* ============================================================
   Your Heart Admin — dashboard logic
   Generic CRUD over the db.* collections defined in data.js
   ============================================================ */

(function initSession() {
  let session = null;
  try { session = JSON.parse(localStorage.getItem("yourheart_session")); } catch (e) {}
  if (!session) {
    session = db.users.list().find((u) => u.role === "admin") || db.users.create({ name: "Clinic Admin", email: "admin@yourheart.clinic", role: "admin", joined: new Date().toISOString().slice(0, 10) });
    localStorage.setItem("yourheart_session", JSON.stringify(session));
  }
  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("userName").textContent = session.name;
    document.getElementById("userAvatar").textContent = session.name.charAt(0).toUpperCase();
  });
})();

document.getElementById("logoutLink").addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("yourheart_session");
  window.location.href = "sign-in.html";
});

document.getElementById("resetDataLink").addEventListener("click", (e) => {
  e.preventDefault();
  if (confirm("Reset all demo data back to the original seed content? This clears anything you've added or edited.")) {
    db.resetAll();
    location.reload();
  }
});

/* ---------------- Sidebar nav switching ---------------- */
const sections = ["overview", "doctors", "equipment", "posts", "plans", "testimonials", "appointments", "messages", "users"];
const titles = { overview: "Dashboard", doctors: "Doctors", equipment: "Equipment", posts: "Blog Posts", plans: "Pricing Plans", testimonials: "Testimonials", appointments: "Appointments", messages: "Contact Messages", users: "Users" };

function showSection(name) {
  sections.forEach((s) => { document.getElementById("panel-" + s).hidden = s !== name; });
  document.querySelectorAll(".admin-nav a[data-target]").forEach((a) => a.classList.toggle("active", a.dataset.target === name));
  document.getElementById("topbarTitle").textContent = titles[name] || "Dashboard";
  document.getElementById("adminSidebar").classList.remove("open");
  renderAll();
}
document.querySelectorAll("[data-target]").forEach((el) => el.addEventListener("click", (e) => { e.preventDefault(); showSection(el.dataset.target); }));
document.querySelectorAll("[data-target-link]").forEach((el) => el.addEventListener("click", (e) => { e.preventDefault(); showSection(el.dataset.targetLink); }));
document.getElementById("sidebarToggle")?.addEventListener("click", () => document.getElementById("adminSidebar").classList.toggle("open"));

/* ---------------- Modal helpers ---------------- */
const overlay = document.getElementById("modalOverlay");
const modalForm = document.getElementById("modalForm");
const modalTitle = document.getElementById("modalTitle");

function closeModal() { overlay.classList.remove("open"); modalForm.innerHTML = ""; }
document.getElementById("modalClose").addEventListener("click", closeModal);
overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(); });

function escapeHTML(str) { return String(str).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

function fieldHTML(f, value) {
  const v = value === undefined || value === null ? "" : value;
  if (f.type === "textarea") return `<div class="form-field"><label>${f.label}</label><textarea name="${f.name}" rows="${f.rows || 3}" ${f.required ? "required" : ""}>${escapeHTML(v)}</textarea></div>`;
  if (f.type === "select") return `<div class="form-field"><label>${f.label}</label><select name="${f.name}">${f.options.map((o) => `<option value="${o}" ${o === v ? "selected" : ""}>${o}</option>`).join("")}</select></div>`;
  if (f.type === "checkbox") return `<div class="form-field" style="flex-direction:row; align-items:center; gap:10px;"><input type="checkbox" name="${f.name}" ${v ? "checked" : ""} style="width:auto;"><label style="margin:0;">${f.label}</label></div>`;
  return `<div class="form-field"><label>${f.label}</label><input type="${f.type || "text"}" name="${f.name}" value="${escapeHTML(v)}" ${f.required ? "required" : ""} ${f.step ? `step="${f.step}"` : ""}></div>`;
}

function openModal(title, fields, initial, onSubmit) {
  modalTitle.textContent = title;
  modalForm.innerHTML = fields.map((f) => fieldHTML(f, initial ? initial[f.name] : f.default)).join("") +
    `<div style="display:flex; gap:12px; margin-top:8px;"><button type="submit" class="btn btn-primary btn-block">Save</button></div>`;
  overlay.classList.add("open");
  modalForm.onsubmit = (e) => {
    e.preventDefault();
    const data = {};
    fields.forEach((f) => {
      if (f.type === "checkbox") data[f.name] = modalForm.elements[f.name].checked;
      else if (f.type === "number") data[f.name] = Number(modalForm.elements[f.name].value);
      else if (f.list) data[f.name] = modalForm.elements[f.name].value.split("\n").map((s) => s.trim()).filter(Boolean);
      else data[f.name] = modalForm.elements[f.name].value;
    });
    onSubmit(data);
    closeModal();
  };
}

/* ---------------- Field configs ---------------- */
const CONFIG = {
  doctors: {
    fields: [
      { name: "name", label: "Name", required: true },
      { name: "title", label: "Title", required: true },
      { name: "specialty", label: "Specialty" },
      { name: "experience", label: "Experience (e.g. 10 years)" },
      { name: "image", label: "Photo URL" },
      { name: "bio", label: "Bio", type: "textarea", rows: 4 },
    ],
  },
  equipment: {
    fields: [
      { name: "name", label: "Name", required: true },
      { name: "category", label: "Category" },
      { name: "image", label: "Image URL" },
      { name: "description", label: "Description", type: "textarea" },
    ],
  },
  posts: {
    fields: [
      { name: "title", label: "Title", required: true },
      { name: "category", label: "Category", required: true },
      { name: "author", label: "Author", required: true },
      { name: "date", label: "Date", type: "date" },
      { name: "image", label: "Image URL" },
      { name: "excerpt", label: "Excerpt", type: "textarea", rows: 2 },
      { name: "body", label: "Body", type: "textarea", rows: 5 },
    ],
  },
  plans: {
    fields: [
      { name: "name", label: "Plan name", required: true },
      { name: "price", label: "Price (USD)", type: "number", required: true },
      { name: "period", label: "Billing period", default: "visit" },
      { name: "description", label: "Description", type: "textarea", rows: 2 },
      { name: "features", label: "Features (one per line)", type: "textarea", rows: 4, list: true },
      { name: "popular", label: "Mark as most popular", type: "checkbox" },
    ],
  },
  testimonials: {
    fields: [
      { name: "name", label: "Name", required: true },
      { name: "role", label: "Role" },
      { name: "quote", label: "Quote", type: "textarea", required: true },
      { name: "rating", label: "Rating (1-5)", type: "number", default: 5 },
      { name: "image", label: "Photo URL" },
    ],
  },
  users: {
    fields: [
      { name: "name", label: "Name", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "role", label: "Role", type: "select", options: ["member", "admin"] },
      { name: "joined", label: "Joined date", type: "date" },
    ],
  },
};

function emptyRow(colspan, text) { return `<tr><td colspan="${colspan}" class="empty-row">${text}</td></tr>`; }

/* ---------------- Stats + overview ---------------- */
function renderStats() {
  document.getElementById("statDoctors").textContent = db.doctors.list().length;
  document.getElementById("statEquipment").textContent = db.equipment.list().length;
  document.getElementById("statAppointments").textContent = db.appointments.list().length;
  document.getElementById("statUsers").textContent = db.users.list().length;
}

function renderOverviewTables() {
  const appts = db.appointments.list().slice(0, 5);
  document.getElementById("overviewApptTable").innerHTML = `
    <table class="admin-table"><thead><tr><th>Name</th><th>Date</th><th>Doctor</th><th>Status</th></tr></thead>
    <tbody>${appts.length ? appts.map((a) => `<tr><td>${a.name}</td><td>${a.date || "—"}</td><td>${a.doctor||"—"}</td><td><span class="badge badge-${(a.status||'pending').toLowerCase()}">${a.status||"Pending"}</span></td></tr>`).join("") : emptyRow(4, "No appointments yet.")}</tbody></table>`;

  const msgs = db.messages.list().slice(0, 5);
  document.getElementById("overviewMsgTable").innerHTML = `
    <table class="admin-table"><thead><tr><th>Name</th><th>Subject</th><th>Status</th></tr></thead>
    <tbody>${msgs.length ? msgs.map((m) => `<tr><td>${m.name}</td><td>${m.subject}</td><td><span class="badge badge-${(m.status||'new').toLowerCase()}">${m.status||"New"}</span></td></tr>`).join("") : emptyRow(3, "No messages yet.")}</tbody></table>`;
}

/* ---------------- Doctors ---------------- */
function renderDoctors() {
  const items = db.doctors.list();
  document.getElementById("doctorsTable").innerHTML = `
    <table class="admin-table"><thead><tr><th></th><th>Name</th><th>Title</th><th>Specialty</th><th>Experience</th><th></th></tr></thead>
    <tbody>${items.length ? items.map((d) => `
      <tr><td><img class="row-thumb" src="${d.image}" alt=""></td><td>${d.name}</td><td>${d.title}</td><td>${d.specialty||"—"}</td><td>${d.experience||"—"}</td>
      <td class="row-actions"><button class="icon-btn" data-edit="${d.id}">✎</button><button class="icon-btn danger" data-delete="${d.id}">🗑</button></td></tr>`).join("")
      : emptyRow(6, "No doctors yet — add your first one.")}</tbody></table>`;
  document.querySelectorAll("#doctorsTable [data-edit]").forEach((btn) => btn.addEventListener("click", () => {
    const item = db.doctors.get(btn.dataset.edit);
    openModal("Edit doctor", CONFIG.doctors.fields, item, (data) => { db.doctors.update(item.id, data); renderDoctors(); });
  }));
  document.querySelectorAll("#doctorsTable [data-delete]").forEach((btn) => btn.addEventListener("click", () => {
    if (confirm("Delete this doctor?")) { db.doctors.remove(btn.dataset.delete); renderDoctors(); renderStats(); }
  }));
}
document.getElementById("addDoctorBtn").addEventListener("click", () => {
  openModal("New doctor", CONFIG.doctors.fields, {}, (data) => { db.doctors.create(data); renderDoctors(); renderStats(); });
});

/* ---------------- Equipment ---------------- */
function renderEquipment() {
  const items = db.equipment.list();
  document.getElementById("equipmentTable").innerHTML = `
    <table class="admin-table"><thead><tr><th></th><th>Name</th><th>Category</th><th></th></tr></thead>
    <tbody>${items.length ? items.map((eq) => `
      <tr><td><img class="row-thumb" src="${eq.image}" alt=""></td><td>${eq.name}</td><td>${eq.category||"—"}</td>
      <td class="row-actions"><button class="icon-btn" data-edit="${eq.id}">✎</button><button class="icon-btn danger" data-delete="${eq.id}">🗑</button></td></tr>`).join("")
      : emptyRow(4, "No equipment yet — add your first machine.")}</tbody></table>`;
  document.querySelectorAll("#equipmentTable [data-edit]").forEach((btn) => btn.addEventListener("click", () => {
    const item = db.equipment.get(btn.dataset.edit);
    openModal("Edit equipment", CONFIG.equipment.fields, item, (data) => { db.equipment.update(item.id, data); renderEquipment(); });
  }));
  document.querySelectorAll("#equipmentTable [data-delete]").forEach((btn) => btn.addEventListener("click", () => {
    if (confirm("Delete this equipment?")) { db.equipment.remove(btn.dataset.delete); renderEquipment(); renderStats(); }
  }));
}
document.getElementById("addEquipmentBtn").addEventListener("click", () => {
  openModal("New equipment", CONFIG.equipment.fields, {}, (data) => { db.equipment.create(data); renderEquipment(); renderStats(); });
});

/* ---------------- Posts ---------------- */
function renderPosts() {
  const items = db.posts.list();
  document.getElementById("postsTable").innerHTML = `
    <table class="admin-table"><thead><tr><th></th><th>Title</th><th>Category</th><th>Author</th><th>Date</th><th></th></tr></thead>
    <tbody>${items.length ? items.map((p) => `
      <tr><td><img class="row-thumb" src="${p.image}" alt=""></td><td>${p.title}</td><td>${p.category}</td><td>${p.author}</td><td>${p.date}</td>
      <td class="row-actions"><button class="icon-btn" data-edit="${p.id}">✎</button><button class="icon-btn danger" data-delete="${p.id}">🗑</button></td></tr>`).join("")
      : emptyRow(6, "No blog posts yet — add your first one.")}</tbody></table>`;
  document.querySelectorAll("#postsTable [data-edit]").forEach((btn) => btn.addEventListener("click", () => {
    const item = db.posts.get(btn.dataset.edit);
    openModal("Edit post", CONFIG.posts.fields, item, (data) => { db.posts.update(item.id, data); renderPosts(); });
  }));
  document.querySelectorAll("#postsTable [data-delete]").forEach((btn) => btn.addEventListener("click", () => {
    if (confirm("Delete this post?")) { db.posts.remove(btn.dataset.delete); renderPosts(); }
  }));
}
document.getElementById("addPostBtn").addEventListener("click", () => {
  openModal("New post", CONFIG.posts.fields, { date: new Date().toISOString().slice(0, 10) }, (data) => { db.posts.create(data); renderPosts(); });
});

/* ---------------- Plans ---------------- */
function renderPlans() {
  const items = db.plans.list();
  document.getElementById("plansTable").innerHTML = `
    <table class="admin-table"><thead><tr><th>Name</th><th>Price</th><th>Features</th><th>Popular</th><th></th></tr></thead>
    <tbody>${items.length ? items.map((p) => `
      <tr><td>${p.name}</td><td>$${p.price}/${p.period}</td><td>${(p.features||[]).length} listed</td><td>${p.popular ? '<span class="badge badge-confirmed">Yes</span>' : "—"}</td>
      <td class="row-actions"><button class="icon-btn" data-edit="${p.id}">✎</button><button class="icon-btn danger" data-delete="${p.id}">🗑</button></td></tr>`).join("")
      : emptyRow(5, "No plans yet — add your first one.")}</tbody></table>`;
  document.querySelectorAll("#plansTable [data-edit]").forEach((btn) => btn.addEventListener("click", () => {
    const item = db.plans.get(btn.dataset.edit);
    const withJoined = { ...item, features: (item.features || []).join("\n") };
    openModal("Edit plan", CONFIG.plans.fields, withJoined, (data) => { db.plans.update(item.id, data); renderPlans(); });
  }));
  document.querySelectorAll("#plansTable [data-delete]").forEach((btn) => btn.addEventListener("click", () => {
    if (confirm("Delete this plan?")) { db.plans.remove(btn.dataset.delete); renderPlans(); }
  }));
}
document.getElementById("addPlanBtn").addEventListener("click", () => {
  openModal("New plan", CONFIG.plans.fields, { period: "visit" }, (data) => { db.plans.create(data); renderPlans(); });
});

/* ---------------- Testimonials ---------------- */
function renderTestimonials() {
  const items = db.testimonials.list();
  document.getElementById("testimonialsTable").innerHTML = `
    <table class="admin-table"><thead><tr><th></th><th>Name</th><th>Role</th><th>Rating</th><th></th></tr></thead>
    <tbody>${items.length ? items.map((t) => `
      <tr><td><img class="row-thumb" style="border-radius:50%;" src="${t.image}" alt=""></td><td>${t.name}</td><td>${t.role||"—"}</td><td>${"★".repeat(t.rating)}</td>
      <td class="row-actions"><button class="icon-btn" data-edit="${t.id}">✎</button><button class="icon-btn danger" data-delete="${t.id}">🗑</button></td></tr>`).join("")
      : emptyRow(5, "No testimonials yet — add your first one.")}</tbody></table>`;
  document.querySelectorAll("#testimonialsTable [data-edit]").forEach((btn) => btn.addEventListener("click", () => {
    const item = db.testimonials.get(btn.dataset.edit);
    openModal("Edit testimonial", CONFIG.testimonials.fields, item, (data) => { db.testimonials.update(item.id, data); renderTestimonials(); });
  }));
  document.querySelectorAll("#testimonialsTable [data-delete]").forEach((btn) => btn.addEventListener("click", () => {
    if (confirm("Delete this testimonial?")) { db.testimonials.remove(btn.dataset.delete); renderTestimonials(); }
  }));
}
document.getElementById("addTestimonialBtn").addEventListener("click", () => {
  openModal("New testimonial", CONFIG.testimonials.fields, { rating: 5 }, (data) => { db.testimonials.create(data); renderTestimonials(); });
});

/* ---------------- Appointments ---------------- */
function renderAppointments() {
  const items = db.appointments.list();
  document.getElementById("appointmentsTable").innerHTML = `
    <table class="admin-table"><thead><tr><th>Name</th><th>Email</th><th>Date</th><th>Time</th><th>Doctor</th><th>Reason</th><th>Status</th><th></th></tr></thead>
    <tbody>${items.length ? items.map((a) => `
      <tr><td>${a.name}</td><td>${a.email}</td><td>${a.date||"—"}</td><td>${a.time||"—"}</td><td>${a.doctor||"—"}</td><td>${a.goal||"—"}</td>
      <td><select data-status="${a.id}">${["Pending","Confirmed","Cancelled"].map((s) => `<option value="${s}" ${a.status===s?"selected":""}>${s}</option>`).join("")}</select></td>
      <td class="row-actions"><button class="icon-btn danger" data-delete="${a.id}">🗑</button></td></tr>`).join("")
      : emptyRow(8, "No appointments booked yet.")}</tbody></table>`;
  document.querySelectorAll("#appointmentsTable [data-status]").forEach((sel) => sel.addEventListener("change", () => { db.appointments.update(sel.dataset.status, { status: sel.value }); renderOverviewTables(); }));
  document.querySelectorAll("#appointmentsTable [data-delete]").forEach((btn) => btn.addEventListener("click", () => {
    if (confirm("Delete this appointment?")) { db.appointments.remove(btn.dataset.delete); renderAppointments(); renderStats(); renderOverviewTables(); }
  }));
}

/* ---------------- Messages ---------------- */
function renderMessages() {
  const items = db.messages.list();
  document.getElementById("messagesTable").innerHTML = `
    <table class="admin-table"><thead><tr><th>Name</th><th>Email</th><th>Subject</th><th>Message</th><th>Status</th><th></th></tr></thead>
    <tbody>${items.length ? items.map((m) => `
      <tr><td>${m.name}</td><td>${m.email}</td><td>${m.subject}</td><td style="max-width:220px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${m.message}</td>
      <td><select data-status="${m.id}">${["New","Read"].map((s) => `<option value="${s}" ${m.status===s?"selected":""}>${s}</option>`).join("")}</select></td>
      <td class="row-actions"><button class="icon-btn danger" data-delete="${m.id}">🗑</button></td></tr>`).join("")
      : emptyRow(6, "No messages yet.")}</tbody></table>`;
  document.querySelectorAll("#messagesTable [data-status]").forEach((sel) => sel.addEventListener("change", () => { db.messages.update(sel.dataset.status, { status: sel.value }); renderOverviewTables(); }));
  document.querySelectorAll("#messagesTable [data-delete]").forEach((btn) => btn.addEventListener("click", () => {
    if (confirm("Delete this message?")) { db.messages.remove(btn.dataset.delete); renderMessages(); renderOverviewTables(); }
  }));
}

/* ---------------- Users ---------------- */
function renderUsers() {
  const items = db.users.list();
  document.getElementById("usersTable").innerHTML = `
    <table class="admin-table"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th></th></tr></thead>
    <tbody>${items.length ? items.map((u) => `
      <tr><td>${u.name}</td><td>${u.email}</td><td><span class="badge badge-${u.role}">${u.role}</span></td><td>${u.joined||"—"}</td>
      <td class="row-actions"><button class="icon-btn" data-edit="${u.id}">✎</button><button class="icon-btn danger" data-delete="${u.id}">🗑</button></td></tr>`).join("")
      : emptyRow(5, "No users yet.")}</tbody></table>`;
  document.querySelectorAll("#usersTable [data-edit]").forEach((btn) => btn.addEventListener("click", () => {
    const item = db.users.get(btn.dataset.edit);
    openModal("Edit user", CONFIG.users.fields, item, (data) => { db.users.update(item.id, data); renderUsers(); renderStats(); });
  }));
  document.querySelectorAll("#usersTable [data-delete]").forEach((btn) => btn.addEventListener("click", () => {
    if (confirm("Delete this user?")) { db.users.remove(btn.dataset.delete); renderUsers(); renderStats(); }
  }));
}
document.getElementById("addUserBtn").addEventListener("click", () => {
  openModal("New user", CONFIG.users.fields, { role: "member", joined: new Date().toISOString().slice(0, 10) }, (data) => { db.users.create(data); renderUsers(); renderStats(); });
});

/* ---------------- Master render ---------------- */
function renderAll() {
  renderStats();
  renderOverviewTables();
  renderDoctors();
  renderEquipment();
  renderPosts();
  renderPlans();
  renderTestimonials();
  renderAppointments();
  renderMessages();
  renderUsers();
}
renderAll();
