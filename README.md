# 📌 TaskCanvas

**TaskCanvas** is a lightweight visual task board built with React, Tailwind-style CSS, and drag-and-drop support using `react-beautiful-dnd`. It allows users to visually organize tasks across "To Do", "In Progress", and "Completed" columns — mimicking real-world kanban flows.

This project was designed as a **fast, clean, and fully interactive prototype**, demonstrating real-time UI manipulation, API integration, and modern front-end practices.

---

## ✨ Features

- 🧩 **Drag and drop** task movement across columns (powered by `react-beautiful-dnd`)
- ➕ **Create new tasks** dynamically via input
- ❌ **Delete tasks** with a single click
- 🔄 **Status syncing** between UI and API
- 🧠 Clean, readable codebase using functional React components and hooks
- 🌐 Connected to a lightweight Express API (can be replaced by any backend)

---

## ⚙️ Tech Stack

- **Frontend:** React 18, Axios, CSS (with Tailwind-inspired styling)
- **Drag and Drop:** `react-beautiful-dnd`
- **Backend:** Node.js, Express (in-memory task store, ready for DB swap)
- **Build Tool:** Create React App (Vite-compatible)

---

## 🚀 Getting Started

### 1. Clone the frontend

```bash
git clone https://github.com/yourusername/taskcanvas.git
cd taskcanvas
npm install
npm start
```

### 2. Start the API

```bash
cd taskcanvas-api
npm install
npm start
```

The frontend runs at `http://localhost:3000` and connects to the API at `http://localhost:4000`.

---

## 📦 API Endpoints

- `GET /tasks` – fetch all tasks
- `POST /tasks` – create new task (`text`, `status`)
- `PATCH /tasks/:id` – update task status
- `DELETE /tasks/:id` – remove task

---

## 📁 Folder Structure

```
taskcanvas/
├── src/
│   ├── App.js
│   ├── App.css
│   └── index.js
├── public/
│   └── index.html
taskcanvas-api/
└── index.js
```

---

## 💬 About the Project

TaskCanvas was built as a **proof-of-concept for visual task manipulation**, ideal for teams seeking a simplified UI for planning, prototyping, or onboarding. Inspired by tools like Linear, Trello, and Tempo, it focuses on **clean code, real-time feedback, and rapid iteration**.
