// Quick Issue Diagnosis Script
console.log('🔍 DIAGNOSING CURRENT ISSUES...');

async function quickDiagnosis() {
  try {
    // Test 1: Check if arrayUnion is working properly
    console.log('\n=== TEST 1: ARRAY UNION FUNCTIONALITY ===');
    const { arrayUnion } = await import('./src/Firebase/localFirebase.js');
    console.log('✅ arrayUnion imported:', typeof arrayUnion);
    
    const testUnion = arrayUnion({test: 'data'});
    console.log('✅ arrayUnion creates:', testUnion);
    
    // Test 2: Check bidding functionality specifically
    console.log('\n=== TEST 2: BIDDING FUNCTIONALITY ===');
    const { addAuction, addBid, getAuctions } = await import('./src/Firebase/DBService.js');
    
    // Clear any existing test data
    localStorage.removeItem('krishisettu-auctions');
    localStorage.removeItem('krishisettu-bids');
    
    // Create a minimal test auction
    const testAuction = {
      farmerUID: 'test-farmer',
      farmerName: 'Test Farmer',
      cropName: 'Test Crop',
      quantity: 100,
      basePrice: 50,
      currentBid: 50,
      status: 'active',
      bids: []
    };
    
    const auctionResult = await addAuction(testAuction);
    console.log('✅ Auction created:', auctionResult);
    
    if (auctionResult.error) {
      console.error('❌ Auction creation failed:', auctionResult.error);
      return;
    }
    
    // Try to place a bid
    const testBid = {
      bidderId: 'test-buyer',
      bidderName: 'Test Buyer',
      amount: 55,
      timestamp: new Date().toISOString()
    };
    
    console.log('Placing bid...');
    const bidResult = await addBid(auctionResult.id, testBid);
    console.log('✅ Bid result:', bidResult);
    
    if (bidResult.error) {
      console.error('❌ BIDDING FAILED:', bidResult.error);
      return;
    }
    
    // Check if auction was updated
    const auctions = await getAuctions();
    const updatedAuction = auctions.find(a => a.id === auctionResult.id);
    
    if (updatedAuction) {
      console.log('✅ Updated auction:', {
        currentBid: updatedAuction.currentBid,
        bidsCount: updatedAuction.bids?.length || 0
      });
      
      if (updatedAuction.currentBid === 55 && updatedAuction.bids?.length > 0) {
        console.log('✅ BIDDING: WORKING CORRECTLY');
      } else {
        console.log('❌ BIDDING: PARTIALLY BROKEN');
        console.log('Expected currentBid: 55, Got:', updatedAuction.currentBid);
        console.log('Expected bids count: > 0, Got:', updatedAuction.bids?.length || 0);
      }
    } else {
      console.error('❌ BIDDING: COMPLETELY BROKEN - auction not found after bid');
    }
    
    // Test 3: User name display issue
    console.log('\n=== TEST 3: USER NAME DISPLAY ===');
    
    // Clear previous data
    localStorage.removeItem('krishisettu-buyers');
    localStorage.removeItem('krishisettu-current-user');
    
    const { registerBuyer } = await import('./src/Firebase/authService.js');
    
    // Register a buyer with the name "Garv"
    const testEmail = `garv-${Date.now()}@test.com`;
    const buyerData = {
      businessName: 'Garv Test Business',
      contactPerson: 'Garv',
      businessType: 'Retailer',
      businessLocation: 'Test City',
      phoneNumber: '9876543210'
    };
    
    console.log('Registering buyer with contactPerson: "Garv"...');
    const regResult = await registerBuyer(testEmail, 'password123', buyerData);
    console.log('✅ Registration result:', regResult);
    
    if (regResult.userData) {
      const displayName = regResult.userData.fullName || regResult.userData.businessName || regResult.userData.contactPerson;
      console.log('✅ Display name would be:', displayName);
      
      if (displayName === 'Garv' || displayName === 'Garv Test Business') {
        console.log('✅ USER NAME: WORKING CORRECTLY');
      } else {
        console.log('❌ USER NAME: INCORRECT');
        console.log('Expected: "Garv" or "Garv Test Business"');
        console.log('Got:', displayName);
        console.log('Full userData:', regResult.userData);
      }
    } else {
      console.error('❌ USER NAME: No userData returned from registration');
    }
    
    console.log('\n🎯 DIAGNOSIS COMPLETE');
    
  } catch (error) {
    console.error('❌ Diagnosis failed:', error);
  }
}

// Make available globally
window.quickDiagnosis = quickDiagnosis;

console.log('💡 Run: window.quickDiagnosis() to test issues');
