import React from 'react';
import { ToolInfo, ToolDefinition } from '../../shared/types';

interface ToolListProps {
  tools: ToolInfo[];
  selectedTools: Set<string>;
  onSelectionChange: (selected: Set<string>) => void;
  onRefresh: () => void;
}

const ToolList: React.FC<ToolListProps> = ({
  tools,
  selectedTools,
  onSelectionChange,
  onRefresh,
}) => {
  const [copiedTool, setCopiedTool] = React.useState<string | null>(null);
  const handleToggleSelection = (toolName: string) => {
    const newSelection = new Set(selectedTools);
    if (newSelection.has(toolName)) {
      newSelection.delete(toolName);
    } else {
      newSelection.add(toolName);
    }
    onSelectionChange(newSelection);
  };

  const handleSelectAll = () => {
    const outdated = tools.filter(t => t.isOutdated);
    onSelectionChange(new Set(outdated.map(t => t.name)));
  };

  const getStatusBadge = (tool: ToolInfo) => {
    if (tool.status === 'not-installed') {
      return <span className="badge not-installed">❌ Not Installed</span>;
    }
    if (tool.isOutdated) {
      return <span className="badge outdated">🔄 Update Available</span>;
    }
    return <span className="badge up-to-date">✅ Up to Date</span>;
  };

  const handleInstall = async (tool: ToolInfo) => {
    // Determine install method and package name
    const definitions = await window.electronAPI.getToolDefinitions();
    const def = definitions.find((d: ToolDefinition) => d.name === tool.name);

    if (!def) return;

    // Prefer npm, then pip, then brew
    let method = 'npm';
    let packageName = def.installMethods.npm || '';

    if (!packageName && def.installMethods.pip) {
      method = 'pip';
      packageName = def.installMethods.pip;
    } else if (!packageName && def.installMethods.brew) {
      method = 'brew';
      packageName = def.installMethods.brew;
    }

    if (!packageName) {
      alert('No installation method available for this tool');
      return;
    }

    if (confirm(`Install ${tool.displayName} via ${method}?`)) {
      try {
        await window.electronAPI.installTool(tool.name, method, packageName);
        onRefresh();
      } catch (error) {
        alert('Installation failed: ' + error);
      }
    }
  };

  const handleUpdate = async (tool: ToolInfo) => {
    if (confirm(`Update ${tool.displayName} from ${tool.currentVersion} to ${tool.latestVersion}?`)) {
      try {
        await window.electronAPI.updateTool(tool);
        onRefresh();
      } catch (error) {
        alert('Update failed: ' + error);
      }
    }
  };

  const generateInstallCommand = async (tool: ToolInfo): Promise<string> => {
    try {
      const definitions: ToolDefinition[] = await window.electronAPI.getToolDefinitions();
      const def = definitions.find((d: ToolDefinition) => d.name === tool.name);

      if (!def) return '';

      // For not-installed tools, prefer npm, then pip, then brew
      if (tool.status === 'not-installed') {
        if (def.installMethods?.npm) {
          return `npm install -g ${def.installMethods.npm}`;
        } else if (def.installMethods?.pip) {
          return `pip install ${def.installMethods.pip}`;
        } else if (def.installMethods?.brew) {
          return `brew install ${def.installMethods.brew}`;
        }
      } else if (tool.isOutdated) {
        // For update commands
        if (tool.installMethod === 'npm' && def.installMethods?.npm) {
          return `npm update -g ${def.installMethods.npm}`;
        } else if (tool.installMethod === 'pip' && def.installMethods?.pip) {
          return `pip install --upgrade ${def.installMethods.pip}`;
        } else if (tool.installMethod === 'brew' && def.installMethods?.brew) {
          return `brew upgrade ${def.installMethods.brew}`;
        }
      }

      return '';
    } catch (error) {
      console.error('Error generating install command:', error);
      return '';
    }
  };

  const handleCopyCommand = async (tool: ToolInfo) => {
    const command = await generateInstallCommand(tool);
    if (!command) {
      alert('No command available for this tool');
      return;
    }

    try {
      // Use the modern clipboard API
      await navigator.clipboard.writeText(command);
      // Show success feedback
      setCopiedTool(tool.name);
      // Reset after 2 seconds
      setTimeout(() => setCopiedTool(null), 2000);
    } catch (error) {
      console.error('Failed to copy command:', error);
      alert('Failed to copy command to clipboard');
    }
  };

  return (
    <div className="tool-list-container">
      {tools.some(t => t.isOutdated) && (
        <div className="list-header">
          <button onClick={handleSelectAll} className="small">
            Select All Outdated
          </button>
        </div>
      )}

      <table className="tool-table">
        <thead>
          <tr>
            <th style={{ width: '40px' }}></th>
            <th>Tool Name</th>
            <th>Current Version</th>
            <th>Latest Version</th>
            <th>Status</th>
            <th>Install Path</th>
            <th>Install Command</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tools.map((tool) => (
            <tr key={tool.name}>
              <td>
                {tool.status !== 'not-installed' && (
                  <input
                    type="checkbox"
                    checked={selectedTools.has(tool.name)}
                    onChange={() => handleToggleSelection(tool.name)}
                    disabled={!tool.isOutdated}
                  />
                )}
              </td>
              <td>
                <strong>{tool.displayName}</strong>
                <div className="tool-name-small">{tool.name}</div>
              </td>
              <td>
                {tool.currentVersion || '-'}
                {tool.installMethod !== 'unknown' && (
                  <div className="install-method">{tool.installMethod}</div>
                )}
              </td>
              <td>{tool.latestVersion || '-'}</td>
              <td>{getStatusBadge(tool)}</td>
              <td className="path">{tool.installPath || '-'}</td>
              <td className="command-cell">
                {(tool.status === 'not-installed' || tool.isOutdated) ? (
                  <button
                    onClick={() => handleCopyCommand(tool)}
                    className={`small command-button ${copiedTool === tool.name ? 'copied' : ''}`}
                    title="Copy install command to clipboard"
                  >
                    {copiedTool === tool.name ? '✅ Copied!' : '📋 Copy Command'}
                  </button>
                ) : (
                  <span>-</span>
                )}
              </td>
              <td>
                {tool.status === 'not-installed' ? (
                  <button onClick={() => handleInstall(tool)} className="small">
                    Install
                  </button>
                ) : tool.isOutdated ? (
                  <button onClick={() => handleUpdate(tool)} className="small primary">
                    Update
                  </button>
                ) : (
                  <span>-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {tools.length === 0 && (
        <div className="empty-state">
          <p>No tools found</p>
        </div>
      )}
    </div>
  );
};

export default ToolList;
