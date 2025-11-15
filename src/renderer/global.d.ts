import { ToolInfo, UpdateResult, BatchUpdateResult, AppConfig, ToolDefinition } from '../shared/types';

/**
 * Global type declarations for renderer process
 */
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

export {};
