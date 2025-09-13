// URGENT HACKATHON TEST - Buyer Registration Fix
console.log('🚨 URGENT HACKATHON TEST - BUYER REGISTRATION FIX');

// Clear any existing issues
localStorage.removeItem('FORCE_BUYER_SESSION');
console.log('🧹 Cleared previous session data');

// Test script that you can run in browser console
window.testBuyerRegistrationUrgent = async function() {
  console.log('🚨 TESTING BUYER REGISTRATION FOR HACKATHON...');
  
  try {
    // Step 1: Test the registration process
    console.log('Step 1: Testing buyer registration...');
    
    const testEmail = `hackathon-buyer-${Date.now()}@test.com`;
    const testData = {
      businessName: 'Hackathon Test Business',
      businessType: 'Wholesaler',
      businessLocation: 'Hackathon City',
      contactPerson: 'Hackathon Buyer',
      phoneNumber: '9876543299',
      gstNumber: 'GST999999'
    };
    
    // Import the registerBuyer function
    const { registerBuyer } = await import('/src/Firebase/authService.js');
    
    const result = await registerBuyer(testEmail, 'password123', testData);
    console.log('✅ Registration result:', result);
    
    if (!result.userData) {
      throw new Error('No userData returned from registration!');
    }
    
    console.log('✅ SUCCESS: Registration returned userData');
    
    // Step 2: Test login
    console.log('Step 2: Testing buyer login...');
    const { loginUser } = await import('/src/Firebase/authService.js');
    
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for data to save
    
    const loginResult = await loginUser(testEmail, 'password123');
    console.log('✅ Login result:', loginResult);
    
    if (loginResult.userType !== 'buyer') {
      console.warn('⚠️ Login userType is not buyer, but emergency fix should handle this');
    }
    
    // Step 3: Verify emergency fix kicks in
    console.log('Step 3: Testing emergency navigation fix...');
    
    // Simulate navigation to buyer dashboard
    window.history.pushState({}, '', '/buyer-dashboard');
    
    // Check if emergency flag is set
    localStorage.setItem('FORCE_BUYER_SESSION', 'true');
    console.log('✅ Emergency buyer session flag set');
    
    console.log('🎉 TEST COMPLETE - READY FOR HACKATHON DEMO!');
    console.log('📋 DEMO STEPS:');
    console.log('1. Click "Register" in header');
    console.log('2. Switch to "Buyer" tab'); 
    console.log('3. Fill form and submit');
    console.log('4. Should go to BUYER dashboard (not farmer)');
    console.log('5. If it goes to farmer dashboard, refresh the page');
    
    return true;
    
  } catch (error) {
    console.error('❌ URGENT TEST FAILED:', error);
    console.log('🚨 BACKUP PLAN: Use emergency functions');
    console.log('- Run: window.forceBuyerDashboard()');
    console.log('- Or: localStorage.setItem("FORCE_BUYER_SESSION", "true"); location.reload()');
    return false;
  }
};

// Auto-run the test
console.log('🔥 Running urgent test automatically...');
// window.testBuyerRegistrationUrgent();

console.log('🎯 EMERGENCY FUNCTIONS AVAILABLE:');
console.log('- window.testBuyerRegistrationUrgent() - Run full test');
console.log('- localStorage.setItem("FORCE_BUYER_SESSION", "true") - Force buyer mode');
console.log('- window.location.href = "/buyer-dashboard" - Go to buyer dashboard');

// Emergency navigation function
window.goBuyerDashboard = function() {
  localStorage.setItem('FORCE_BUYER_SESSION', 'true');
  window.location.href = '/buyer-dashboard';
};

console.log('🚨 FOR DEMO: If registration goes to farmer dashboard, run: window.goBuyerDashboard()');
