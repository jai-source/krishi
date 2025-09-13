// debug-buyer-registration.js
// Standalone test for buyer registration routing issue

import { registerBuyer } from './src/Firebase/authService.js';

async function debugBuyerRegistration() {
  console.log('🔍 DEBUG: Testing buyer registration routing issue');
  
  try {
    const testEmail = 'debug-buyer-routing@test.com';
    const testPassword = 'password123';
    const buyerData = {
      businessName: 'Debug Test Business',
      businessType: 'Retailer',
      businessLocation: 'Test City',
      contactPerson: 'Debug Buyer',
      phoneNumber: '9876543299',
      gstNumber: 'GST999999'
    };
    
    console.log('🔍 Attempting buyer registration with data:', buyerData);
    
    const result = await registerBuyer(testEmail, testPassword, buyerData);
    
    console.log('✅ Registration result:', {
      hasUser: !!result.user,
      userEmail: result.user?.email,
      hasBuyerId: !!result.buyerId,
      hasUserData: !!result.userData,
      userDataType: result.userData ? typeof result.userData : 'undefined',
      userDataKeys: result.userData ? Object.keys(result.userData) : []
    });
    
    if (result.userData) {
      console.log('✅ User data contents:', result.userData);
    } else {
      console.error('❌ No userData returned from registration!');
    }
    
    // Test storage
    const buyers = JSON.parse(localStorage.getItem('krishisettu-buyers') || '[]');
    const newBuyer = buyers.find(b => b.email === testEmail);
    
    console.log('✅ Storage check:', {
      totalBuyers: buyers.length,
      newBuyerFound: !!newBuyer,
      newBuyerData: newBuyer
    });
    
  } catch (error) {
    console.error('❌ Debug test failed:', error.message);
  }
}

// Run the debug test
debugBuyerRegistration();
