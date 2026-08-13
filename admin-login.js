document.getElementById("adminLoginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("alUsername").value.trim().toLowerCase();
  const password = document.getElementById("alPassword").value;
  const errorBox = document.getElementById("adminLoginError");

  const admin = db.users.list().find((u) =>
    u.role === "admin" &&
    ((u.username && u.username.toLowerCase() === input) || u.email.toLowerCase() === input)
  );

  if (!admin) {
    errorBox.textContent = "No admin account found for that username or email.";
    errorBox.hidden = false;
    return;
  }
  if (admin.password !== password) {
    errorBox.textContent = "Incorrect password. Please try again.";
    errorBox.hidden = false;
    return;
  }

  errorBox.hidden = true;
  localStorage.setItem("yourheart_admin_session", JSON.stringify({ id: admin.id, name: admin.name, email: admin.email }));
  window.location.href = "admin.html";
});
