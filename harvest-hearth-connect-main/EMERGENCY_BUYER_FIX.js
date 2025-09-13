// EMERGENCY BUYER ROUTING FIX
// This fixes the buyer registration routing issue for the hackathon presentation

console.log('🚨 EMERGENCY BUYER ROUTING FIX LOADING...');

// Override the navigation behavior after registration
window.FORCE_BUYER_ROUTING = true;

// Store the original navigate function
let originalNavigate = null;

// Function to force buyer routing
function forceBuyerRouting() {
  // Check if we're on the buyer dashboard but being redirected
  if (window.location.pathname === '/buyer-dashboard') {
    console.log('🎯 Detected buyer dashboard access - preventing farmer redirect');
    
    // Store that this should be a buyer session
    localStorage.setItem('FORCE_BUYER_SESSION', 'true');
    sessionStorage.setItem('CURRENT_USER_TYPE', 'buyer');
  }
}

// Override the React Router navigate function
function interceptNavigation() {
  // This will run after React loads
  setTimeout(() => {
    try {
      // Force buyer routing if we're registering as buyer
      const forceAsBuyer = localStorage.getItem('FORCE_BUYER_SESSION');
      const urlPath = window.location.pathname;
      
      if (forceAsBuyer === 'true' && urlPath === '/farmer-dashboard') {
        console.log('🔄 EMERGENCY FIX: Redirecting from farmer dashboard to buyer dashboard');
        window.history.replaceState({}, '', '/buyer-dashboard');
        window.location.reload();
      }
    } catch (error) {
      console.error('Navigation intercept error:', error);
    }
  }, 1000);
}

// Patch the AuthContext behavior
function patchAuthContext() {
  // Override user type detection for emergency fix
  const originalSetUserType = localStorage.setItem;
  localStorage.setItem = function(key, value) {
    if (key === 'krishisettu-current-user' && window.FORCE_BUYER_ROUTING) {
      try {
        const userData = JSON.parse(value);
        if (userData && userData.businessName) {
          console.log('🎯 EMERGENCY FIX: Detected buyer registration, forcing buyer type');
          userData.userType = 'buyer';
          value = JSON.stringify(userData);
        }
      } catch (e) {
        // Ignore JSON parse errors
      }
    }
    return originalSetUserType.call(this, key, value);
  };
}

// Emergency registration override
function emergencyRegistrationFix() {
  // Override registerBuyer to always work correctly
  setTimeout(() => {
    if (window.registerBuyer) {
      const originalRegisterBuyer = window.registerBuyer;
      window.registerBuyer = async function(...args) {
        console.log('🚨 EMERGENCY: Intercepting buyer registration');
        
        try {
          const result = await originalRegisterBuyer(...args);
          
          // Force set the user as buyer
          localStorage.setItem('FORCE_BUYER_SESSION', 'true');
          sessionStorage.setItem('CURRENT_USER_TYPE', 'buyer');
          
          // Ensure userData is returned
          if (!result.userData && result.user) {
            result.userData = {
              uid: result.user.uid,
              email: result.user.email,
              userType: 'buyer',
              businessName: args[2]?.businessName || 'Emergency Buyer',
              contactPerson: args[2]?.contactPerson || 'Emergency Contact'
            };
          }
          
          console.log('🎯 EMERGENCY: Fixed buyer registration result:', result);
          
          // Force navigate to buyer dashboard after a short delay
          setTimeout(() => {
            if (window.location.pathname !== '/buyer-dashboard') {
              console.log('🔄 EMERGENCY: Force navigating to buyer dashboard');
              window.history.pushState({}, '', '/buyer-dashboard');
              window.location.reload();
            }
          }, 500);
          
          return result;
        } catch (error) {
          console.error('🚨 EMERGENCY: Registration error:', error);
          throw error;
        }
      };
    }
  }, 2000);
}

// Function to clear emergency overrides
function clearEmergencyFix() {
  localStorage.removeItem('FORCE_BUYER_SESSION');
  sessionStorage.removeItem('CURRENT_USER_TYPE');
  window.FORCE_BUYER_ROUTING = false;
  console.log('🧹 Emergency fix cleared');
}

// Run all fixes
forceBuyerRouting();
interceptNavigation();
patchAuthContext();
emergencyRegistrationFix();

// Add global functions for manual control
window.clearEmergencyFix = clearEmergencyFix;
window.forceBuyerDashboard = function() {
  localStorage.setItem('FORCE_BUYER_SESSION', 'true');
  window.history.pushState({}, '', '/buyer-dashboard');
  window.location.reload();
};

console.log('🎯 EMERGENCY BUYER ROUTING FIX ACTIVE!');
console.log('📋 For manual control:');
console.log('- window.forceBuyerDashboard() - Force go to buyer dashboard');
console.log('- window.clearEmergencyFix() - Clear all emergency fixes');

// Auto-clear after 2 hours (for demo safety)
setTimeout(() => {
  console.log('⏰ Auto-clearing emergency fix after 2 hours');
  clearEmergencyFix();
}, 2 * 60 * 60 * 1000);
