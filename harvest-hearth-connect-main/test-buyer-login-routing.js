// TEST BUYER LOGIN ROUTING
// This script tests the specific login routing issue for buyers

console.log('🧪 TESTING BUYER LOGIN ROUTING FIX');
console.log('==========================================');

// Test data
const testBuyerEmail = 'test-buyer-login@krishisettu.com';
const testPassword = 'password123';
const testBuyerData = {
  businessName: 'Test Login Business',
  businessType: 'Wholesaler',
  businessLocation: 'Test City',
  contactPerson: 'Test Login Contact',
  phoneNumber: '9876543100',
  gstNumber: 'GST123LOGIN'
};

async function testBuyerLoginRouting() {
  try {
    console.log('\n📝 Step 1: Register a test buyer');
    
    // Import functions
    const { registerBuyer, loginUser } = await import('./src/Firebase/authService.js');
    
    // Register buyer
    const registerResult = await registerBuyer(testBuyerEmail, testPassword, testBuyerData);
    console.log('✅ Buyer registered successfully:', {
      hasUser: !!registerResult.user,
      hasUserData: !!registerResult.userData,
      userDataType: registerResult.userData?.userType || 'undefined'
    });
    
    // Wait for data to sync
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('\n🔐 Step 2: Test buyer login');
    
    // Attempt login
    const loginResult = await loginUser(testBuyerEmail, testPassword);
    console.log('✅ Login result:', {
      userEmail: loginResult.user?.email,
      userType: loginResult.userType,
      hasUserData: !!loginResult.userData,
      userDataBusinessName: loginResult.userData?.businessName
    });
    
    console.log('\n🎯 Step 3: Verify routing logic');
    
    if (loginResult.userType === 'buyer') {
      console.log('✅ SUCCESS: Login correctly identifies user as buyer');
      console.log('✅ Buyer dashboard routing should work correctly');
    } else {
      console.log('❌ ISSUE: Login userType is:', loginResult.userType);
      console.log('❌ This would cause incorrect routing to farmer dashboard');
      
      // Check localStorage emergency fallback
      console.log('\n🚨 Checking emergency localStorage fallback...');
      const allBuyers = JSON.parse(localStorage.getItem('krishisettu-buyers') || '[]');
      const buyerByEmail = allBuyers.find(b => b.email === testBuyerEmail);
      
      if (buyerByEmail) {
        console.log('✅ Buyer found in localStorage emergency fallback');
        console.log('✅ Emergency routing logic should catch this');
      } else {
        console.log('❌ Buyer NOT found in localStorage emergency fallback');
        console.log('❌ This is a critical issue that needs fixing');
      }
    }
    
    console.log('\n📊 Full diagnostic:');
    console.log('- Registration userData present:', !!registerResult.userData);
    console.log('- Login userType:', loginResult.userType);
    console.log('- Login userData present:', !!loginResult.userData);
    console.log('- Emergency localStorage fallback works:', 
      JSON.parse(localStorage.getItem('krishisettu-buyers') || '[]').some(b => b.email === testBuyerEmail));
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
  }
}

// Export for console use
window.testBuyerLoginRouting = testBuyerLoginRouting;

// Auto-run
console.log('\n🚀 Run: window.testBuyerLoginRouting()');
console.log('Or wait for auto-execution in 3 seconds...');

// Auto-execute after a delay
setTimeout(() => {
  console.log('\n⏰ Auto-executing test...');
  testBuyerLoginRouting();
}, 3000);
