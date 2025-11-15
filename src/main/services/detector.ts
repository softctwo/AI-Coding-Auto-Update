import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as os from 'os';
import { ToolInfo, ToolDefinition, InstallMethod, ToolStatus } from '../../shared/types';
import { TOOL_DEFINITIONS } from '../../shared/tool-definitions';

const execAsync = promisify(exec);

/**
 * Tool Detector - Scans system for installed AI coding tools
 */
export class ToolDetector {
  /**
   * Scan for all defined tools
   */
  async scanAllTools(): Promise<ToolInfo[]> {
    const results = await Promise.all(
      TOOL_DEFINITIONS.map(definition => this.detectTool(definition))
    );
    return results;
  }

  /**
   * Detect a specific tool
   */
  async detectTool(definition: ToolDefinition): Promise<ToolInfo> {
    try {
      // Check if command exists
      const commandPath = await this.findCommandPath(definition.command);

      if (!commandPath) {
        return this.createNotInstalledInfo(definition);
      }

      // Get current version
      const currentVersion = await this.getVersion(definition);

      if (!currentVersion) {
        return this.createNotInstalledInfo(definition);
      }

      // Detect install method
      const installMethod = await this.detectInstallMethod(definition, commandPath);

      // Find config path
      const configPath = await this.findConfigPath(definition);

      return {
        name: definition.name,
        displayName: definition.displayName,
        currentVersion,
        latestVersion: null,
        installPath: commandPath,
        installMethod,
        configPath,
        lastChecked: new Date(),
        status: 'installed',
        isOutdated: false,
      };
    } catch (error) {
      return {
        name: definition.name,
        displayName: definition.displayName,
        currentVersion: null,
        latestVersion: null,
        installPath: null,
        installMethod: 'unknown',
        configPath: null,
        lastChecked: new Date(),
        status: 'error',
        isOutdated: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Find command path using 'which' or 'where'
   */
  private async findCommandPath(command: string): Promise<string | null> {
    try {
      const whichCommand = process.platform === 'win32' ? 'where' : 'which';
      const { stdout } = await execAsync(`${whichCommand} ${command}`);
      return stdout.trim().split('\n')[0] || null;
    } catch {
      return null;
    }
  }

  /**
   * Get version from command
   */
  private async getVersion(definition: ToolDefinition): Promise<string | null> {
    try {
      const { stdout, stderr } = await execAsync(
        `${definition.command} ${definition.versionFlag}`,
        { timeout: 5000 }
      );

      const output = stdout + stderr;
      const match = output.match(definition.versionRegex);

      return match ? match[1] : null;
    } catch {
      return null;
    }
  }

  /**
   * Detect how the tool was installed
   */
  private async detectInstallMethod(
    definition: ToolDefinition,
    commandPath: string
  ): Promise<InstallMethod> {
    // Check npm
    if (commandPath.includes('node_modules') || commandPath.includes('.npm')) {
      return 'npm';
    }

    // Check pip (Python)
    if (commandPath.includes('python') || commandPath.includes('site-packages')) {
      return 'pip';
    }

    // Check brew (macOS/Linux)
    if (commandPath.includes('/usr/local/Cellar') || commandPath.includes('homebrew')) {
      return 'brew';
    }

    // Check if it's a standalone binary
    if (commandPath.includes('/usr/local/bin') || commandPath.includes('/usr/bin')) {
      // Try to determine if it was installed via a package manager
      try {
        if (definition.installMethods.npm) {
          const { stdout } = await execAsync('npm list -g --depth=0');
          if (stdout.includes(definition.installMethods.npm)) {
            return 'npm';
          }
        }

        if (definition.installMethods.pip) {
          const { stdout } = await execAsync('pip list');
          if (stdout.includes(definition.installMethods.pip)) {
            return 'pip';
          }
        }

        if (definition.installMethods.brew && process.platform === 'darwin') {
          const { stdout } = await execAsync('brew list');
          if (stdout.includes(definition.name)) {
            return 'brew';
          }
        }
      } catch {
        // Ignore errors
      }

      return 'binary';
    }

    return 'unknown';
  }

  /**
   * Find configuration file path
   */
  private async findConfigPath(definition: ToolDefinition): Promise<string | null> {
    if (!definition.configPaths) {
      return null;
    }

    const homeDir = os.homedir();

    for (const configPath of definition.configPaths) {
      const expandedPath = configPath.replace('~', homeDir);
      try {
        const { stdout } = await execAsync(`test -f "${expandedPath}" && echo "exists"`);
        if (stdout.trim() === 'exists') {
          return expandedPath;
        }
      } catch {
        continue;
      }
    }

    return null;
  }

  /**
   * Create ToolInfo for not installed tool
   */
  private createNotInstalledInfo(definition: ToolDefinition): ToolInfo {
    return {
      name: definition.name,
      displayName: definition.displayName,
      currentVersion: null,
      latestVersion: null,
      installPath: null,
      installMethod: 'unknown',
      configPath: null,
      lastChecked: new Date(),
      status: 'not-installed',
      isOutdated: false,
    };
  }
}
