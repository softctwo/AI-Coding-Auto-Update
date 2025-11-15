import React from 'react';
import { ToolInfo } from '../../shared/types';

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
    const def = definitions.find(d => d.name === tool.name);

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
