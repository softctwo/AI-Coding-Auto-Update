import React from 'react';
import { ToolInfo } from '../../shared/types';

interface UpdateDialogProps {
  tools: ToolInfo[];
  onConfirm: () => void;
  onCancel: () => void;
}

const UpdateDialog: React.FC<UpdateDialogProps> = ({ tools, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Confirm Update</h2>

        <p>The following tools will be updated:</p>

        <ul className="update-list">
          {tools.map((tool) => (
            <li key={tool.name}>
              <strong>{tool.displayName}</strong>
              <span className="version-change">
                {tool.currentVersion} → {tool.latestVersion}
              </span>
            </li>
          ))}
        </ul>

        <p className="warning">
          Updates will be automatically backed up. Do you want to continue?
        </p>

        <div className="modal-actions">
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onConfirm} className="primary">
            Confirm Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateDialog;
