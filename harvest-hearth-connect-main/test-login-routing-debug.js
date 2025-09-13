// test-login-routing-debug.js
import { loginUser, registerFarmer, registerBuyer } from './src/Firebase/authService.js';

async function debugLoginRouting() {
  console.log('=== DEBUGGING LOGIN ROUTING ISSUE ===\n');
  
  try {
    // First, register a buyer
    console.log('1. Registering a test buyer...');
    const buyerResult = await registerBuyer('debug-buyer@test.com', 'password123', {
      businessName: 'Debug Test Business',
      businessType: 'Wholesaler',
      businessLocation: 'Debug City',
      contactPerson: 'Debug Buyer',
      phoneNumber: '9876543221',
      gstNumber: 'GST123457'
    });
    console.log('✅ Buyer registered:', buyerResult);
    
    // Wait a moment for data to be saved
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Now try to login as buyer
    console.log('\n2. Attempting to login as buyer...');
    const loginResult = await loginUser('debug-buyer@test.com', 'password123');
    console.log('✅ Login result:', {
      user: loginResult.user.email,
      userType: loginResult.userType,
      userData: loginResult.userData ? 'Present' : 'Missing',
      userDataDetails: loginResult.userData
    });
    
    if (loginResult.userType !== 'buyer') {
      console.error('❌ CRITICAL ERROR: Expected userType "buyer", got:', loginResult.userType);
      console.error('❌ This confirms the buyer login routing issue exists');
      return false;
    }
    
    console.log('✅ Login routing appears to be working correctly');
    return true;
    
  } catch (error) {
    console.error('❌ Debug test failed:', error.message);
    return false;
  }
}

// Run the debug test
debugLoginRouting().then(success => {
  if (success) {
    console.log('\n🎉 LOGIN ROUTING: Working correctly');
  } else {
    console.log('\n❌ LOGIN ROUTING: Issue confirmed - needs fix');
  }
});
