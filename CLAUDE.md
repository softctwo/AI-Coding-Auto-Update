# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

AI Coding Tools Manager (ACTM) 是一个基于 Electron + React 的跨平台桌面应用,用于自动检测、管理和更新本机安装的 AI 编程工具(如 Claude Code、Goose、Copilot CLI 等)。

## 常用命令

### 开发与构建
```bash
# 开发模式(启动 Electron + Webpack 开发服务器)
npm run dev

# 生产构建
npm run build

# 打包应用
npm run package        # 所有平台
npm run package:mac    # macOS .dmg
npm run package:linux  # Linux .deb/.rpm/AppImage
npm run package:win    # Windows .exe
```

### 测试与代码质量
```bash
# 运行所有测试
npm test

# 运行特定测试文件
npm test detector.test.ts

# 测试覆盖率
npm test -- --coverage

# 代码检查
npm run lint
```

## 核心架构

### 三层架构模式

项目采用严格的三层分离架构:

```
src/
├── main/          # Electron 主进程(Node.js 环境)
│   ├── index.ts           # 应用入口,IPC 处理器注册
│   ├── preload.ts         # 预加载脚本,IPC 桥接层
│   └── services/          # 后端服务层
│       ├── detector.ts          # 工具检测引擎
│       ├── version-service.ts   # 版本查询服务
│       ├── updater.ts           # 更新执行器
│       └── config-manager.ts    # 配置管理器
├── renderer/      # 渲染进程(浏览器环境)
│   ├── App.tsx
│   └── components/
└── shared/        # 跨进程共享代码
    ├── types.ts            # TypeScript 类型定义
    └── tool-definitions.ts # 工具配置定义
```

**重要**: `main/` 代码运行在 Node.js 环境,可访问文件系统和系统命令;`renderer/` 代码运行在浏览器环境,只能通过 IPC 与主进程通信。

### IPC 通信模式

所有主进程与渲染进程的通信必须通过 `preload.ts` 中定义的安全 API:

1. **主进程**: 在 `src/main/index.ts` 中使用 `ipcMain.handle()` 注册处理器
2. **预加载脚本**: 在 `src/main/preload.ts` 中通过 `contextBridge.exposeInMainWorld()` 暴露给渲染进程
3. **渲染进程**: 通过 `window.electronAPI` 调用

示例:
```typescript
// main/index.ts
ipcMain.handle('scan-tools', async (): Promise<ToolInfo[]> => {
  return await detector.scanAllTools();
});

// preload.ts
contextBridge.exposeInMainWorld('electronAPI', {
  scanTools: (): Promise<ToolInfo[]> => ipcRenderer.invoke('scan-tools'),
});

// renderer/App.tsx
const tools = await window.electronAPI.scanTools();
```

### 服务层设计

主进程中的服务采用单例模式,在应用启动时初始化:

- **ToolDetector**: 扫描系统 PATH、执行版本命令、识别安装方式
- **VersionService**: 查询 GitHub/npm/PyPI/Homebrew API,**24 小时缓存**
- **Updater**: 执行更新命令,自动备份到 `~/.actm/backups/`,失败时自动回滚
- **ConfigManager**: 基于 electron-store 管理用户配置

**关键**: VersionService 初始化时需要传入 GitHub token(从 ConfigManager 获取),这影响 API 速率限制。

## 添加新的 AI 工具支持

编辑 `src/shared/tool-definitions.ts` 中的 `TOOL_DEFINITIONS` 数组:

```typescript
{
  name: 'mytool',              // 命令名称(用于执行)
  displayName: 'My AI Tool',   // UI 显示名称
  command: 'mytool',           // 实际执行的命令
  versionFlag: '--version',    // 获取版本的参数
  versionRegex: /(\d+\.\d+\.\d+)/,  // 从输出中提取版本号的正则
  installMethods: {
    npm: 'mytool-cli',         // npm 包名
    pip: 'mytool',             // PyPI 包名
    brew: 'mytool',            // Homebrew formula
    github: {                  // GitHub 仓库(用于版本查询)
      owner: 'myorg',
      repo: 'mytool',
    },
  },
  configPaths: ['~/.mytool/config.json'],  // 可选:配置文件路径
  homepage: 'https://mytool.dev',          // 可选:官网
}
```

**版本检测优先级**: GitHub Releases → npm → PyPI → Homebrew

## 数据存储位置

应用使用以下目录存储数据(路径会根据操作系统自动调整):

- **配置**: `~/.config/ai-coding-tools-manager/config.json` (Linux/macOS)
- **备份**: `~/.actm/backups/<tool-name>-<version>-<timestamp>/`
- **缓存**: `~/.cache/actm/` (版本信息缓存,TTL 24 小时)
- **日志**: `~/.local/share/actm/logs/`
- **数据库**: `~/.local/share/actm/tools.db` (SQLite,当前版本未实际使用)

## 版本检测机制

VersionService 实现了智能缓存和降级策略:

1. 首先检查内存缓存(Map),TTL 24 小时
2. 按优先级查询:GitHub API → npm registry → PyPI → Homebrew
3. 使用 `semver` 库比较版本,不符合 semver 时回退到字符串比较
4. GitHub API 默认限制 60 次/小时,提供 token 后增至 5000 次/小时

**注意**: 修改 GitHub token 需要重启应用才能生效(VersionService 在启动时初始化)。

## 更新流程

Updater 的更新流程包含完整的错误处理:

1. 验证工具已安装
2. 备份当前版本(将版本信息写入 JSON 文件)
3. 根据 `installMethod` 执行对应命令:
   - `npm`: `npm update -g <package>`
   - `pip`: `pip install --upgrade <package>`
   - `brew`: `brew upgrade <formula>`
4. 验证更新(重新执行版本命令)
5. 失败时自动回滚到原版本

**限制**: Homebrew 不支持自动回滚(无法轻易降级版本)。

## 工具检测逻辑

ToolDetector 通过以下方式识别安装方式:

1. 使用 `which`/`where` 定位命令路径
2. 根据路径特征判断:
   - 包含 `node_modules` 或 `.npm` → npm
   - 包含 `python` 或 `site-packages` → pip
   - 包含 `Cellar` 或 `homebrew` → brew
3. 路径特征不明确时,查询包管理器数据库确认

**边界情况**: VS Code 扩展(如 Cline)的检测逻辑不同,需执行 `code --list-extensions` 并解析输出。

## 开发注意事项

### Webpack 配置
- 主进程使用 TypeScript 直接编译(`tsc`)
- 渲染进程使用 Webpack 打包,配置文件: `webpack.renderer.config.js`
- CSS 通过 `style-loader` 和 `css-loader` 处理

### 开发模式行为
- `npm run dev` 启动两个进程:
  1. Webpack 开发服务器(端口 3000)
  2. Electron 主进程(加载 localhost:3000)
- 主进程检测 `process.env.NODE_ENV === 'development'` 决定加载本地服务器还是打包后的文件

### TypeScript 配置
- `tsconfig.json`: 基础配置
- `tsconfig.main.json`: 主进程专用(输出到 `dist/main/`)
- `tsconfig.renderer.json`: 渲染进程专用(输出到 `dist/renderer/`,包含 DOM 类型)

### 安全性
- 主窗口禁用 `nodeIntegration`,启用 `contextIsolation`
- 所有 Node.js API 调用必须通过 preload 脚本暴露
- 不要在渲染进程中直接 `require()` Node.js 模块

## 测试策略

- 单元测试使用 Jest + ts-jest
- 测试文件放在 `__tests__/` 目录或命名为 `*.test.ts`
- 工具检测测试使用真实命令(如 `node --version`)验证逻辑
- 避免在测试中实际执行更新操作(破坏性)

## 常见问题

### 为什么修改 tool-definitions.ts 后工具列表没更新?
需要重新构建(`npm run build`)或重启开发模式(`npm run dev`)。工具定义在编译时打包进代码。

### 如何调试主进程代码?
主进程日志输出到终端。渲染进程可在 DevTools 中调试(开发模式自动打开)。

### 更新失败后如何手动回滚?
备份位于 `~/.actm/backups/`,每个备份目录包含 `version.json` 记录了安装方式和版本号。
