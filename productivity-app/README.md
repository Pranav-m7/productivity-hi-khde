# Productivity App

A comprehensive desktop productivity application with guaranteed persistent data storage and state management. Built with Electron, React, and TailwindCSS.

## Features

### 📋 Job Application Tracker
- Excel-like editable spreadsheet interface
- Real-time Sankey diagram showing application pipeline
- Status tracking: Applied, Phone Screen, Technical Interview, Offer, etc.
- Statistics cards: Total Applied, Response Rate, Interview Rate, Offer Rate
- Advanced filters and sorting
- Inline cell editing with immediate save

### 📅 Calendar Planner (Year 2026)
- Hour-by-hour calendar for entire year
- Four view modes: Year, Month, Week, Day
- Sticky note visual style for events
- Color-coded categories: Work, Study, Exercise, Personal, Social, Sleep, Break
- Statistics dashboard with charts
- Drag-and-drop scheduling

### 📄 Resume Builder
- Split-screen editor with live preview
- 5 professional templates: Modern, Classic, Technical, Creative, Minimal
- Sections: Personal Info, Summary, Experience, Education, Skills, Projects
- Auto-save on every edit (300ms debounce)
- Multiple resume versions

## Data Persistence

All data is automatically saved with triple-redundant storage:

1. **Primary**: JSON files in application data directory
2. **Backup**: Automatic backups every 5 minutes
3. **Recovery**: Last 10 versions of each file kept

### Data Locations
- **Windows**: `%APPDATA%/ProductivityApp/data/`
- **macOS**: `~/Library/Application Support/ProductivityApp/data/`
- **Linux**: `~/.config/ProductivityApp/data/`

## Installation

```bash
# Clone or extract the project
cd productivity-app

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build
```

## Build Commands

```bash
# Build for Windows
npm run build:win

# Build for macOS
npm run build:mac

# Build for Linux
npm run build:linux
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + 1` | Open Job Tracker |
| `Ctrl + 2` | Open Calendar |
| `Ctrl + 3` | Open Resume Builder |

## Technology Stack

- **Electron** - Cross-platform desktop app
- **React 18** - UI framework
- **Zustand** - State management
- **TailwindCSS** - Styling
- **Recharts** - Charts and visualizations
- **electron-store** - Persistent settings
- **lowdb** - JSON database

## Project Structure

```
productivity-app/
├── src/
│   ├── main/           # Electron main process
│   │   ├── main.js
│   │   ├── preload.js
│   │   ├── data-manager.js
│   │   └── backup-manager.js
│   └── renderer/       # React app
│       ├── components/
│       │   ├── JobTracker/
│       │   ├── Calendar/
│       │   ├── Resume/
│       │   └── Common/
│       ├── store/
│       ├── styles/
│       ├── App.jsx
│       └── index.jsx
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## Auto-Save System

- Saves on EVERY change (300ms debounce)
- Visual "Saved ✓" indicator
- Queue system for rapid changes
- Atomic file writes (write to temp, then rename)
- Checksum verification

## State Restoration

On app startup:
1. Restores window position and size
2. Opens last used module
3. Restores scroll positions and filters
4. Loads all data from JSON files

## Troubleshooting

### Data not persisting?
1. Check write permissions to data directory
2. Look for error logs in `[data_dir]/logs/errors.log`
3. Try restoring from backup in `[data_dir]/[module]/backups/`

### App won't start?
1. Delete `node_modules` and run `npm install` again
2. Check for port conflicts (dev mode uses port 5173)
3. Ensure Node.js 18+ is installed

## License

MIT
