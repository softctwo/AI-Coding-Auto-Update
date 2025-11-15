/**
 * AI Coding Tools Manager - Shared Type Definitions
 */

export type InstallMethod = 'npm' | 'pip' | 'brew' | 'binary' | 'vscode-extension' | 'unknown';

export type ToolStatus = 'installed' | 'outdated' | 'not-installed' | 'error';

export interface ToolInfo {
  name: string;
  displayName: string;
  currentVersion: string | null;
  latestVersion: string | null;
  installPath: string | null;
  installMethod: InstallMethod;
  configPath: string | null;
  lastChecked: Date;
  status: ToolStatus;
  isOutdated: boolean;
  error?: string;
}

export interface VersionInfo {
  version: string;
  publishedAt: Date;
  downloadUrl?: string;
  changelog?: string;
}

export interface UpdateResult {
  success: boolean;
  toolName: string;
  oldVersion: string | null;
  newVersion: string | null;
  error?: string;
  log?: string;
}

export interface BatchUpdateResult {
  results: UpdateResult[];
  successCount: number;
  failureCount: number;
}

export interface AppConfig {
  autoCheckUpdates: boolean;
  checkInterval: number; // hours
  autoStartup: boolean;
  showNotifications: boolean;
  autoBackup: boolean;
  proxy?: {
    protocol: 'http' | 'https' | 'socks5';
    host: string;
    port: number;
  };
  githubToken?: string;
}

export interface ToolDefinition {
  name: string;
  displayName: string;
  command: string;
  versionFlag: string;
  versionRegex: RegExp;
  installMethods: {
    npm?: string;
    pip?: string;
    brew?: string;
    github?: {
      owner: string;
      repo: string;
    };
  };
  configPaths?: string[];
  homepage?: string;
}
