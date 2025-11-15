import { contextBridge, ipcRenderer } from 'electron';
import { ToolInfo, UpdateResult, BatchUpdateResult, AppConfig, ToolDefinition } from '../shared/types';

/**
 * Preload script - Exposes safe IPC methods to renderer
 */
contextBridge.exposeInMainWorld('electronAPI', {
  // Tool operations
  scanTools: (): Promise<ToolInfo[]> => ipcRenderer.invoke('scan-tools'),

  checkVersions: (tools: ToolInfo[]): Promise<ToolInfo[]> =>
    ipcRenderer.invoke('check-versions', tools),

  updateTool: (tool: ToolInfo): Promise<UpdateResult> =>
    ipcRenderer.invoke('update-tool', tool),

  batchUpdate: (tools: ToolInfo[]): Promise<BatchUpdateResult> =>
    ipcRenderer.invoke('batch-update', tools),

  installTool: (toolName: string, installMethod: string, packageName: string): Promise<UpdateResult> =>
    ipcRenderer.invoke('install-tool', toolName, installMethod, packageName),

  // Configuration
  getConfig: (): Promise<AppConfig> => ipcRenderer.invoke('get-config'),

  setConfig: (config: Partial<AppConfig>): Promise<void> =>
    ipcRenderer.invoke('set-config', config),

  // Tool definitions
  getToolDefinitions: (): Promise<ToolDefinition[]> =>
    ipcRenderer.invoke('get-tool-definitions'),

  // Cache
  clearCache: (): Promise<void> => ipcRenderer.invoke('clear-cache'),
});

// Type declaration for TypeScript
declare global {
  interface Window {
    electronAPI: {
      scanTools: () => Promise<ToolInfo[]>;
      checkVersions: (tools: ToolInfo[]) => Promise<ToolInfo[]>;
      updateTool: (tool: ToolInfo) => Promise<UpdateResult>;
      batchUpdate: (tools: ToolInfo[]) => Promise<BatchUpdateResult>;
      installTool: (toolName: string, installMethod: string, packageName: string) => Promise<UpdateResult>;
      getConfig: () => Promise<AppConfig>;
      setConfig: (config: Partial<AppConfig>) => Promise<void>;
      getToolDefinitions: () => Promise<ToolDefinition[]>;
      clearCache: () => Promise<void>;
    };
  }
}
