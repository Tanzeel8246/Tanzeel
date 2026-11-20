# CodeHubb Tools (tanzeel.work)

A modern, high-performance web platform featuring **88+ client-side productivity, developer, media, and document utilities**, 4 specialized **AI assistants**, and a full-featured **Admin CMS Dashboard**.

Processed privately in the user's browser using client-side WebAssembly, Canvas, and Web Workers with zero server storage.

---

## 🌟 Key Features

### 1. 88+ High-Performance Online Tools
- **PDF Suite:** Merge PDF, Split PDF, Sign PDF, Organize Pages, Rotate PDF, Crop PDF, Watermark PDF, PDF to Images, PDF to Word, HTML to PDF, and more.
- **Image & Media Suite:** In-browser AI Background Removal, Image Compressor, Format Converters (WebP, PNG, JPG, ICO), SVG to PNG, AI Image Upscaler, Crop Image, Meme Generator, Screen Recorder.
- **Developer Utilities:** JSON Formatter, JWT Decoder, Base64 Encoder/Decoder, Hash Generator (MD5, SHA-256), Regex Tester, CSS Minifier, HTML Encoder, Slug Generator, UUID Generator.
- **Calculators & Math:** Percentage Calculator, Loan Calculator, BMI Calculator, Discount Calculator, Age Calculator.
- **Urdu & Islamic Utilities:** Urdu Text Processing, Khutbat-e-Jumu'ah sermons, Islamic date calculations.

### 2. Specialized AI Assistants
- **Tanzeel AI (Digital Twin):** Expert in App Development, Graphic Design, and Islamic Sciences.
- **Urdu Translator:** Fluent English &larr;&rarr; Urdu translation with contextual nuance.
- **Master Tutor:** Step-by-step academic and technical instructor.
- **Khutbat-e-Jumu'ah:** Structured Friday sermons with Arabic Quranic verses and Urdu commentary.
- **Resilient AI Pipeline:** Automatic round-robin key rotation across Groq (Qwen 3.8 / LLaMA) with seamless Google Gemini fallback.

### 3. Comprehensive Admin Dashboard & CMS
- **Tools Manager (`/admin/tools`):** Create new tools, edit slugs/categories, toggle live visibility, embed custom JS/HTML widgets, and assign card mockup preview images.
- **Legal & Content Editor (`/admin/pages`):** Live Markdown/HTML editor for Privacy Policy, Terms of Service, About Us, Contact Us, and Homepage copy.
- **Blog Engine (`/admin/blogs`):** Full CRUD article publisher with Markdown preview and SEO metadata to ensure Google AdSense compliance.
- **API & System Settings (`/admin/settings`):** Live in-memory rotation of Groq/Gemini API keys, Google OAuth Client ID/Secret, AdSense ID, and Admin Passcode without server restarts.

---

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Frontend:** React 19, Tailwind CSS v4, Lucide Icons, Framer Motion
- **AI Integration:** Vercel AI SDK v4 (`ai`), `@ai-sdk/openai` (Groq), `@ai-sdk/google` (Gemini)
- **Database & Auth:** Prisma ORM, SQLite, NextAuth.js (Credentials & Google OAuth)
- **Document & Media Processing:** `pdf-lib`, `pdfjs-dist`, `@imgly/background-removal`, `docx`, `html2pdf.js`
- **Hosting & Bridge:** Phusion Passenger, LiteSpeed Web Server, Standalone Node.js Bridge

---

## 💻 Local Development

```bash
# 1. Clone repository
git clone https://github.com/Tanzeel8246/Tanzeel.git
cd Tanzeel

# 2. Navigate to frontend
cd frontend

# 3. Install dependencies
npm install

# 4. Initialize database
npx prisma generate
npx prisma db push

# 5. Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📦 Deployment

The root script `prepare_deployment.js` compiles the standalone build, packages static assets, configures the LiteSpeed Passenger bridge, and generates the production deployment zip:

```bash
# Build & package production zip
cd frontend && npm run build && cd ..
node prepare_deployment.js
```

---

## 📄 License

Private & Proprietary &copy; 2026 CodeHubb Tools. All rights reserved.
