# Speechi — Frontend

**Speechi** turns conversations into clarity. Upload or **record** a meeting directly in your browser, choose an output language, and get a clean transcript, AI summary, decisions, and action items. Export to **Word (.docx)** or **PDF**. Built for founders, managers, and consultants.

## Features

- **Upload or Record** — Drag-and-drop files or record directly from your browser
- **8 Audio Formats** — MP3, WAV, M4A, AAC, OGG, FLAC, WebM, MP4
- **5 Languages** — English, עברית, Français, Español, العربية
- **Word & PDF Export** — Professional documents with localized headings
- **RTL Support** — Proper formatting for Hebrew and Arabic
- **Local-first** — History stored in localStorage, no account required
- **Premium UI** — GSAP animations, dark mode, responsive design
- **Environment-based config** — Production-ready with env vars

---

## Pages

- **Landing** (`/`): Marketing hero, trust signals, CTAs to product.
- **New Meeting** (`/app`): Upload/Record → Output language → Analyze → Export. Results in tabs: Summary, Clean Transcript, Original Transcript, Decisions & Actions.
- **History** (`/app/history`): Past meetings from localStorage. View (inline detail with same tabs) or delete.
- **Settings** (`/app/settings`): Default output language, theme (Light / Dark / System), privacy note, clear history.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │ Upload  │  │ Record  │  │ Analyze │  │ Export  │        │
│  │  Zone   │  │  Audio  │  │ Button  │  │ Word/PDF│        │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘        │
│       │            │            │            │              │
│       └────────────┴────────────┴────────────┘              │
│                         │                                    │
│                    File object                               │
│                         │                                    │
│                         ▼                                    │
│              ┌─────────────────────┐                        │
│              │   API Client        │                        │
│              │   (api.ts)          │                        │
│              │   VITE_API_BASE_URL │                        │
│              └──────────┬──────────┘                        │
└─────────────────────────┼───────────────────────────────────┘
                          │
                          ▼
              ┌─────────────────────┐
              │   Backend API       │
              │   (FastAPI)         │
              └─────────────────────┘
```

---

## Environment Variables

All API URLs are configured via environment variables (see `.env.example`):

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://127.0.0.1:8000/api` |
| `VITE_APP_ENV` | Environment (development/production) | `development` |

**Setup:**
```bash
# Copy example to create your local env
cp .env.example .env

# Edit .env for local development (defaults are fine)
# Edit .env.production for production builds
```

**Example `.env` for production:**
```bash
VITE_API_BASE_URL=https://speechi.adirg.dev/api
VITE_APP_ENV=production
```

---

## Run Locally

1. **Backend** at `http://127.0.0.1:8000`:
   ```bash
   cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload
   ```
2. **Frontend**:
   ```bash
   cd frontend
   cp .env.example .env  # Create local env file
   npm install
   npm run dev
   ```
3. Open **http://localhost:5173**

---

## Production Deployment

### URLs
- **Frontend:** https://speechi.adirg.dev (port 5175 or CDN)
- **Backend API:** https://speechi.adirg.dev/api (FastAPI on port 8000)

### Build & Deploy

```bash
# Create production environment file
echo "VITE_API_BASE_URL=https://speechi.adirg.dev/api" > .env.production
echo "VITE_APP_ENV=production" >> .env.production

# Build for production
npm run build

# Preview locally (optional)
npm run preview -- --port 5175

# Deploy dist/ folder to your server or CDN
```

### Serving Static Files

The `dist/` folder contains static files that can be served by:
- **Nginx** — Recommended for production
- **Caddy** — Simple HTTPS
- **Vercel/Netlify** — Zero-config hosting
- **S3 + CloudFront** — Scalable CDN

**Nginx example:**
```nginx
server {
    listen 443 ssl;
    server_name speechi.adirg.dev;

    root /var/www/speechi/frontend/dist;
    index index.html;

    # SPA routing - serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## Supported Audio Formats

| Format | Extension | Notes |
|--------|-----------|-------|
| MP3 | `.mp3` | Most common |
| WAV | `.wav` | Uncompressed |
| M4A | `.m4a` | Apple devices |
| AAC | `.aac` | Advanced codec |
| OGG | `.ogg` | Open source |
| FLAC | `.flac` | Lossless |
| WebM | `.webm` | Browser recordings |
| MP4 | `.mp4` | Video (audio track) |

---

## Browser Recording

Record meetings directly from your browser:

1. Click **Record meeting** toggle
2. Allow microphone access when prompted
3. Click the red button to start recording
4. Timer shows recording duration
5. Click stop when done
6. Preview, delete, or use the recording
7. Recording is treated identically to uploaded files

**Supported browsers:** Chrome, Firefox, Edge, Safari (with MediaRecorder API)

---

## Tech Stack

- **React 19** — Latest React with hooks
- **TypeScript 5.9** — Type-safe development
- **Vite** — Fast build tool
- **Tailwind CSS 4.1** — Utility-first styling
- **GSAP** — Smooth animations
- **react-icons** — Heroicons 2

No UI kits. `fetch` only. Minimal custom router (pathname + `pushState`).

---

## Supported Languages

### UI Languages
English, עברית, Français, Español, العربية

Stored in `speechi.uiLanguage`. RTL for Hebrew and Arabic.

### Output Languages
English, עברית, Français, Español, العربية

Affects:
- Summary and transcript language
- Document headings (Word & PDF)
- Text direction in exports

---

## LocalStorage Keys

| Key | Purpose |
|-----|---------|
| `speechi.uiLanguage` | UI language (en, he, fr, es, ar) |
| `speechi.outputLanguage` | Default output language for analysis/export |
| `speechi.theme` | Theme: `light`, `dark`, or `system` |
| `speechi.history` | Array of meeting items |
| `speechi_user` | Local user profile (name, email) |
| `speechi_usage` | Daily usage tracking |

History is kept locally only; no server storage.

---

## Example Flow

1. Open **http://localhost:5173** → Landing
2. Click **Start using Speechi** → `/app` (New Meeting)
3. **Choose input method:**
   - Drag-and-drop or select an audio file, OR
   - Click "Record meeting" and record directly
4. Choose **Output language** (e.g. English or עברית)
5. Click **Analyze Meeting** → wait for processing
6. Use tabs: **Summary**, **Clean Transcript**, **Original Transcript**, **Decisions & Actions**
7. **Export** → Word (.docx) or PDF
8. **History** → view or delete past meetings
9. **Settings** → change default output language, theme, or clear history

---

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── AudioRecorder.tsx    # Browser recording
│   │   │   ├── UploadZone.tsx       # File upload
│   │   │   ├── ExportDropdown.tsx   # Word/PDF export
│   │   │   ├── Navbar.tsx           # Navigation + auth
│   │   │   ├── AuthModal.tsx        # Login/Register
│   │   │   └── ...
│   │   ├── context/
│   │   │   ├── AuthContext.tsx      # Auth + usage state
│   │   │   └── LanguageContext.tsx  # i18n state
│   │   ├── hooks/
│   │   │   ├── useI18n.ts           # Translations
│   │   │   ├── useTheme.ts          # Dark mode
│   │   │   └── ...
│   │   ├── lib/
│   │   │   ├── api.ts               # API client (env-based URL)
│   │   │   ├── constants.ts         # Feature flags
│   │   │   ├── i18n.ts              # Translation strings
│   │   │   └── storage.ts           # localStorage helpers
│   │   └── pages/
│   │       ├── Landing.tsx
│   │       ├── NewMeeting.tsx
│   │       ├── HistoryPage.tsx
│   │       └── SettingsPage.tsx
│   ├── App.tsx
│   ├── vite-env.d.ts               # Env var types
│   └── main.tsx
├── .env.example                    # Environment template
├── package.json
└── vite.config.ts
```

---

## Scripts

- `npm run dev` — Dev server (port 5173)
- `npm run build` — Production build (uses `.env.production` if present)
- `npm run preview` — Preview production build locally
