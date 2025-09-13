// Test script to verify buyer registration
import { registerBuyer } from './src/Firebase/authService.js';

async function testBuyerRegistration() {
  try {
    console.log('Testing buyer registration...');
    
    const result = await registerBuyer('test-buyer@example.com', 'password123', {
      businessName: 'Test Business',
      businessType: 'Retail',
      businessLocation: 'Test City',
      contactPerson: 'John Doe',
      phoneNumber: '1234567890',
      gstNumber: 'GST123456'
    });
    
    console.log('Registration successful:', result);
    
    // Check localStorage
    const buyers = JSON.parse(localStorage.getItem('krishisettu-buyers') || '[]');
    console.log('Buyers in localStorage:', buyers);
    
  } catch (error) {
    console.error('Registration failed:', error);
  }
}

// Run test
testBuyerRegistration();
