// 🚨 COPY-PASTE THIS INTO BROWSER CONSOLE BEFORE YOUR DEMO
// This is your safety net for the hackathon presentation

console.log('🎯 HACKATHON SAFETY NET LOADING...');

// Emergency buyer dashboard redirect
window.goBuyer = () => {
  localStorage.setItem('FORCE_BUYER_SESSION', 'true');
  window.location.href = '/buyer-dashboard';
  console.log('✅ Redirected to buyer dashboard');
};

// Emergency form filler
window.quickFill = () => {
  const time = Date.now();
  document.querySelectorAll('input').forEach(input => {
    if (input.placeholder?.includes('Business Name') || input.name === 'businessName') input.value = 'Demo Business Ltd';
    if (input.placeholder?.includes('Contact Person') || input.name === 'contactPerson') input.value = 'Demo Contact';
    if (input.type === 'email') input.value = `demo${time}@hackathon.com`;
    if (input.type === 'password') input.value = 'password123';
    if (input.placeholder?.includes('Business Type') || input.name === 'businessType') input.value = 'Wholesaler';
    if (input.placeholder?.includes('Location') || input.name === 'businessLocation') input.value = 'Demo City';
    if (input.placeholder?.includes('Phone') || input.name === 'phoneNumber') input.value = '9876543210';
    if (input.placeholder?.includes('GST') || input.name === 'gstNumber') input.value = 'GST123456';
    input.dispatchEvent(new Event('input', {bubbles: true}));
  });
  console.log('✅ Form filled automatically');
};

// Monitor and fix wrong redirects
let monitor = setInterval(() => {
  if (window.location.pathname === '/farmer-dashboard' && localStorage.getItem('FORCE_BUYER_SESSION')) {
    console.log('🔄 Auto-fixing wrong redirect...');
    window.location.href = '/buyer-dashboard';
  }
}, 1000);

console.log('🎉 SAFETY NET ACTIVE!');
console.log('📋 Quick Commands:');
console.log('goBuyer() - Go to buyer dashboard');  
console.log('quickFill() - Fill registration form');
console.log('');
console.log('🚀 Ready for your demo! You got this! 🏆');
