# Build Guide for AI Coding Tools Manager

This guide explains how to build the AI Coding Tools Manager desktop application for different platforms.

## Prerequisites

- Node.js 20 or higher
- npm or yarn
- Platform-specific build tools (see below)

### macOS

```bash
# Install Xcode Command Line Tools
xcode-select --install
```

### Linux

```bash
# Ubuntu/Debian
sudo apt-get install build-essential libssl-dev

# Fedora/RHEL
sudo dnf install @development-tools

# For building AppImage
sudo apt-get install fuse libfuse2
```

### Windows

- Visual Studio Build Tools or Visual Studio with C++ development tools
- Python 3.x (for node-gyp)

## Installation

Install project dependencies:

```bash
npm install
```

## Development

Run the application in development mode:

```bash
npm run dev
```

This will start both the main process and the renderer process with hot-reload enabled.

## Building

### Build TypeScript

Compile TypeScript to JavaScript:

```bash
npm run build
```

This runs both:
- `npm run build:main` - Compiles main process
- `npm run build:renderer` - Bundles renderer process with webpack

### Package for Current Platform

Package the app for your current platform:

```bash
npm run package
```

### Package for Specific Platforms

#### macOS

Build for macOS (produces .dmg and .zip):

```bash
npm run package:mac
```

**Supported architectures:**
- x64 (Intel)
- arm64 (Apple Silicon)

**Output formats:**
- DMG installer
- ZIP archive

#### Linux

Build for Linux (produces AppImage, .deb, .rpm, .tar.gz):

```bash
npm run package:linux
```

**Supported architectures:**
- x64
- arm64

**Output formats:**
- AppImage (universal)
- Debian package (.deb)
- RPM package (.rpm)
- Tarball (.tar.gz)

#### Windows

Build for Windows (produces NSIS installer, portable, and .zip):

```bash
npm run package:win
```

**Supported architectures:**
- x64
- ia32 (32-bit)

**Output formats:**
- NSIS installer (.exe)
- Portable executable
- ZIP archive

### Package for All Platforms

Build for all platforms at once:

```bash
npm run package:all
```

**Note:** This requires platform-specific build tools for each target platform.

### Package Directory Only (for testing)

Build unpacked directory (faster, useful for testing):

```bash
npm run package:dir
```

## Output

Built applications are placed in the `release/` directory with the following structure:

```
release/
├── AI Coding Tools Manager-1.0.0.dmg           # macOS DMG
├── AI Coding Tools Manager-1.0.0-mac.zip       # macOS ZIP
├── AI Coding Tools Manager-1.0.0.AppImage      # Linux AppImage
├── AI Coding Tools Manager-1.0.0.deb           # Linux Debian
├── AI Coding Tools Manager-1.0.0.rpm           # Linux RPM
├── AI Coding Tools Manager-1.0.0.tar.gz        # Linux Tarball
├── AI Coding Tools Manager-1.0.0-win-x64.exe   # Windows NSIS
└── AI Coding Tools Manager-1.0.0-portable.exe  # Windows Portable
```

## Icons and Assets

### Application Icons

Place your application icons in the `build/` directory:

- **build/icon.icns** - macOS icon (1024x1024)
- **build/icon.ico** - Windows icon (256x256)
- **build/icons/** - Linux icons directory (see build/README.md)

### Windows Installer Graphics (Optional)

- **build/installerHeader.bmp** - Header (150x57)
- **build/installerSidebar.bmp** - Sidebar (164x314)

### Generating Icons

You can generate icons from a single PNG using:

```bash
npm install -g electron-icon-builder
electron-icon-builder --input=./source-icon.png --output=./build
```

## Code Signing and Notarization

### macOS

For distributing outside the Mac App Store, you need to sign and notarize:

1. Set environment variables:
```bash
export CSC_LINK=/path/to/certificate.p12
export CSC_KEY_PASSWORD=your-password
export APPLE_ID=your-apple-id
export APPLE_APP_SPECIFIC_PASSWORD=your-app-password
export APPLE_TEAM_ID=your-team-id
```

2. Build:
```bash
npm run package:mac
```

### Windows

For code signing on Windows:

```bash
export CSC_LINK=/path/to/certificate.pfx
export CSC_KEY_PASSWORD=your-password
npm run package:win
```

## Publishing Releases

### Automated via GitHub Actions

Push a tag to trigger automated builds:

```bash
git tag v1.0.0
git push origin v1.0.0
```

This will:
1. Build for all platforms (macOS, Linux, Windows)
2. Create artifacts
3. Create a GitHub release with all installers

### Manual Release

```bash
# Build for all platforms
npm run package:all

# Artifacts will be in release/ directory
# Upload manually to GitHub Releases or your distribution platform
```

## Troubleshooting

### "Cannot find module" errors

```bash
rm -rf node_modules package-lock.json
npm install
```

### Build fails on macOS

Ensure Xcode Command Line Tools are installed:
```bash
xcode-select --install
```

### Build fails on Linux

Install required dependencies:
```bash
# Ubuntu/Debian
sudo apt-get install build-essential libssl-dev fuse libfuse2

# Fedora
sudo dnf install @development-tools fuse fuse-libs
```

### Build fails on Windows

Ensure you have:
- Visual Studio Build Tools or Visual Studio with C++ tools
- Python 3.x installed and in PATH

### AppImage doesn't run on Linux

Make it executable:
```bash
chmod +x "AI Coding Tools Manager-1.0.0.AppImage"
./AI\ Coding\ Tools\ Manager-1.0.0.AppImage
```

## Platform-Specific Notes

### macOS

- **Apple Silicon (M1/M2):** The app is built as a universal binary supporting both Intel and ARM64
- **Gatekeeper:** For distribution, you need to notarize the app
- **DMG:** Customizable with background image and window positioning

### Linux

- **AppImage:** Works on most Linux distributions without installation
- **.deb:** For Debian, Ubuntu, and derivatives
- **.rpm:** For Fedora, RHEL, CentOS, and derivatives
- **Permissions:** Ensure execute permissions for AppImage files

### Windows

- **NSIS Installer:** Full-featured installer with options
- **Portable:** Single executable, no installation required
- **32-bit support:** ia32 builds available for older systems

## CI/CD Integration

The project includes a GitHub Actions workflow (`.github/workflows/build.yml`) that automatically builds for all platforms on:

- Tag pushes (e.g., `v1.0.0`)
- Manual workflow dispatch

## Advanced Configuration

Edit `package.json` under the `build` section for advanced electron-builder configuration:

```json
{
  "build": {
    "appId": "com.actm.app",
    "productName": "AI Coding Tools Manager",
    ...
  }
}
```

See [electron-builder documentation](https://www.electron.build/) for all available options.

## Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [electron-builder Documentation](https://www.electron.build/)
- [Code Signing Guide](https://www.electron.build/code-signing)
- [Publishing and Auto-Updates](https://www.electron.build/configuration/publish)
