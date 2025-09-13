// Simple buyer registration test
import { createUserWithEmailAndPassword, addDoc, collection } from '../Firebase/localFirebase.js';

async function testBuyerFlow() {
  try {
    console.log('🧪 Testing simple buyer flow...');
    
    // Step 1: Create user
    const auth = { /* mock auth */ };
    const result = await createUserWithEmailAndPassword(auth, 'test@buyer.com', 'password123');
    console.log('✅ User created:', result);
    
    // Step 2: Add buyer to collection
    const db = { /* mock db */ };
    const buyerData = {
      businessName: 'Test Business',
      contactPerson: 'John Doe',
      uid: result.user.uid,
      email: result.user.email
    };
    
    const docRef = await addDoc(collection(db, 'buyers'), buyerData);
    console.log('✅ Buyer added to collection:', docRef);
    
    // Step 3: Check localStorage
    const buyers = JSON.parse(localStorage.getItem('krishisettu-buyers') || '[]');
    console.log('📦 Buyers in storage:', buyers);
    
    console.log('🎯 Test completed successfully');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Export for use in console
window.testBuyerFlow = testBuyerFlow;
