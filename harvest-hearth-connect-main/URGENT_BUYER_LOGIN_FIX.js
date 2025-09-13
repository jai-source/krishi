// URGENT BUYER LOGIN FIX TEST
console.log('🚀 TESTING URGENT BUYER LOGIN FIX');

// Quick test function
window.testBuyerLoginFix = async function() {
  try {
    console.log('1. Testing buyer registration...');
    
    // Import functions dynamically
    const { registerBuyer, loginUser } = await import('./src/Firebase/authService.js');
    
    const testEmail = 'urgent-fix-test@buyer.com';
    const testData = {
      businessName: 'Urgent Fix Test Business',
      businessType: 'Retailer',
      businessLocation: 'Test City',
      contactPerson: 'Urgent Buyer',
      phoneNumber: '9876543999',
      gstNumber: 'GST999URGENT'
    };
    
    // Register buyer
    const regResult = await registerBuyer(testEmail, 'password123', testData);
    console.log('✅ Registration result:', regResult);
    
    // Check localStorage
    const buyers = JSON.parse(localStorage.getItem('krishisettu-buyers') || '[]');
    console.log('✅ Buyers in localStorage:', buyers.length);
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('2. Testing buyer login...');
    
    // Login as buyer
    const loginResult = await loginUser(testEmail, 'password123');
    console.log('✅ Login result:', {
      userType: loginResult.userType,
      hasUserData: !!loginResult.userData,
      userData: loginResult.userData
    });
    
    if (loginResult.userType === 'buyer') {
      console.log('🎉 SUCCESS: Buyer login routing is FIXED!');
      return true;
    } else {
      console.log('❌ ISSUE: Login userType is:', loginResult.userType);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
};

// Quick dashboard force function for emergencies
window.forceBuyerDashboardNow = function() {
  localStorage.setItem('FORCE_BUYER_SESSION', 'true');
  window.location.href = '/buyer-dashboard';
};

console.log('');
console.log('🚀 EMERGENCY FUNCTIONS READY:');
console.log('- window.testBuyerLoginFix() - Test the login fix');
console.log('- window.forceBuyerDashboardNow() - Force go to buyer dashboard');
console.log('');
console.log('🎯 FOR HACKATHON: If login still fails, run: window.forceBuyerDashboardNow()');
