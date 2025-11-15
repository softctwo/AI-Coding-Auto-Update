import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

// 立即执行，确保这行代码在最开始运行
console.log('🎯 RENDERER INDEX.TSX: Starting execution...');

// Fix for "global is not defined" error in Electron
if (typeof (window as any).global === 'undefined') {
  (window as any).global = window;
  console.log('✅ Global variable fixed');
}

console.log('📦 RENDERER INDEX.TSX: Modules loading...');

// 添加错误处理 - 必须在所有代码之前
window.addEventListener('error', (event) => {
  console.error('❌ Global error:', event.error);
  console.error('Error message:', event.message);
  console.error('Error filename:', event.filename);
  console.error('Error lineno:', event.lineno);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Unhandled promise rejection:', event.reason);
});

try {
  const rootElement = document.getElementById('root');
  console.log('Root element:', rootElement);

  if (!rootElement) {
    console.error('Root element not found!');
    document.body.innerHTML = '<h1 style="color: red;">Error: Root element not found!</h1>';
  } else {
    const root = ReactDOM.createRoot(rootElement);
    console.log('React root created successfully');

    // Check if electronAPI is available
    if (!(window as any).electronAPI) {
      console.error('electronAPI not found on window object');
      root.render(
        <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#ffcccc' }}>
          <h1>Error: electronAPI not available</h1>
          <p>Make sure the app is running in Electron, not a regular browser.</p>
          <p>This usually means the preload script is not loading correctly.</p>
        </div>
      );
    } else {
      console.log('electronAPI is available, rendering App...');
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
      console.log('App rendered successfully');
    }
  }
} catch (error) {
  console.error('Fatal error in renderer:', error);
  document.body.innerHTML = `<h1 style="color: red;">Fatal Error: ${error}</h1>`;
}
