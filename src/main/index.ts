import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { ToolDetector } from './services/detector';
import { VersionService } from './services/version-service';
import { Updater } from './services/updater';
import { ConfigManager } from './services/config-manager';
import { ToolInfo, UpdateResult, BatchUpdateResult, AppConfig } from '../shared/types';
import { getToolDefinition, TOOL_DEFINITIONS } from '../shared/tool-definitions';

let mainWindow: BrowserWindow | null = null;
const detector = new ToolDetector();
const updater = new Updater();
const configManager = new ConfigManager();
let versionService: VersionService;

/**
 * Create main window
 */
function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    title: 'AI Coding Tools Manager',
    backgroundColor: '#ffffff',
  });

  // Load renderer
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

/**
 * Initialize services
 */
async function initializeServices(): Promise<void> {
  const config = configManager.getConfig();
  versionService = new VersionService(config.githubToken);
  await updater.initialize();
}

/**
 * App lifecycle
 */
app.whenReady().then(async () => {
  await initializeServices();
  createWindow();
  setupIpcHandlers();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

/**
 * IPC Handlers
 */
function setupIpcHandlers(): void {
  /**
   * Scan for installed tools
   */
  ipcMain.handle('scan-tools', async (): Promise<ToolInfo[]> => {
    try {
      const tools = await detector.scanAllTools();
      return tools;
    } catch (error) {
      console.error('Error scanning tools:', error);
      throw error;
    }
  });

  /**
   * Check latest versions for all tools
   */
  ipcMain.handle('check-versions', async (_, tools: ToolInfo[]): Promise<ToolInfo[]> => {
    try {
      const updatedTools = await Promise.all(
        tools.map(async (tool) => {
          const definition = getToolDefinition(tool.name);
          if (!definition) {
            return tool;
          }

          const versionInfo = await versionService.getLatestVersion(definition);
          if (versionInfo) {
            const isOutdated =
              tool.currentVersion !== null &&
              versionService.isNewer(tool.currentVersion, versionInfo.version);

            return {
              ...tool,
              latestVersion: versionInfo.version,
              isOutdated,
              status: isOutdated ? 'outdated' as const : tool.status,
            };
          }

          return tool;
        })
      );

      return updatedTools;
    } catch (error) {
      console.error('Error checking versions:', error);
      throw error;
    }
  });

  /**
   * Update a single tool
   */
  ipcMain.handle('update-tool', async (_, toolInfo: ToolInfo): Promise<UpdateResult> => {
    try {
      return await updater.updateTool(toolInfo);
    } catch (error) {
      console.error('Error updating tool:', error);
      throw error;
    }
  });

  /**
   * Batch update multiple tools
   */
  ipcMain.handle(
    'batch-update',
    async (_, tools: ToolInfo[]): Promise<BatchUpdateResult> => {
      const results: UpdateResult[] = [];

      for (const tool of tools) {
        const result = await updater.updateTool(tool);
        results.push(result);
      }

      const successCount = results.filter((r) => r.success).length;
      const failureCount = results.length - successCount;

      return {
        results,
        successCount,
        failureCount,
      };
    }
  );

  /**
   * Install a tool
   */
  ipcMain.handle(
    'install-tool',
    async (_, toolName: string, installMethod: string, packageName: string): Promise<UpdateResult> => {
      try {
        return await updater.installTool(toolName, installMethod as any, packageName);
      } catch (error) {
        console.error('Error installing tool:', error);
        throw error;
      }
    }
  );

  /**
   * Get configuration
   */
  ipcMain.handle('get-config', async (): Promise<AppConfig> => {
    return configManager.getConfig();
  });

  /**
   * Set configuration
   */
  ipcMain.handle('set-config', async (_, config: Partial<AppConfig>): Promise<void> => {
    configManager.setConfig(config);
  });

  /**
   * Get tool definitions
   */
  ipcMain.handle('get-tool-definitions', async () => {
    return TOOL_DEFINITIONS;
  });

  /**
   * Clear version cache
   */
  ipcMain.handle('clear-cache', async (): Promise<void> => {
    versionService.clearCache();
  });
}
