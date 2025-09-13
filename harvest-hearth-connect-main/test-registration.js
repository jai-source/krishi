// Complete end-to-end test for registration functionality
console.log('🧪 Starting comprehensive registration tests...');

// Import the functions we need to test
import { registerFarmer, registerBuyer, loginUser } from './src/Firebase/authService.js';

async function runTests() {
  console.log('\n=== TESTING FARMER REGISTRATION ===');
  
  try {
    // Test farmer registration
    const farmerResult = await registerFarmer('farmer@test.com', 'password123', {
      fullName: 'Test Farmer',
      farmLocation: 'Test Village',
      farmSize: '10 acres',
      phoneNumber: '9876543210',
      aadharNumber: '1234-5678-9012'
    });
    
    console.log('✅ Farmer registration successful:', farmerResult);
    
    // Check localStorage for farmers
    const farmers = JSON.parse(localStorage.getItem('krishisettu-farmers') || '[]');
    console.log('📦 Farmers in localStorage:', farmers);
    
  } catch (error) {
    console.error('❌ Farmer registration failed:', error);
  }
  
  console.log('\n=== TESTING BUYER REGISTRATION ===');
  
  try {
    // Test buyer registration
    const buyerResult = await registerBuyer('buyer@test.com', 'password123', {
      businessName: 'Test Business',
      businessType: 'Wholesale',
      businessLocation: 'Test City',
      contactPerson: 'Test Contact',
      phoneNumber: '9876543210',
      gstNumber: 'GST123456'
    });
    
    console.log('✅ Buyer registration successful:', buyerResult);
    
    // Check localStorage for buyers
    const buyers = JSON.parse(localStorage.getItem('krishisettu-buyers') || '[]');
    console.log('📦 Buyers in localStorage:', buyers);
    
  } catch (error) {
    console.error('❌ Buyer registration failed:', error);
  }
  
  console.log('\n=== TESTING LOGIN FOR FARMER ===');
  
  try {
    const farmerLogin = await loginUser('farmer@test.com', 'password123');
    console.log('✅ Farmer login successful:', farmerLogin);
  } catch (error) {
    console.error('❌ Farmer login failed:', error);
  }
  
  console.log('\n=== TESTING LOGIN FOR BUYER ===');
  
  try {
    const buyerLogin = await loginUser('buyer@test.com', 'password123');
    console.log('✅ Buyer login successful:', buyerLogin);
  } catch (error) {
    console.error('❌ Buyer login failed:', error);
  }
  
  console.log('\n=== TESTING COMPLETE ===');
}

// Clean up function
function clearAllData() {
  localStorage.removeItem('krishisettu-farmers');
  localStorage.removeItem('krishisettu-buyers');
  localStorage.removeItem('krishisettu-current-user');
  localStorage.removeItem('krishisettu-all-users');
  console.log('🧹 All test data cleared');
}

// Run tests
runTests().then(() => {
  console.log('🎯 All tests completed');
});
