# Midnight Cyber Café — Cabin 04 (2004 Digital Preservation)

An authentic, tactile, late-night American cyber café / LAN center terminal reconstruction set in late 2004.

---

## 🌟 Key Features

### 1. Edge-to-Edge CRT Display Architecture
- **True Viewport Immersion**: The entire viewport functions as a high-fidelity CRT monitor surface with authentic glass curvature, phosphor bloom, aperture grille scanlines, and subtle vignette.
- **Hardware Degaussing**: Magnetic demagnetization effect with authentic coil hum & phosphor deformation (Press **`D`** or click **DEGAUSS** in the system tray).
- **Relay Power & BIOS Sequence**: Interactive `NO SIGNAL` prompt → high-voltage tube warm-up → Award Modular BIOS Energy Star POST → Windows XP Luna boot bar → Welcome chime.

### 2. Windows XP Taskbar Digital Clock & Tray
- **Minute-Synchronized Local Time**: Shows current local time in authentic 2004 Windows XP format (`h:mm AM/PM`), accurately updated every minute.
- **Date Tooltip & Properties Dialog**: Full hover tooltip with the complete date string, plus a clickable *Date and Time Properties* dialog featuring current system time, timezone information, and calendar synchronization.

### 3. Classical Desktop Sticky Notes & Sticky Notes Studio
- **Desktop Sticky Notes**: Classical post-it notes pinned directly to the CRT monitor surface with authentic paper textures, adhesive header strips, push pins, and handwritten typography.
- **Full Drag-and-Drop & Session Persistence**: Click and drag sticky notes anywhere across the desktop. Coordinates, content edits, and custom colors persist seamlessly.
- **Sticky Notes Studio (`Sticky_Notes_Editor.exe`)**:
  - Dedicated note authoring utility with multiple paper colors (*Classic Yellow*, *Pastel Pink*, *Matrix Cyan*, *Terminal Green*, *Retro Amber*).
  - Typography options: Marker Pen, Tahoma, Terminal Monospace, Comic.
  - One-click *Pin to Desktop* and file management located in `My Documents`.

### 4. Authentic 2004 Period Software Suite
- **Notepad with 2004 HP LaserJet Print Preview**:
  - Full-featured text editor with document statistics.
  - **Print Button & Dialog**: Opens the *HP LaserJet 1200 Series PCL 6* dialog with authentic 8.5" x 11" Letter page preview, paper quality options (FastRes 1200 / 600 dpi), document headers/footers, and procedural mechanical stepper motor & paper feed acoustics (`playLaserPrinter()`).
- **My Computer & File Explorer with HTML5 Drag-and-Drop**:
  - Standard HTML5 Drag-and-Drop API implementation allowing users to drag files into subfolders or sidebar destinations (*My Documents*, *My Pictures*, *Downloads*, *Games*, *Local Disk (C:)*).
  - Authentic 2004 drop target visual indicators, breadcrumb navigation, and HDD seek sound effects.
- **Minesweeper with Persistent Top 5 Leaderboard**:
  - Classic 9x9 minefield with 3-digit red LED mine counter, timer, and smiley face button.
  - **LocalStorage Persistence**: Win times persist across sessions.
  - **Top 5 Hall of Fame**: Automatically prompts winners to enter their handle when achieving a top time and displays the retro Windows XP leaderboard dialog.
- **Winamp 2.91 with YouTube Playlist Integration**:
  - Iconic dark skin with scrolling green LCD marquee, animated 8-band spectrum analyzer, equalizer sliders, and playlist drawer.
  - Dynamic stream integration for cyber café soundtrack.
- **AOL Instant Messenger (AIM)**:
  - Active buddy list (*xXSarahXx*, *HaloMaster*, *sk8rboi2004*, *CyberSamurai*).
  - Real-time chat with simulated typing indicators, banter, and **BUZZ** feature (Press **`B`**).
- **Internet Explorer 6.0 (Live & Vintage Browsing Engine)**:
  - **Live Web Browsing**: Type any real web address (e.g. `en.wikipedia.org`, `wiby.me`, `news.ycombinator.com`) to browse live websites directly inside the authentic 2004 IE6 chrome via stripped proxy streaming.
  - **Live Web Search in Google (2004)**: Real-time search index integration querying live encyclopedic and retro web results with clickable links and sub-second response times.
  - **Full 2004 Period Archive Portals**: MySpace (with profile music player & Top 8), GeoCities Cyber Den, Newgrounds Flash Portal, Neopets, MSN Hotmail webmail, MapQuest driving directions, and eBay.
  - **Complete Browser Navigation**: Green Luna Back/Forward buttons, address bar auto-sync, link interception, F5 Refresh, Esc Stop, Home, Favorites, and spinning Windows globe throbber.
- **LimeWire PRO 4.10**:
  - Gnutella P2P network search and transfers running at realistic dial-up/DSL speeds with 99% download stalls.
- **LAN Gaming & Utilities**:
  - Counter-Strike 1.6 LAN Reflex Trainer.
  - MS Paint with drawing canvas and classic palette.

---

## ⌨️ Global Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| **`Double Click (Empty Desktop)`** | Toggle browser fullscreen mode (`document.documentElement.requestFullscreen()`) |
| **`Space`** | Toggle Play / Pause YouTube & Winamp in sync (when not typing) |
| **`Enter`** / **`Space`** | Power on CRT terminal / Boot terminal (on boot screen) |
| **`Esc`** / **`Alt + F4`** | Close active window |
| **`D`** | Trigger CRT Hardware Degauss (Demagnetize tube) |
| **`B`** | Send AIM Buddy Buzz (Screen shake + sound) |
| **`IDDQD`** | Secret LAN Easter Egg |

---

## 🛠️ Technology Stack
- **Framework**: React 18+ with TypeScript & Vite
- **Styling**: Tailwind CSS & custom retro Windows XP Luna styles
- **Audio Synthesis**: Pure Web Audio API procedural synthesis (CRT flyback, Windows sounds, AIM chimes, HP LaserJet mechanical print sound, HDD seeks, rain room tone)
- **Vector Icons**: Lucide React
