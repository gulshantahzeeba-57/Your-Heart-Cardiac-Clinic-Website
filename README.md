# Your Heart — Cardiac Clinic Website

A responsive, multi-page website and admin dashboard for **Your Heart**, a cardiac clinic led by Dr. Robert Grayson. Built with plain **HTML, CSS and JavaScript** — no frameworks, no build step, no server required.


---

## About

Your Heart showcases the clinic's doctors, diagnostic and surgical equipment, services, pricing packages and patient testimonials, and lets visitors book a consultation or send a message. A companion **admin dashboard** lets clinic staff manage every piece of that content — doctors, equipment, blog posts, pricing plans, testimonials, appointments and messages — directly from the browser.

## Features

- 🏠 16 fully responsive public pages: Home, About, Doctors, Equipment, Services, Pricing, Testimonials, Book Appointment, Blog (+ single post), Contact, Sign in / Sign up, Privacy, Terms, 404
- 🩺 Doctor profiles (Dr. Robert Grayson + team) and an equipment showcase (bypass machine, angiography machine, ECG, ventilator, and more)
- 📅 Working appointment and contact forms
- 🔐 Simple sign in / sign up flow
- 🛠️ Full admin dashboard (`admin.html`) with create/edit/delete for every content type, plus appointment and message status tracking
- 💾 Data is stored in the browser via `localStorage`, so content you add in the admin panel shows up on the live pages immediately — no backend needed
- 📱 Mobile-friendly layout with a collapsible nav menu
- 🎨 Custom logo and a consistent white / cyan (`#1feff2`) design system

## Tech stack

- HTML5
- CSS3 (custom properties / design tokens, no framework)
- Vanilla JavaScript (no build tools, no dependencies)
- [Fraunces](https://fonts.google.com/specimen/Fraunces), [Sora](https://fonts.google.com/specimen/Sora) and [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) via Google Fonts

## Project structure

Every page ships its own HTML, CSS and JS file, kept in a single flat folder (no nested subfolders) so each page is easy to find and edit independently.

```
your-heart/
├── index.html / index.css / index.js               Homepage
├── about.html / about.css / about.js                About the clinic
├── doctors.html / doctors.css / doctors.js          Doctor profiles
├── equipment.html / equipment.css / equipment.js    Equipment showcase
├── features.html / features.css / features.js       Services
├── pricing.html / pricing.css / pricing.js          Pricing plans
├── testimonials.html / testimonials.css / .js       Patient testimonials
├── appointment.html / appointment.css / .js         Book a consultation
├── blog.html / blog.css / blog.js                   Blog listing
├── blog-post.html / blog-post.css / .js             Single blog post
├── contact.html / contact.css / contact.js          Contact form
├── sign-in.html / sign-in.css / sign-in.js           Patient sign in
├── sign-up.html / sign-up.css / sign-up.js           Patient sign up
├── privacy.html / privacy.css / privacy.js           Privacy policy
├── terms.html / terms.css / terms.js                 Terms of service
├── 404.html / notfound.css / notfound.js              Not-found page
├── admin.html / admin.css / admin.js                  Admin dashboard
├── common.css                                         Shared design tokens, header/footer, buttons, cards
├── data.js                                            Shared localStorage "database" layer
├── logo.svg                                           Clinic logo
└── README.md
```

`common.css` and `data.js` are the only two files shared across pages — one holds the design system so every page looks consistent, the other is the shared data layer so content stays in sync between the public site and the admin panel.

## Getting started

No installation or build step required.

1. Clone the repo:
   ```bash
   git clone https://github.com/<gulshantahzeeba-57>/your-heart.git
   cd your-heart
   ```
2. Open `index.html` directly in your browser, **or** serve it locally (recommended, avoids any file:// quirks):
   ```bash
   python3 -m http.server 8000
   # then visit http://localhost:8000
   ```

## Using the admin dashboard

Open `admin.html` in your browser. A demo admin session is created automatically on first visit — no login required for local/demo use. From there you can:

- Add, edit or delete doctors, equipment, blog posts, pricing plans and testimonials
- Review and update the status of appointments and contact messages
- Manage user accounts
- Reset all data back to the original demo content from the sidebar

All changes are saved to your browser's `localStorage`, so they'll persist on reload but are local to that browser only.

## Connecting a real backend (optional)

Every read/write in the site goes through `data.js`, using a small `db.<collection>.list() / get() / create() / update() / remove()` API. To move from `localStorage` to a real server and database, you only need to change the internals of those functions in `data.js` to call your API with `fetch()` — no other file needs to change.

## Customizing

- **Colors:** edit the CSS custom properties at the top of `common.css` (`--cyan`, `--dark`, etc.)
- **Content:** either edit the `SEED` data in `data.js` directly, or use the admin dashboard
- **Logo:** replace `logo.svg`, and the inline `<svg>` copies in each page's header/footer

## License

Released under the [MIT License](LICENSE) — free to use, modify and deploy for your own clinic or project.

## Disclaimer

This is a demo/template website. Content (doctor bios, pricing, equipment descriptions) is placeholder text and not real medical or business information.
