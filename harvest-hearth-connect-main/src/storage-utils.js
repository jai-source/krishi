// Quick localStorage utility
window.clearAllStorage = function() {
  localStorage.clear();
  console.log('🧹 All localStorage cleared');
};

window.showStorage = function() {
  console.log('=== CURRENT STORAGE ===');
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('krishisettu-')) {
      console.log(key + ':', JSON.parse(localStorage.getItem(key)));
    }
  }
  console.log('=== END ===');
};

console.log('🔧 Storage utilities loaded. Use clearAllStorage() and showStorage() in console.');
