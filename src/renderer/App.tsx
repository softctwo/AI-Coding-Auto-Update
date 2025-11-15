import React, { useState, useEffect } from 'react';
import { ToolInfo, AppConfig } from '../shared/types';
import ToolList from './components/ToolList';
import Header from './components/Header';
import Settings from './components/Settings';
import UpdateDialog from './components/UpdateDialog';

type View = 'dashboard' | 'settings';

const App: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');
  const [tools, setTools] = useState<ToolInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTools, setSelectedTools] = useState<Set<string>>(new Set());
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [config, setConfig] = useState<AppConfig | null>(null);

  useEffect(() => {
    loadTools();
    loadConfig();
  }, []);

  const loadTools = async () => {
    setLoading(true);
    try {
      const scannedTools = await window.electronAPI.scanTools();
      setTools(scannedTools);

      // Check versions
      const toolsWithVersions = await window.electronAPI.checkVersions(scannedTools);
      setTools(toolsWithVersions);
    } catch (error) {
      console.error('Failed to load tools:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadConfig = async () => {
    try {
      const cfg = await window.electronAPI.getConfig();
      setConfig(cfg);
    } catch (error) {
      console.error('Failed to load config:', error);
    }
  };

  const handleRefresh = async () => {
    await loadTools();
  };

  const handleUpdateSelected = () => {
    if (selectedTools.size > 0) {
      setShowUpdateDialog(true);
    }
  };

  const handleUpdateConfirm = async () => {
    setShowUpdateDialog(false);
    const toolsToUpdate = tools.filter(t => selectedTools.has(t.name));

    setLoading(true);
    try {
      const result = await window.electronAPI.batchUpdate(toolsToUpdate);
      console.log('Update result:', result);

      // Reload tools
      await loadTools();
      setSelectedTools(new Set());
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfigSave = async (newConfig: Partial<AppConfig>) => {
    try {
      await window.electronAPI.setConfig(newConfig);
      await loadConfig();
    } catch (error) {
      console.error('Failed to save config:', error);
    }
  };

  const filteredTools = tools.filter(tool =>
    tool.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const outdatedTools = filteredTools.filter(t => t.isOutdated);
  const installedTools = filteredTools.filter(t => t.status === 'installed' || t.status === 'outdated');
  const notInstalledTools = filteredTools.filter(t => t.status === 'not-installed');

  return (
    <div className="app">
      <Header
        onRefresh={handleRefresh}
        onSettingsClick={() => setView('settings')}
        onDashboardClick={() => setView('dashboard')}
        loading={loading}
        currentView={view}
      />

      {view === 'dashboard' ? (
        <>
          <div className="toolbar">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="stats">
              <span>Installed: {installedTools.length}</span>
              <span className="outdated">Updates Available: {outdatedTools.length}</span>
              <span>Not Installed: {notInstalledTools.length}</span>
            </div>
          </div>

          <ToolList
            tools={filteredTools}
            selectedTools={selectedTools}
            onSelectionChange={setSelectedTools}
            onRefresh={loadTools}
          />

          {selectedTools.size > 0 && (
            <div className="action-bar">
              <button onClick={() => setSelectedTools(new Set())}>
                Clear Selection ({selectedTools.size})
              </button>
              <button className="primary" onClick={handleUpdateSelected}>
                Update Selected ({selectedTools.size})
              </button>
            </div>
          )}
        </>
      ) : (
        <Settings config={config} onSave={handleConfigSave} />
      )}

      {showUpdateDialog && (
        <UpdateDialog
          tools={tools.filter(t => selectedTools.has(t.name))}
          onConfirm={handleUpdateConfirm}
          onCancel={() => setShowUpdateDialog(false)}
        />
      )}
    </div>
  );
};

export default App;
