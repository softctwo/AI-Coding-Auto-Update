# AI Coding Tools Manager (ACTM)

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

- **Electron** - Cross-platform desktop framework
- **TypeScript** - Type-safe JavaScript
- **React** - UI framework
- **Webpack** - Module bundler
- **electron-builder** - Application packager

## Supported AI Coding Tools

ACTM currently supports detection and updates for:

- Cursor
- Continue
- Cline
- Windsurf
- And more...

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

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
