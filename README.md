this is a app tht i will use locally on my desktop to track what ive achieved so far in 2026 i will continue this app and keep on contributing till i get the internship/job my first actual job , i will on adding the cert and badges till i land one , " i have to make it "

from here on out make sure you actually aquire skills and actually make it to the big leagues 
the app remembers and auto saves the added changes


A dark-mode, offline-first, desktop productivity system with GUARANTEED data persistence.
Every keystroke is saved. Every state is remembered. Every session resumes exactly where you left off.

✨ What Makes This Different?

✔ Zero Data Loss — Ever
✔ Triple-Redundant Auto-Save System
✔ Exact State Restoration (scroll, zoom, filters, module, window position)
✔ Fully Offline Desktop App
✔ Modern, Minimal, Dark-Only UI
✔ Designed for Power Users & Long-Term Tracking

This is not a “note app”.
This is a personal productivity operating system.

🧩 Core Modules
🧾 1. Job Application Tracker

An Excel-like application tracker with real-time Sankey pipeline visualization.

Highlights

Inline spreadsheet editing (auto-saved)

Advanced filters, bulk actions, attachments

Interactive Sankey diagram (click flows to filter)

Statistics dashboard (response rate, offer rate, avg response time)

Timeline view for each application

📅 2. 2026 Calendar Planner (Hour-by-Hour)

A full-year, 24×365 calendar with sticky-note visuals, deep analytics, and color-coded productivity tracking.

🔥 NEW: Smart Hour Grouping

Select multiple hour blocks (e.g. 1 AM → 6 AM)

Group them into one activity

Auto-merge duration

Color updates instantly based on tags

One edit updates the entire group

Example:
“Studied from 1–6 AM” → Single block → Purple → Security Engg

🎨 Tag-Driven Color System
Tag	Category	Color
k8s	Kubernetes	🔵 Blue
security engg	Cybersecurity	🟣 Purple
cloud engg	Cloud	🟢 Lime
ctfs	CTF Practice	🔴 Light Red
wiz	Wiz / Cloud Security	🔴 Light Red

Tags auto-apply colors

Multiple tags → dominant color logic

Tag badges rendered consistently across UI

📊 GitHub-Style Activity Heatmap (Enhanced)

Each day shows activity intensity

Color reflects what you worked on, not just quantity

If a day has:

Mostly security engg → Purple square

Mostly k8s → Blue square

Hover to see:

Total hours

Tag breakdown

Productivity score

When you add/edit an activity →
The calendar cell animates & flashes green briefly ✅
(visual save confirmation + motivation loop)

📄 3. Resume Builder & Editor

A professional resume system with version control and live preview.

Highlights

Drag-and-drop sections

Multiple ATS-optimized templates

Resume versions (SE, Cloud, Internship, etc.)

PDF / DOCX / HTML export

Resume score analyzer (ATS, keywords, length)

Cached PDF previews for instant rendering

🧠 Persistence Architecture (CRITICAL)
🔐 Triple-Redundant Save System

Primary: Local JSON files

Secondary: IndexedDB backup

Tertiary: Timestamped backups (every 5 minutes)

⚡ Auto-Save Triggers

Every edit (300ms debounce)

Every click / drag / resize

Module switch

App close

Heartbeat save every 60s

You will never see a “Save” button.
Everything is always saved.

🗂 Data Storage Locations
OS	Path
Windows	%APPDATA%/ProductivityApp/data/
macOS	~/Library/Application Support/ProductivityApp/data/
Linux	~/.config/ProductivityApp/data/

Includes

/backups/ → last 10 versions

/logs/ → save/load/crash logs

/app-state/ → UI & window state

🔄 Crash Recovery (Bulletproof)

Write-Ahead Logging (WAL)

Atomic file writes

Checksum verification

Auto-restore from backup

Recovery wizard if corruption detected

User data is never deleted

🎨 UI & Design Language
Dark-Only Palette

Background: #0a0a0a

Cards: #1a1a1a

Accent Blue: #4a9eff

Purple: #7c3aed

Success Green: #10b981

Design Principles

Minimal, sleek, modern

Subtle depth (soft shadows)

60fps animations

Glassmorphism modals

No visual clutter

Icons

Custom line-based minimal icons

Monochrome by default

Accent color on hover/active

Consistent stroke width

⌨️ Keyboard Shortcuts
Shortcut	Action
Ctrl + 1	Job Tracker
Ctrl + 2	Calendar
Ctrl + 3	Resume Builder
Ctrl + S	Force save (optional)
Esc	Close modal
Ctrl + Z / Y	Undo / Redo
⚙️ Tech Stack

Electron (Desktop)

React 18+

Zustand / Redux

TailwindCSS

lowdb / better-sqlite3

electron-store

D3.js / Recharts

All offline. All local. No telemetry.

🚀 Setup & Build
npm install
npm run dev     # Development
npm run build   # Production build


📦 Output:

/dist/ProductivityApp-{platform}.exe

🧪 Testing Checklist

✔ Restart persistence
✔ Force-quit recovery
✔ Large datasets (1000+ entries)
✔ Full-year calendar (8760 hours)
✔ Backup restoration
✔ Offline mode
✔ Windows / macOS / Linux

🏁 Success Criteria (Guaranteed)

✅ Zero data loss
✅ Exact session restore
✅ Instant auto-save
✅ Beautiful dark UI
✅ Fully offline
✅ One-command deployment

💡 Philosophy

Your data is more important than features.
Your time is more important than animations.
Your focus is more important than complexity.

This app is designed to never betray your trust.
