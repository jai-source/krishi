// 🚨 HACKATHON EMERGENCY OVERRIDE - RUN THIS IN BROWSER CONSOLE
// Copy and paste this entire script into your browser console if routing still fails

console.log('🚨 HACKATHON EMERGENCY OVERRIDE LOADING...');

// 1. Override buyer registration to always work
window.overrideBuyerRegistration = function() {
  console.log('🔧 Overriding buyer registration...');
  
  // Force any registration to be treated as buyer
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function(type, listener, options) {
    if (type === 'submit' && this.closest && this.closest('form')) {
      const form = this.closest('form');
      const buyerTab = document.querySelector('[data-value="buyer"]');
      const isRegisterForm = form.querySelector('input[type="email"]') && form.querySelector('input[type="password"]');
      
      if (isRegisterForm && buyerTab && buyerTab.getAttribute('data-state') === 'active') {
        console.log('🎯 Detected buyer registration form submission');
        localStorage.setItem('PENDING_BUYER_REGISTRATION', 'true');
      }
    }
    return originalAddEventListener.call(this, type, listener, options);
  };
};

// 2. Override navigation to force buyer routing
window.overrideNavigation = function() {
  console.log('🔧 Overriding navigation...');
  
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  
  history.pushState = function(state, title, url) {
    if (url === '/farmer-dashboard' && localStorage.getItem('PENDING_BUYER_REGISTRATION') === 'true') {
      console.log('🔄 OVERRIDE: Redirecting farmer-dashboard to buyer-dashboard');
      url = '/buyer-dashboard';
      localStorage.setItem('FORCE_BUYER_SESSION', 'true');
      localStorage.removeItem('PENDING_BUYER_REGISTRATION');
    }
    return originalPushState.call(this, state, title, url);
  };
  
  history.replaceState = function(state, title, url) {
    if (url === '/farmer-dashboard' && localStorage.getItem('FORCE_BUYER_SESSION') === 'true') {
      console.log('🔄 OVERRIDE: Redirecting farmer-dashboard to buyer-dashboard');
      url = '/buyer-dashboard';
    }
    return originalReplaceState.call(this, state, title, url);
  };
};

// 3. Monitor for incorrect redirects and fix them
window.monitorAndFix = function() {
  console.log('🔧 Starting redirect monitor...');
  
  setInterval(function() {
    const currentPath = window.location.pathname;
    const shouldBeBuyer = localStorage.getItem('FORCE_BUYER_SESSION') === 'true' || 
                         localStorage.getItem('PENDING_BUYER_REGISTRATION') === 'true';
    
    if (shouldBeBuyer && currentPath === '/farmer-dashboard') {
      console.log('🚨 DETECTED WRONG REDIRECT - FIXING NOW');
      localStorage.setItem('FORCE_BUYER_SESSION', 'true');
      localStorage.removeItem('PENDING_BUYER_REGISTRATION');
      window.location.href = '/buyer-dashboard';
    }
  }, 1000);
};

// 4. Main override function
window.activateHackathonFix = function() {
  console.log('🚀 ACTIVATING HACKATHON EMERGENCY FIX...');
  
  window.overrideBuyerRegistration();
  window.overrideNavigation();
  window.monitorAndFix();
  
  console.log('✅ HACKATHON FIX ACTIVE!');
  console.log('');
  console.log('📋 NOW TEST YOUR DEMO:');
  console.log('1. Click "Register" button');
  console.log('2. Switch to "Buyer" tab');
  console.log('3. Fill form with test data');
  console.log('4. Click "Register as Buyer"');
  console.log('5. Should go to BUYER DASHBOARD');
  console.log('');
  console.log('🆘 IF STILL FAILS, run: window.forceToBuyerDashboard()');
};

// 5. Nuclear option - force to buyer dashboard
window.forceToBuyerDashboard = function() {
  console.log('🚨 NUCLEAR OPTION: Forcing to buyer dashboard');
  localStorage.setItem('FORCE_BUYER_SESSION', 'true');
  localStorage.removeItem('PENDING_BUYER_REGISTRATION');
  window.location.href = '/buyer-dashboard';
};

// 6. Demo data helper
window.fillBuyerForm = function() {
  console.log('📝 Auto-filling buyer registration form...');
  
  setTimeout(() => {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
      if (input.name === 'businessName' || input.placeholder?.toLowerCase().includes('business')) {
        input.value = 'Hackathon Demo Business';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      } else if (input.name === 'contactPerson' || input.placeholder?.toLowerCase().includes('contact')) {
        input.value = 'Demo Buyer';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      } else if (input.name === 'email' || input.type === 'email') {
        input.value = `hackathon-${Date.now()}@demo.com`;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      } else if (input.name === 'password' || input.type === 'password') {
        input.value = 'password123';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      } else if (input.name === 'businessType' || input.placeholder?.toLowerCase().includes('type')) {
        input.value = 'Wholesaler';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      } else if (input.name === 'businessLocation' || input.placeholder?.toLowerCase().includes('location')) {
        input.value = 'Hackathon City';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      } else if (input.name === 'phoneNumber' || input.placeholder?.toLowerCase().includes('phone')) {
        input.value = '9876543210';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    console.log('✅ Form auto-filled! Now submit the form.');
  }, 500);
};

// Auto-activate the fix
console.log('🎯 AUTO-ACTIVATING HACKATHON FIX...');
window.activateHackathonFix();

console.log('');
console.log('🎉 READY FOR HACKATHON DEMO!');
console.log('');
console.log('🛠️ AVAILABLE COMMANDS:');
console.log('- window.fillBuyerForm() - Auto-fill registration form');
console.log('- window.forceToBuyerDashboard() - Force go to buyer dashboard');
console.log('- window.activateHackathonFix() - Re-activate all fixes');
console.log('');
console.log('💡 TIP: If you see farmer dashboard instead of buyer, just run:');
console.log('window.forceToBuyerDashboard()');
