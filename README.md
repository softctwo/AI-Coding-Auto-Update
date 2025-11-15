# AI Coding Tools Manager (ACTM)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Linux%20%7C%20Windows-blue)](https://github.com/softctwo/AI-Coding-Auto-Update)
[![Electron](https://img.shields.io/badge/Electron-28.0-9feaf9?logo=electron)](https://www.electronjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript)](https://www.typescriptlang.org/)

# AI Coding Tools Manager (ACTM)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Linux%20%7C%20Windows-blue)](https://github.com/softctwo/AI-Coding-Auto-Update)
[![Electron](https://img.shields.io/badge/Electron-28.0-9feaf9?logo=electron)](https://www.electronjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript)](https://www.typescriptlang.org/)

AI Coding 自动检测最新版本，一键更新

A cross-platform desktop application to automatically detect, manage, and update AI coding tools.

## 🌟 主要功能

### ✨ 新功能：复制安装命令
- **智能命令生成**：根据工具状态和安装方式自动生成安装命令
- **一键复制**：点击按钮即可复制安装命令到剪贴板
- **多种安装方式**：支持 npm、pip、brew 等常见安装方式
- **复制反馈**：复制成功后显示视觉反馈，提升用户体验

### 🔧 核心功能
- **自动检测**：扫描系统中已安装的 AI 编程工具
- **版本检查**：比较已安装版本与最新发布版本
- **一键更新**：单击即可更新工具
- **批量操作**：同时更新多个工具
- **跨平台支持**：支持 macOS、Linux 和 Windows

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

## 📖 使用说明

### ✨ 新功能：复制安装命令
**对于未安装的工具：**
1. 找到需要安装的工具，查看"Install Command"列
2. 点击"📋 Copy Command"按钮复制安装命令
3. 在终端中粘贴并执行命令进行手动安装

**对于需要更新的工具：**
1. 找到标记为"Outdated"的工具
2. 点击"📋 Copy Command"按钮复制更新命令
3. 在终端中执行命令进行手动更新

### 🔧 基础使用

**首次启动：**
1. 打开 AI Coding Tools Manager
2. 点击 **"Scan Tools"** 扫描系统中已安装的 AI 编程工具
3. 应用将显示所有检测到的工具及其当前版本

**检查更新：**
1. 扫描完成后，点击 **"Check Updates"** 获取最新版本
2. 有可用更新的工具将标记为"Outdated"
3. 在列表中查看可用的更新

**更新工具：**

**单个工具更新：**
- 点击任何过时工具旁边的 **"Update"** 按钮

**批量更新：**
- 使用复选框选择多个工具
- 点击 **"Update Selected"** 一次性更新所有选中的工具

### ⚙️ 配置

访问设置以：
- 配置 GitHub API 令牌以获得更高的速率限制
- 设置启动时自动扫描
- 配置更新通知
- 自定义工具检测路径

## 📊 功能对比

| 功能 | 自动安装 | 复制命令手动安装 |
|------|----------|------------------|
| 便利性 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 可控性 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 调试友好 | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| 失败恢复 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 学习价值 | ⭐⭐ | ⭐⭐⭐⭐⭐ |

**推荐使用场景：**
- **自动安装**：适合熟悉工具且网络稳定的用户
- **复制命令**：适合想要学习安装过程、调试问题或网络不稳定的用户

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

## ❓ 常见问题

### 💾 复制安装命令功能如何使用？

**对于新用户：**
1. 在工具列表中找到"Install Command"列
2. 点击"📋 Copy Command"按钮
3. 命令会自动复制到剪贴板
4. 打开终端，粘贴并执行命令

**复制成功后：**
- 按钮会显示"✅ Copied!"状态
- 2秒后自动恢复原状
- 如果复制失败，会有错误提示

### 🔍 ACTM 如何检测已安装的工具？

ACTM 扫描各平台的常见安装目录和系统路径：
- **macOS**: `/Applications`, `~/Applications`, `/usr/local/bin`
- **Linux**: `/usr/bin`, `/usr/local/bin`, `~/.local/bin`, `~/bin`
- **Windows**: `C:\Program Files`, `C:\Program Files (x86)`, `%LOCALAPPDATA%`

### 🚀 如何选择安装方式？

**推荐选择：**
- **网络稳定用户**: 使用自动"Install"/"Update"按钮
- **网络不稳定用户**: 使用"📋 Copy Command"复制命令手动安装
- **学习目的**: 使用复制命令了解安装过程
- **调试问题**: 使用复制命令便于排查安装错误

### 🔧 支持哪些 AI 编程工具？

目前支持的工具包括：
- Cursor
- Continue
- Cline
- Windsurf
- Aider
- 更多工具（详见 [tool-definitions.ts](src/shared/tool-definitions.ts)）

### 🔑 是否需要 GitHub 令牌？

GitHub 令牌是可选的，但推荐使用：
- **无令牌**: 每小时限制 60 次 API 请求
- **有令牌**: 每小时限制 5,000 次 API 请求

添加令牌方法：
1. 前往 GitHub 设置 > 开发者设置 > 个人访问令牌
2. 生成新令牌（公共仓库无需特殊权限）
3. 在 ACTM 设置中添加令牌

### 🔄 更新是如何执行的？

ACTM 使用各工具的原生包管理器和安装方法：
- **npm/yarn**: 用于基于 Node.js 的工具
- **pip**: 用于基于 Python 的工具
- **Homebrew**: 用于 macOS 工具
- **直接下载**: 用于有安装程序的工具

### 🔒 我的数据安全吗？

是的！ACTM：
- 仅读取工具版本信息
- 在本地机器上存储首选项
- 不收集或传输个人数据
- 所有更新操作都使用官方工具仓库

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

## 🎯 项目总结

AI Coding Tools Manager (ACTM) 是专为开发者设计的 AI 编程工具管理器，通过智能检测、版本比较和便捷的更新机制，帮助用户保持开发环境的最新状态。

**核心价值：**
- 🚀 节省手动检查和更新时间
- 🔧 提供灵活的安装方式选择
- 📊 一目了然的工具状态管理
- 🔒 安全可靠的更新机制

**最新亮点：**
✨ **复制安装命令功能** - 解决用户反馈的安装问题，提供更灵活的手动安装选择

Made with ❤️ by the AI Coding Tools Manager Team

---

**中文支持** | **跨平台** | **开源免费** | **持续更新**
