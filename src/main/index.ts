import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { ConfigManager } from './services/config-manager';
import { ToolDetector } from './services/detector';
import { VersionService } from './services/version-service';
import { Updater } from './services/updater';
import { ToolInfo, UpdateResult, BatchUpdateResult, AppConfig } from '../shared/types';
import { getToolDefinition, TOOL_DEFINITIONS } from '../shared/tool-definitions';

let mainWindow: BrowserWindow | null = null;
let configManager: ConfigManager;
let detector: ToolDetector;
let versionService: VersionService;
let updater: Updater;

function createWindow(): void {
  console.log('Creating Electron window...');

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true, // Enable Node.js integration for development
      contextIsolation: false, // Disable context isolation for development
      preload: path.join(__dirname, 'preload.js'),
    },
    title: 'AI Coding Tools Manager',
    backgroundColor: '#ffffff',
    show: false, // Don't show until ready
  });

  console.log('BrowserWindow created');

  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Window content loaded');
    mainWindow?.show();
  });

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load window content:', errorCode, errorDescription);
  });

  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`[Renderer-${level}] ${message}`);
  });

  if (process.env.NODE_ENV === 'development') {
    console.log('Loading development URL: http://localhost:3000');
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    console.log('Loading production file');
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.on('closed', () => {
    console.log('Window closed');
    mainWindow = null;
  });

  mainWindow.on('ready-to-show', () => {
    console.log('Window ready to show');
  });
}

app.whenReady().then(() => {
  console.log('App ready - initializing services...');
  try {
    configManager = new ConfigManager();
    console.log('✓ ConfigManager initialized');
    const config = configManager.getConfig();

    versionService = new VersionService(config.githubToken);
    console.log('✓ VersionService initialized');

    detector = new ToolDetector();
    console.log('✓ ToolDetector initialized');

    updater = new Updater();
    console.log('✓ Updater initializing...');
    updater.initialize().then(() => {
      console.log('✓ All services initialized');
    }).catch((error) => {
      console.error('✗ Failed to initialize Updater:', error);
    });
  } catch (error) {
    console.error('✗ Failed to initialize services:', error);
  }

  createWindow();
  setupIpcHandlers();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  console.log('All windows closed');
  if (process.platform !== 'darwin') {
    console.log('Quitting app (not macOS)');
    app.quit();
  } else {
    console.log('macOS - keeping app alive');
  }
});

app.on('before-quit', () => {
  console.log('App is quitting...');
});

function setupIpcHandlers(): void {
  ipcMain.handle('scan-tools', async (): Promise<ToolInfo[]> => {
    try {
      console.log('[IPC] Scanning tools...');
      if (!detector) {
        console.warn('[IPC] ToolDetector not initialized');
        return [];
      }
      const tools = await detector.scanAllTools();
      console.log(`[IPC] Scanned ${tools.length} tools`);
      return tools;
    } catch (error) {
      console.error('[IPC] Error scanning tools:', error);
      return [];
    }
  });

  ipcMain.handle('check-versions', async (_, tools: ToolInfo[]): Promise<ToolInfo[]> => {
    try {
      console.log(`[IPC] Checking versions for ${tools.length} tools`);
      if (!versionService) {
        console.warn('[IPC] VersionService not initialized');
        return tools;
      }

      const updatedTools = await Promise.all(
        tools.map(async (tool) => {
          try {
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
          } catch (error) {
            console.error(`[IPC] Error checking version for ${tool.name}:`, error);
            return tool;
          }
        })
      );

      return updatedTools;
    } catch (error) {
      console.error('[IPC] Error checking versions:', error);
      return tools;
    }
  });

  ipcMain.handle('update-tool', async (_, toolInfo: ToolInfo): Promise<UpdateResult> => {
    try {
      console.log(`[IPC] Updating tool: ${toolInfo.name}`);
      if (!updater) {
        return {
          success: false,
          toolName: toolInfo.name,
          oldVersion: toolInfo.currentVersion,
          newVersion: null,
          error: 'Updater not initialized',
        };
      }
      return await updater.updateTool(toolInfo);
    } catch (error) {
      console.error('[IPC] Error updating tool:', error);
      throw error;
    }
  });

  ipcMain.handle('batch-update', async (_, tools: ToolInfo[]): Promise<BatchUpdateResult> => {
    try {
      console.log(`[IPC] Batch updating ${tools.length} tools`);
      if (!updater) {
        return {
          results: [],
          successCount: 0,
          failureCount: tools.length,
        };
      }

      const results: UpdateResult[] = [];

      for (const tool of tools) {
        try {
          const result = await updater.updateTool(tool);
          results.push(result);
        } catch (error) {
          results.push({
            success: false,
            toolName: tool.name,
            oldVersion: tool.currentVersion,
            newVersion: null,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }

      const successCount = results.filter((r) => r.success).length;
      const failureCount = results.length - successCount;

      return {
        results,
        successCount,
        failureCount,
      };
    } catch (error) {
      console.error('[IPC] Error in batch update:', error);
      throw error;
    }
  });

  ipcMain.handle('install-tool', async (_, toolName: string, installMethod: string, packageName: string): Promise<UpdateResult> => {
    try {
      console.log(`[IPC] Installing tool: ${toolName} via ${installMethod}`);
      if (!updater) {
        return {
          success: false,
          toolName,
          oldVersion: null,
          newVersion: null,
          error: 'Updater not initialized',
        };
      }
      return await updater.installTool(toolName, installMethod as any, packageName);
    } catch (error) {
      console.error('[IPC] Error installing tool:', error);
      throw error;
    }
  });

  ipcMain.handle('get-config', async (): Promise<AppConfig> => {
    try {
      return configManager ? configManager.getConfig() : {
        autoCheckUpdates: true,
        checkInterval: 6,
        autoStartup: false,
        showNotifications: true,
        autoBackup: true,
      };
    } catch (error) {
      console.error('[IPC] Error getting config:', error);
      return {
        autoCheckUpdates: true,
        checkInterval: 6,
        autoStartup: false,
        showNotifications: true,
        autoBackup: true,
      };
    }
  });

  ipcMain.handle('set-config', async (_, config: Partial<AppConfig>) => {
    try {
      console.log('[IPC] Setting config:', config);
      if (configManager) {
        configManager.setConfig(config);
      }
    } catch (error) {
      console.error('[IPC] Error setting config:', error);
    }
  });

  ipcMain.handle('get-tool-definitions', async () => {
    try {
      return TOOL_DEFINITIONS;
    } catch (error) {
      console.error('[IPC] Error getting tool definitions:', error);
      return [];
    }
  });

  ipcMain.handle('clear-cache', async (): Promise<void> => {
    try {
      console.log('[IPC] Clearing cache');
      if (versionService) {
        versionService.clearCache();
      }
    } catch (error) {
      console.error('[IPC] Error clearing cache:', error);
    }
  });
}

console.log('Full app script loaded');
