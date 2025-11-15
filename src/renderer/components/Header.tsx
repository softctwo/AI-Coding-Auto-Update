import React from 'react';

interface HeaderProps {
  onRefresh: () => void;
  onSettingsClick: () => void;
  onDashboardClick: () => void;
  loading: boolean;
  currentView: 'dashboard' | 'settings';
}

const Header: React.FC<HeaderProps> = ({
  onRefresh,
  onSettingsClick,
  onDashboardClick,
  loading,
  currentView,
}) => {
  return (
    <header className="header">
      <div className="header-left">
        <h1>AI Coding Tools Manager</h1>
        <span className="version">v1.0.0</span>
      </div>
      <div className="header-right">
        {currentView === 'dashboard' && (
          <button onClick={onRefresh} disabled={loading} className="icon-btn">
            {loading ? '⟳' : '↻'} Refresh
          </button>
        )}
        <button
          onClick={currentView === 'dashboard' ? onSettingsClick : onDashboardClick}
          className="icon-btn"
        >
          {currentView === 'dashboard' ? '⚙️ Settings' : '← Dashboard'}
        </button>
      </div>
    </header>
  );
};

export default Header;
