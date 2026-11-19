# Зачёт (Zachyot) — Students helping students

A collaborative study platform built by students for students at **Saint Petersburg Mining University (Gorny)**. The goal is to help those struggling with course subjects by offering organized materials, corrected exercises, and video lessons — all with translations and glossaries in **Russian, English, Portuguese, and Spanish**.

> **Disclaimer:** This is an **independent** project and is **not officially affiliated** with the university. It was created on the students' own initiative.

## 🚀 Live Demo

Check out the live version here: **[https://luiz1745.github.io/zachyot/](https://luiz1745.github.io/zachyot/)**

## ✨ Features (Current & Planned)

- 🌍 **Multilingual interface**: EN, RU, PT, ES
- 📚 **Courses organized by subject** (Mathematics, Physics, Chemistry, etc.)
- 📖 **Lessons with EN | RU glossary** (and PT/ES translations)
- ✍️ **Corrected exercises** with step-by-step explanations
- 🎬 **Video lessons** (coming soon)
- 👤 **Student dashboard**: progress, XP, study streak, and ranking
- 🛠️ **Admin panel**: real-time user management and content upload (in development)
- 💳 **Subscription plans** (simulated in this version, with approximate RUB conversion)

## 🧰 Tech Stack

### Front-end
- **HTML5** & **CSS3** (Responsive design, Gorny-inspired palette)
- **Vanilla JavaScript** (No frameworks, no build tools)
- **Onest Font** (with Cyrillic support)

### Back-end / Database (BaaS)
- **[Supabase](https://supabase.com/)** for:
  - Authentication (Email/Password)
  - PostgreSQL Database (`profiles`, `courses`, `lessons`, `progress` tables)
  - Row Level Security (RLS) policies
  - Database Triggers (auto-create user profile on signup)

### Hosting & Deployment
- **GitHub Pages** (Static hosting)
- Automatic deployment via GitHub Actions (on push to `main`)

## 📁 Project Structure

```text
zachyot/
│
├── index.html                 # Main entry point
├── README.md                  # Project documentation
│
└── assets/
    ├── css/
    │   └── style.css          # Global styles and variables
    │
    └── js/
        ├── data.js            # Static content (subjects, sample courses, lessons)
        ├── i18n.js            # Translations dictionary (EN, RU, PT, ES)
        ├── store.js           # Supabase client, Auth logic, and state management
        ├── ui.js              # Reusable UI components (header, footer, cards)
        ├── pages.js           # Page templates (Home, Courses, Dashboard, Admin)
        └── app.js             # Router, event listeners, and app initialization
