
```markdown
# ZenJournal — Private Mental Wellness Journal

A minimalist journaling app focused on **emotional check-ins**, **guided reflection**, and **visual mood trends**. Built as a 3-week React group project following our mentor/school brief.

> MVP goals: Auth (JWT), Mood tracker, Journal CRUD, Responsive UI.  
> Stretch: Charts, Prompts, Streaks/Reminders, Export, (Optional) AI reflections.

---

## 👥 Team

- **Abdulrahman** — Team Lead & State Management  
- **Mohamed Daahir Hussein** — API Integration  
- **Abdifatah Omar** — UI/UX

---

## 🧰 Tech Stack

- **React** + **Vite**
- **Tailwind CSS v4**
- **React Router**
- **Axios**
- Auth via **JWT** (mentor-provided API)

---

## 🔗 API

- **Base URL**: `https://zenjournalbe.vercel.app`
- All endpoints (except register/login) require `Authorization: Bearer <JWT>`.

### Auth
- `POST /api/auth/register` — `{ name, email, password }`
- `POST /api/auth/login` — `{ email, password }` → returns `{ user, token }` and sets HTTP-only cookie
- `GET  /api/auth/user` — current user

### Journals
- `GET    /api/journals` — list your entries
- `POST   /api/journals` — `{ text, mood, tags: string[] }`
- `GET    /api/journals/:id`
- `PUT    /api/journals/:id` — update fields
- `DELETE /api/journals/:id`

### Moods
- `GET    /api/moods` — list mood logs
- `POST   /api/moods` — `{ mood, note }`
- `GET    /api/moods/:id`
- `DELETE /api/moods/:id`

### Insights
- `GET /api/insights/weekly` — { mostCommonMood, daysLogged, moodDistribution }

---

## ⚙️ Environment

Create `.env` in the project root:

```

VITE_API_URL=[https://zenjournalbe.vercel.app](https://zenjournalbe.vercel.app)

````

> **Do not commit `.env`**. Our `.gitignore` includes `.env` / `.env.*`.

---

## 🚦 Dev Proxy (CORS-free local dev)

We call **relative** paths in dev (e.g., `/api/auth/login`) and let Vite proxy to the real API.

**`vite.config.js`**
```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc"; // or "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://zenjournalbe.vercel.app",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
````

**`src/services/apiClient.js` (base URL logic)**

```js
// In dev: "" (relative) -> Vite proxy
// In prod: use VITE_API_URL
const PROD_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
export const API_BASE = import.meta.env.DEV ? "" : PROD_BASE;
```

---

## 🎨 Tailwind CSS v4 Setup Notes

* **`postcss.config.js`**

  ```js
  export default {
    plugins: {
      "@tailwindcss/postcss": {},
    },
  };
  ```
* **`src/index.css`**

  ```css
  @import "tailwindcss";
  ```

> v4 doesn’t require a `tailwind.config.js` for basics (you may add one for customizations).

---

## 📁 Project Structure

```
src/
  auth/
    AuthContext.jsx          # Auth provider (login/register/me, token, user)
  components/
    Navbar.jsx               # Shows user + Logout (when authed)
    ProtectedRoute.jsx       # Guards private routes
  pages/
    Login.jsx
    Register.jsx
    Dashboard.jsx
    EntryPage.jsx
  services/
    apiClient.js             # Axios instance + API helpers
  App.jsx
  main.jsx
  index.css
```

---

## ▶️ Run Locally

```bash
npm install
npm run dev
# open the printed URL (usually http://localhost:5173)
```

---

## ✅ Current Progress (MVP)

* [x] Vite scaffold + Tailwind v4
* [x] React Router (Login, Register, Dashboard, Entry)
* [x] Axios client + Vite proxy (CORS-free dev)
* [x] Auth context, Protected routes
* [x] Register + Login (client) → token + current user
* [ ] Journal CRUD (list/create/edit/delete)
* [ ] Mood tracker (log + show recent)
* [ ] Dashboard polish

### Stretch (later)

* [ ] Mood history chart (Recharts)
* [ ] Daily prompts
* [ ] Streaks & reminders
* [ ] Export (.pdf/.txt)
* [ ] AI reflections (optional)

---

## 🔀 Workflow

* Default branch: **`main`** (protected)
* Feature branches:

  * `feature/auth-flow`
  * `feature/journal-crud`
  * `feature/moods`
* Conventional commits (suggested):

  * `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `style:`

---

## 🧪 Scripts

* `npm run dev` — start dev server
* `npm run build` — production build
* `npm run preview` — preview built app

---

## 🚀 Deployment (Vercel/Netlify)

1. Set environment var `VITE_API_URL` to the production backend URL.
2. Build command: `npm run build`
3. Output dir: `dist`

---

## 📜 License

MIT — feel free to use and adapt for learning.

```

