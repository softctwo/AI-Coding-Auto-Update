# AI Coding Tools Manager (ACTM) | AI 编程工具管理器

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Linux%20%7C%20Windows-blue)](https://github.com/softctwo/AI-Coding-Auto-Update)
[![Electron](https://img.shields.io/badge/Electron-28.0-9feaf9?logo=electron)](https://www.electronjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript)](https://www.typescriptlang.org/)

## 🌟 功能特点 | Features

### ✨ 新功能 | New Feature: **复制安装命令 | Copy Install Command**
- **智能命令生成 | Smart Command Generation**: 根据工具状态和安装方式自动生成安装命令
- **一键复制 | One-Click Copy**: 点击按钮即可复制安装命令到剪贴板
- **多种安装方式 | Multiple Install Methods**: 支持 npm、pip、brew 等常见安装方式
- **复制反馈 | Copy Feedback**: 复制成功后显示视觉反馈，提升用户体验

### 🔧 核心功能 | Core Features
- **自动检测 | Auto Detection**: 扫描系统中已安装的 AI 编程工具 | Scans your system for installed AI coding tools
- **版本检查 | Version Checking**: 比较已安装版本与最新发布版本 | Compares installed versions with latest releases
- **一键更新 | One-Click Update**: 单击即可更新工具 | Update tools with a single click
- **批量操作 | Batch Operations**: 同时更新多个工具 | Update multiple tools at once
- **跨平台支持 | Cross-Platform**: 支持 macOS、Linux 和 Windows | Available for macOS, Linux, and Windows

## 📖 快速开始 | Quick Start

### 安装 | Installation
1. **下载 | Download**: 从 [Releases](https://github.com/softctwo/AI-Coding-Auto-Update/releases) 页面获取适合您平台的版本
2. **安装 | Install**: 按照平台特定的安装说明进行安装
3. **启动 | Launch**: 打开应用程序
4. **扫描 | Scan**: 点击"Scan Tools"检测已安装的工具
5. **更新 | Update**: 一键更新过时的工具

### 使用复制安装命令功能 | Using Copy Install Command

**对于未安装的工具 | For uninstalled tools:**
1. 在工具列表中找到"Install Command"列
2. 点击"📋 Copy Command"按钮复制安装命令
3. 在终端中粘贴并执行命令进行手动安装

**对于需要更新的工具 | For tools needing updates:**
1. 找到标记为"Outdated"的工具
2. 点击"📋 Copy Command"按钮复制更新命令
3. 在终端中执行命令进行手动更新

## 🚀 安装方式选择指南 | Installation Method Guide

| 场景 | 推荐使用 |
|------|----------|
| 网络稳定，熟悉工具 | 自动"Install"/"Update"按钮 |
| 网络不稳定，需要调试 | 复制命令手动安装 |
| 学习安装过程 | 复制命令手动安装 |
| 需要排查安装问题 | 复制命令手动安装 |

## 💻 支持的平台 | Supported Platforms

- **macOS**: Intel (x64) 和 Apple Silicon (arm64) - DMG 安装程序
- **Linux**: x64 和 arm64 - AppImage、DEB、RPM 格式
- **Windows**: x64 和 ia32 - NSIS 安装程序、便携版本

## 🔧 开发 | Development

### 环境要求 | Prerequisites
- Node.js 20+
- npm 或 yarn

### 快速开始 | Quick Start
```bash
# 克隆仓库 | Clone repository
git clone https://github.com/softctwo/AI-Coding-Auto-Update.git
cd AI-Coding-Auto-Update

# 安装依赖 | Install dependencies
npm install

# 开发模式 | Development mode
npm run dev
```

### 构建 | Build
```bash
# 构建应用 | Build application
npm run build

# 打包当前平台 | Package for current platform
npm run package

# 打包所有平台 | Package for all platforms
npm run package:all
```

## 🔍 支持的 AI 工具 | Supported AI Tools

| 工具 | 类型 | 安装方式 | 平台 |
|------|------|----------|------|
| Cursor | IDE | 直接下载 | 全平台 |
| Continue | VSCode 扩展 | npm/VSCode | 全平台 |
| Cline | CLI 工具 | npm | 全平台 |
| Windsurf | IDE | 直接下载 | 全平台 |
| Aider | CLI 工具 | pip/pipx | 全平台 |

更多工具支持详见 [tool-definitions.ts](src/shared/tool-definitions.ts)

## 📋 常见问题 | FAQ

### 💾 复制安装命令功能如何使用？
1. 在工具列表中找到"Install Command"列
2. 点击"📋 Copy Command"按钮
3. 命令会自动复制到剪贴板
4. 打开终端，粘贴并执行命令

### 🔍 ACTM 如何检测已安装的工具？
ACTM 扫描各平台的常见安装目录：
- **macOS**: `/Applications`, `~/Applications`, `/usr/local/bin`
- **Linux**: `/usr/bin`, `/usr/local/bin`, `~/.local/bin`
- **Windows**: `C:\Program Files`, `%LOCALAPPDATA%`

### 🔑 是否需要 GitHub 令牌？
可选但推荐。无令牌：60次/小时，有令牌：5,000次/小时。

### 🔄 更新是如何执行的？
使用各工具的原生包管理器：
- **npm/yarn**: Node.js 工具
- **pip**: Python 工具
- **Homebrew**: macOS 工具
- **直接下载**: 安装程序工具

## 📝 许可证 | License

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🤝 贡献 | Contributing

欢迎提交 Issue 和 Pull Request！参见 [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 🎯 项目总结

AI Coding Tools Manager 专为开发者设计，通过智能检测、版本比较和便捷更新，帮助用户保持开发环境最新状态。

**核心价值：**
- 🚀 节省手动检查和更新时间
- 🔧 提供灵活的安装方式选择
- 📊 一目了然的工具状态管理
- 🔒 安全可靠的更新机制

**最新亮点：** ✨ **复制安装命令功能** - 解决安装问题，提供灵活的手动安装选择

---

Made with ❤️ by the AI Coding Tools Manager Team

**中文支持** | **跨平台** | **开源免费** | **持续更新**