import React, { useState, useEffect } from 'react';
import { AppConfig } from '../../shared/types';

interface SettingsProps {
  config: AppConfig | null;
  onSave: (config: Partial<AppConfig>) => void;
}

const Settings: React.FC<SettingsProps> = ({ config, onSave }) => {
  const [formData, setFormData] = useState<AppConfig>({
    autoCheckUpdates: true,
    checkInterval: 6,
    autoStartup: false,
    showNotifications: true,
    autoBackup: true,
  });

  useEffect(() => {
    if (config) {
      setFormData(config);
    }
  }, [config]);

  const handleChange = (field: keyof AppConfig, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    alert('Settings saved successfully');
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>

      <form onSubmit={handleSubmit}>
        <section className="settings-section">
          <h3>General</h3>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.autoStartup}
              onChange={(e) => handleChange('autoStartup', e.target.checked)}
            />
            <span>Launch at startup</span>
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.autoCheckUpdates}
              onChange={(e) => handleChange('autoCheckUpdates', e.target.checked)}
            />
            <span>Automatically check for updates</span>
          </label>

          {formData.autoCheckUpdates && (
            <div className="form-group">
              <label>Check interval (hours):</label>
              <input
                type="number"
                min="1"
                max="168"
                value={formData.checkInterval}
                onChange={(e) => handleChange('checkInterval', parseInt(e.target.value))}
              />
            </div>
          )}

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.showNotifications}
              onChange={(e) => handleChange('showNotifications', e.target.checked)}
            />
            <span>Show desktop notifications</span>
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.autoBackup}
              onChange={(e) => handleChange('autoBackup', e.target.checked)}
            />
            <span>Automatically backup before updates</span>
          </label>
        </section>

        <section className="settings-section">
          <h3>GitHub API</h3>
          <div className="form-group">
            <label>Personal Access Token (optional):</label>
            <input
              type="password"
              placeholder="ghp_xxxxxxxxxxxxx"
              value={formData.githubToken || ''}
              onChange={(e) => handleChange('githubToken', e.target.value)}
            />
            <small>
              Providing a GitHub token increases API rate limits.{' '}
              <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer">
                Create token
              </a>
            </small>
          </div>
        </section>

        <section className="settings-section">
          <h3>Proxy (optional)</h3>
          <div className="form-group">
            <label>Protocol:</label>
            <select
              value={formData.proxy?.protocol || 'http'}
              onChange={(e) =>
                handleChange('proxy', {
                  ...formData.proxy,
                  protocol: e.target.value,
                })
              }
            >
              <option value="http">HTTP</option>
              <option value="https">HTTPS</option>
              <option value="socks5">SOCKS5</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Host:</label>
              <input
                type="text"
                placeholder="127.0.0.1"
                value={formData.proxy?.host || ''}
                onChange={(e) =>
                  handleChange('proxy', {
                    ...formData.proxy,
                    host: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Port:</label>
              <input
                type="number"
                placeholder="7890"
                value={formData.proxy?.port || ''}
                onChange={(e) =>
                  handleChange('proxy', {
                    ...formData.proxy,
                    port: parseInt(e.target.value),
                  })
                }
              />
            </div>
          </div>
        </section>

        <div className="settings-actions">
          <button type="submit" className="primary">
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
