// Simple debug panel to show localStorage contents
import React, { useState } from 'react';

const DebugPanel = () => {
  const [isVisible, setIsVisible] = useState(false);

  const showStorageContents = () => {
    console.log('=== LOCALSTORAGE CONTENTS ===');
    console.log('Farmers:', JSON.parse(localStorage.getItem('krishisettu-farmers') || '[]'));
    console.log('Buyers:', JSON.parse(localStorage.getItem('krishisettu-buyers') || '[]'));
    console.log('Current User:', JSON.parse(localStorage.getItem('krishisettu-current-user') || 'null'));
    console.log('All Users:', JSON.parse(localStorage.getItem('krishisettu-all-users') || '[]'));
    console.log('=== END ===');
  };

  const clearStorage = () => {
    localStorage.clear();
    console.log('Storage cleared');
  };

  if (!isVisible) {
    return (
      <button 
        onClick={() => setIsVisible(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: '#007bff',
          color: 'white',
          border: 'none',
          padding: '10px',
          borderRadius: '5px',
          cursor: 'pointer',
          zIndex: 9999
        }}
      >
        Debug
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'white',
      border: '1px solid #ccc',
      padding: '15px',
      borderRadius: '5px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      zIndex: 9999,
      minWidth: '200px'
    }}>
      <h4>Debug Panel</h4>
      <button onClick={showStorageContents} style={{ margin: '5px', padding: '5px 10px' }}>
        Show Storage
      </button>
      <button onClick={clearStorage} style={{ margin: '5px', padding: '5px 10px' }}>
        Clear Storage
      </button>
      <button 
        onClick={() => setIsVisible(false)} 
        style={{ margin: '5px', padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none' }}
      >
        Close
      </button>
    </div>
  );
};

export default DebugPanel;
