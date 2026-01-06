# pavelkleisner.dev

Personal website and long-term home for my work — including future micro-SaaS projects.

🌍 **Live:** https://pavelkleisner.dev  
🧱 **Stack:** Astro + TypeScript + Tailwind CSS  
☁️ **Hosting:** Cloudflare Pages (global edge delivery)

---

## ✨ About

This repository contains the source code for my personal website. It’s designed to be:

- A clear presentation of who I am and what I do
- A place where I can share background, experience, and approach to engineering
- A foundation for a future **blog**
- A showcase for my own **micro-SaaS projects** (current and upcoming)

The site is intentionally built as a **static, fast, low-maintenance** website that’s easy to extend over time.

---

## 🧠 Philosophy

I prefer:

- Pragmatic architecture over over-engineering
- Clear code over clever code
- Strong fundamentals (data, performance, reliability)
- Systems that still make sense **in two years**
- Ownership of the full stack — from backend to UX concerns

This project is meant to reflect that mindset: simple, explicit, and maintainable.

---

## 🛠 Tech Stack

- **Astro** – static site generator
- **TypeScript**
- **Tailwind CSS**
- **Cloudflare Pages** – CI/CD + hosting
- **Cloudflare DNS & Email Routing** – domain + contact email routing

---

## 🌍 Localization (EN / CZ)

The website is bilingual:

- **English** (default)
- **Czech**

Language is resolved by URL structure:
/        → English
/cz      → Czech

---
## 📁 Project Structure

```text
src/
├─ components/     # Reusable UI components (Nav, LanguageSwitch, etc.)
├─ layouts/        # Base layout (head / meta / header / footer)
├─ pages/          # Routes (EN + CZ)
│  ├─ index.astro
│  ├─ about.astro
│  ├─ projects.astro
│  ├─ contact.astro
│  └─ cz/
│     ├─ index.astro
│     ├─ o-mne.astro
│     ├─ projekty.astro
│     └─ kontakt.astro
├─ i18n/           # Language dictionaries / route mappings
├─ styles/         # Global styles
public/
└─ assets/         # Static assets (icons, og-image, etc.)
```

The structure is kept flat and explicit to avoid hidden magic and to make future expansion
(blog, micro-SaaS pages) straightforward.
---

## 🏗 Build

### Generate a production build
```bash
npm run build
```
### Astro outputs a fully static site to
```text
dist/
```


## 🚀 Development

### Install dependencies
```bash
npm install
```
### Run locally
```bash
npm run dev
```
### Local dev server
```url
http://localhost:4321
```

## ☁️ Deployment

Deployment is handled automatically using **Cloudflare Pages**.

- Every push to the `main` branch triggers a new build
- The site is deployed globally via Cloudflare Edge Network
- HTTPS is enabled by default
- No server-side runtime is required

## 📬 Contact

If you’re looking for:

- an experienced backend-heavy full-stack developer
- a technical partner
- collaboration on a micro-SaaS idea

feel free to reach out:

📧 **contact@pavelkleisner.dev**

## 📄 License

This project is intended for **personal presentation purposes**.

You are welcome to draw inspiration from the structure and tooling,
but please do not copy the website content verbatim.
