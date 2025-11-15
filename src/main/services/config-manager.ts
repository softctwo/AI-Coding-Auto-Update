import Store from 'electron-store';
import { AppConfig } from '../../shared/types';

/**
 * Configuration Manager - Manages app settings
 */
export class ConfigManager {
  private store: Store<AppConfig>;

  constructor() {
    this.store = new Store<AppConfig>({
      defaults: this.getDefaultConfig(),
    });
  }

  /**
   * Get default configuration
   */
  private getDefaultConfig(): AppConfig {
    return {
      autoCheckUpdates: true,
      checkInterval: 6, // 6 hours
      autoStartup: false,
      showNotifications: true,
      autoBackup: true,
    };
  }

  /**
   * Get current configuration
   */
  getConfig(): AppConfig {
    return this.store.store;
  }

  /**
   * Update configuration
   */
  setConfig(config: Partial<AppConfig>): void {
    Object.entries(config).forEach(([key, value]) => {
      if (value !== undefined) {
        this.store.set(key as keyof AppConfig, value as any);
      }
    });
  }

  /**
   * Get specific config value
   */
  get<K extends keyof AppConfig>(key: K): AppConfig[K] {
    return this.store.get(key);
  }

  /**
   * Set specific config value
   */
  set<K extends keyof AppConfig>(key: K, value: AppConfig[K]): void {
    this.store.set(key, value);
  }

  /**
   * Reset to defaults
   */
  reset(): void {
    this.store.clear();
  }
}
