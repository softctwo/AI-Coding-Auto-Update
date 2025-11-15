# AI Coding Tools Manager (ACTM)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Linux%20%7C%20Windows-blue)](https://github.com/softctwo/AI-Coding-Auto-Update)
[![Electron](https://img.shields.io/badge/Electron-28.0-9feaf9?logo=electron)](https://www.electronjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript)](https://www.typescriptlang.org/)

AI Coding 自动检测最新版本，一键更新

A cross-platform desktop application to automatically detect, manage, and update AI coding tools.

## Features

- **Automatic Detection**: Scans your system for installed AI coding tools
- **Version Checking**: Compares installed versions with latest releases
- **One-Click Updates**: Update tools with a single click
- **Batch Operations**: Update multiple tools at once
- **Cross-Platform**: Available for macOS, Linux, and Windows
- **Modern UI**: Clean and intuitive interface built with Electron and React

## Supported Platforms

### Desktop Applications

ACTM is available as a native desktop application for:

- **macOS**
  - Intel (x64)
  - Apple Silicon (arm64)
  - Format: DMG installer, ZIP archive

- **Linux**
  - x64 and arm64 architectures
  - Format: AppImage, .deb, .rpm, .tar.gz

- **Windows**
  - x64 and ia32 (32-bit)
  - Format: NSIS installer, Portable executable, ZIP archive

### Why Multiple Formats?

- **DMG (macOS)**: Standard macOS installer with drag-and-drop installation
- **AppImage (Linux)**: Universal format that runs on most Linux distributions without installation
- **.deb (Linux)**: For Debian-based systems (Ubuntu, Mint, etc.) with system integration
- **.rpm (Linux)**: For Red Hat-based systems (Fedora, RHEL, CentOS)
- **NSIS (Windows)**: Full-featured installer with Start Menu shortcuts and uninstaller
- **Portable (Windows)**: Single executable, no installation required, perfect for USB drives
- **ZIP archives**: For manual installation or custom setups

## Quick Start

1. **Download** the application for your platform from [Releases](https://github.com/softctwo/AI-Coding-Auto-Update/releases)
2. **Install** following the platform-specific instructions below
3. **Launch** the application
4. **Scan** for installed AI coding tools
5. **Update** outdated tools with one click

## Download

Download the latest release for your platform from the [Releases](https://github.com/softctwo/AI-Coding-Auto-Update/releases) page.

### Installation

#### macOS

1. Download the `.dmg` file
2. Open the DMG and drag ACTM to Applications
3. Open from Applications folder

#### Linux

**AppImage (Recommended - Universal)**
```bash
chmod +x AI-Coding-Tools-Manager-*.AppImage
./AI-Coding-Tools-Manager-*.AppImage
```

**Debian/Ubuntu (.deb)**
```bash
sudo dpkg -i AI-Coding-Tools-Manager-*.deb
```

**Fedora/RHEL (.rpm)**
```bash
sudo rpm -i AI-Coding-Tools-Manager-*.rpm
```

#### Windows

1. Download the `.exe` installer
2. Run the installer and follow the prompts
3. Or use the portable version (no installation required)

## Usage

### First Launch

1. Open AI Coding Tools Manager
2. Click **"Scan Tools"** to detect installed AI coding tools on your system
3. The application will display all detected tools with their current versions

### Checking for Updates

1. After scanning, click **"Check Updates"** to fetch the latest versions
2. Tools with available updates will be marked as "Outdated"
3. Review the available updates in the list

### Updating Tools

**Single Tool Update:**
- Click the **"Update"** button next to any outdated tool

**Batch Update:**
- Select multiple tools using checkboxes
- Click **"Update Selected"** to update all at once

### Configuration

Access settings to:
- Configure GitHub API token for higher rate limits
- Set auto-scan on startup
- Configure update notifications
- Customize tool detection paths

## Development

### Prerequisites

- Node.js 20 or higher
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/softctwo/AI-Coding-Auto-Update.git
cd AI-Coding-Auto-Update

# Install dependencies
npm install

# Run in development mode
npm run dev
```

### Building from Source

See [BUILD.md](BUILD.md) for detailed build instructions.

Quick build for your current platform:

```bash
# Build the application
npm run build

# Package for current platform
npm run package
```

Build for specific platforms:

```bash
npm run package:mac      # macOS (DMG, ZIP)
npm run package:linux    # Linux (AppImage, DEB, RPM, TAR.GZ)
npm run package:win      # Windows (NSIS, Portable, ZIP)
npm run package:all      # All platforms
```

## Project Structure

```
AI-Coding-Auto-Update/
├── .github/
│   └── workflows/          # GitHub Actions CI/CD
├── build/                  # Build assets (icons, etc.)
├── resources/              # Runtime resources
├── src/
│   ├── main/              # Electron main process
│   │   ├── services/      # Core services
│   │   ├── index.ts       # Main entry point
│   │   └── preload.ts     # Preload script
│   ├── renderer/          # Electron renderer process
│   │   └── index.html     # UI entry point
│   └── shared/            # Shared types and utilities
├── dist/                  # Compiled output
├── release/               # Built installers
├── package.json           # Project configuration
└── BUILD.md              # Detailed build guide
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build TypeScript and webpack bundles
- `npm run package` - Package app for current platform
- `npm run package:all` - Package for all platforms
- `npm test` - Run tests
- `npm run lint` - Lint code

## Technology Stack

### Core Technologies

- **Electron 28.0** - Cross-platform desktop framework
- **TypeScript 5.3** - Type-safe JavaScript for robust development
- **React 18.2** - Modern UI framework with hooks
- **Node.js 20+** - JavaScript runtime

### Build & Development

- **Webpack 5** - Module bundler with hot reload
- **electron-builder 24.9** - Multi-platform packaging
- **GitHub Actions** - Automated CI/CD pipeline
- **Jest** - Testing framework
- **ESLint** - Code linting and quality

### Key Dependencies

- **@octokit/rest** - GitHub API integration for version checking
- **better-sqlite3** - Local database for caching
- **electron-store** - Persistent configuration storage
- **semver** - Semantic versioning comparison

## Supported AI Coding Tools

ACTM currently supports detection and updates for:

| Tool | Type | Install Method | Platforms |
|------|------|----------------|-----------|
| Cursor | IDE | Direct Download | macOS, Linux, Windows |
| Continue | VSCode Extension | npm/VSCode | All |
| Cline | CLI Tool | npm | All |
| Windsurf | IDE | Direct Download | macOS, Linux, Windows |
| Aider | CLI Tool | pip/pipx | All |

Want to add a new tool? Check out our [Contributing Guide](CONTRIBUTING.md) to learn how to add tool definitions.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## FAQ

### How does ACTM detect installed tools?

ACTM scans common installation directories and system paths for each platform:
- **macOS**: `/Applications`, `~/Applications`, `/usr/local/bin`
- **Linux**: `/usr/bin`, `/usr/local/bin`, `~/.local/bin`, `~/bin`
- **Windows**: `C:\Program Files`, `C:\Program Files (x86)`, `%LOCALAPPDATA%`

### Which AI coding tools are supported?

Currently supported tools include:
- Cursor
- Continue
- Cline
- Windsurf
- Aider
- And more (see full list in [tool-definitions.ts](src/shared/tool-definitions.ts))

New tools can be added by contributing to the tool definitions.

### Do I need a GitHub token?

A GitHub token is optional but recommended. Without it, you're limited to 60 API requests per hour. With a token, you get 5,000 requests per hour.

To add a token:
1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Generate a new token (no special permissions needed for public repositories)
3. Add it in ACTM Settings

### How are updates performed?

ACTM uses the native package managers and installation methods for each tool:
- **npm/yarn**: For Node.js-based tools
- **pip**: For Python-based tools
- **Homebrew**: For macOS tools
- **Direct downloads**: For tools with installers

### Is my data safe?

Yes! ACTM:
- Only reads tool version information
- Stores preferences locally on your machine
- Does not collect or transmit personal data
- All update operations use official tool repositories

### Can I build for specific platforms only?

Yes! Use these commands:
```bash
npm run package:mac      # macOS only
npm run package:linux    # Linux only
npm run package:win      # Windows only
```

### The app won't open on macOS - "App is damaged"

This happens because the app isn't code-signed. To fix:
```bash
xattr -cr "/Applications/AI Coding Tools Manager.app"
```

Or right-click the app, select "Open", and confirm.

## Support

For issues and questions:
- GitHub Issues: [Report a bug](https://github.com/softctwo/AI-Coding-Auto-Update/issues)
- Discussions: [Ask questions](https://github.com/softctwo/AI-Coding-Auto-Update/discussions)

## Roadmap

- [ ] Auto-update functionality for ACTM itself
- [ ] Custom tool definitions
- [ ] Backup and restore tool configurations
- [ ] Plugin system for extending functionality
- [ ] Multiple language support

---

Made with ❤️ by the AI Coding Tools Manager Team
