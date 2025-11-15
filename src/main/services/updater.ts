import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { UpdateResult, ToolInfo, InstallMethod } from '../../shared/types';

const execAsync = promisify(exec);

/**
 * Updater - Handles updating tools
 */
export class Updater {
  private readonly backupDir: string;

  constructor() {
    this.backupDir = path.join(os.homedir(), '.actm', 'backups');
  }

  /**
   * Initialize updater (create backup directory)
   */
  async initialize(): Promise<void> {
    try {
      await fs.mkdir(this.backupDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create backup directory:', error);
    }
  }

  /**
   * Update a tool
   */
  async updateTool(tool: ToolInfo): Promise<UpdateResult> {
    const startTime = Date.now();
    let log = '';

    try {
      // Validate tool is installed
      if (tool.status === 'not-installed') {
        return {
          success: false,
          toolName: tool.name,
          oldVersion: null,
          newVersion: null,
          error: 'Tool is not installed',
        };
      }

      // Backup current version
      log += `Backing up ${tool.name}...\n`;
      await this.backupTool(tool);

      // Execute update based on install method
      log += `Updating ${tool.name} via ${tool.installMethod}...\n`;
      const updateCommand = this.getUpdateCommand(tool);

      const { stdout, stderr } = await execAsync(updateCommand, {
        timeout: 300000, // 5 minutes
      });

      log += stdout + '\n' + stderr + '\n';

      // Verify update
      log += 'Verifying update...\n';
      const newVersion = await this.verifyUpdate(tool);

      if (!newVersion) {
        throw new Error('Failed to verify update');
      }

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      log += `Update completed in ${duration}s\n`;

      return {
        success: true,
        toolName: tool.name,
        oldVersion: tool.currentVersion,
        newVersion,
        log,
      };
    } catch (error) {
      // Attempt rollback
      log += 'Update failed, attempting rollback...\n';
      try {
        await this.rollbackTool(tool);
        log += 'Rollback successful\n';
      } catch (rollbackError) {
        log += `Rollback failed: ${rollbackError}\n`;
      }

      return {
        success: false,
        toolName: tool.name,
        oldVersion: tool.currentVersion,
        newVersion: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        log,
      };
    }
  }

  /**
   * Get update command based on install method
   */
  private getUpdateCommand(tool: ToolInfo): string {
    switch (tool.installMethod) {
      case 'npm':
        return `npm update -g ${tool.name}`;
      case 'pip':
        return `pip install --upgrade ${tool.name}`;
      case 'brew':
        return `brew upgrade ${tool.name}`;
      case 'binary':
        throw new Error('Binary updates not yet implemented');
      default:
        throw new Error(`Unknown install method: ${tool.installMethod}`);
    }
  }

  /**
   * Backup current tool version
   */
  private async backupTool(tool: ToolInfo): Promise<void> {
    if (!tool.installPath) {
      return;
    }

    const backupPath = path.join(
      this.backupDir,
      `${tool.name}-${tool.currentVersion}-${Date.now()}`
    );

    try {
      await fs.mkdir(backupPath, { recursive: true });

      // For npm/pip packages, we don't backup binaries
      // Instead, we save the version info
      const versionInfo = {
        name: tool.name,
        version: tool.currentVersion,
        installMethod: tool.installMethod,
        installPath: tool.installPath,
        backupDate: new Date().toISOString(),
      };

      await fs.writeFile(
        path.join(backupPath, 'version.json'),
        JSON.stringify(versionInfo, null, 2)
      );
    } catch (error) {
      console.error(`Failed to backup ${tool.name}:`, error);
    }
  }

  /**
   * Verify update was successful
   */
  private async verifyUpdate(tool: ToolInfo): Promise<string | null> {
    try {
      // Re-detect the tool to get new version
      const { stdout } = await execAsync(`${tool.name} --version`, {
        timeout: 5000,
      });

      // Extract version from output
      const versionMatch = stdout.match(/(\d+\.\d+\.\d+)/);
      return versionMatch ? versionMatch[1] : null;
    } catch {
      return null;
    }
  }

  /**
   * Rollback to previous version
   */
  private async rollbackTool(tool: ToolInfo): Promise<void> {
    if (!tool.currentVersion) {
      throw new Error('No version to rollback to');
    }

    const rollbackCommand = this.getRollbackCommand(tool);
    await execAsync(rollbackCommand, { timeout: 300000 });
  }

  /**
   * Get rollback command
   */
  private getRollbackCommand(tool: ToolInfo): string {
    switch (tool.installMethod) {
      case 'npm':
        return `npm install -g ${tool.name}@${tool.currentVersion}`;
      case 'pip':
        return `pip install ${tool.name}==${tool.currentVersion}`;
      case 'brew':
        // Homebrew doesn't support easy version rollback
        throw new Error('Brew rollback not supported');
      default:
        throw new Error(`Unknown install method: ${tool.installMethod}`);
    }
  }

  /**
   * Install a new tool
   */
  async installTool(
    toolName: string,
    installMethod: InstallMethod,
    packageName: string
  ): Promise<UpdateResult> {
    let log = '';

    try {
      log += `Installing ${toolName} via ${installMethod}...\n`;

      let installCommand: string;
      switch (installMethod) {
        case 'npm':
          installCommand = `npm install -g ${packageName}`;
          break;
        case 'pip':
          installCommand = `pip install ${packageName}`;
          break;
        case 'brew':
          installCommand = `brew install ${packageName}`;
          break;
        default:
          throw new Error(`Unsupported install method: ${installMethod}`);
      }

      const { stdout, stderr } = await execAsync(installCommand, {
        timeout: 300000,
      });

      log += stdout + '\n' + stderr + '\n';

      return {
        success: true,
        toolName,
        oldVersion: null,
        newVersion: 'installed',
        log,
      };
    } catch (error) {
      return {
        success: false,
        toolName,
        oldVersion: null,
        newVersion: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        log,
      };
    }
  }
}
