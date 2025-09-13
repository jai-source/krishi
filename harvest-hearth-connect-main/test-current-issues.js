// Test script to verify current issues
console.log('🧪 TESTING CURRENT ISSUES');

// Test bidding functionality
async function testBiddingFunctionality() {
  console.log('\n=== TESTING BIDDING FUNCTIONALITY ===');
  
  try {
    // Import functions
    const { addAuction, addBid, getAuctions } = await import('./src/Firebase/DBService.js');
    
    // 1. Create a test auction
    console.log('1. Creating test auction...');
    const auctionData = {
      farmerUID: 'test-farmer-uid',
      farmerName: 'Test Farmer',
      cropName: 'Test Bidding Wheat',
      quantity: 100,
      basePrice: 50,
      currentBid: 50,
      quality: 'Grade A',
      location: 'Test Village',
      description: 'Test wheat for bidding verification',
      status: 'active',
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      bids: []
    };
    
    const auctionResult = await addAuction(auctionData);
    console.log('✅ Test auction created:', auctionResult);
    
    // 2. Place a test bid
    console.log('2. Placing test bid...');
    const bidData = {
      bidderId: 'test-buyer-uid',
      bidderName: 'Test Bidder',
      amount: 55,
      totalAmount: 55 * 100,
      timestamp: new Date().toISOString()
    };
    
    const bidResult = await addBid(auctionResult.id, bidData);
    console.log('✅ Bid result:', bidResult);
    
    if (bidResult.error) {
      console.error('❌ Bidding failed:', bidResult.error);
      return false;
    }
    
    // 3. Verify auction was updated
    console.log('3. Verifying auction update...');
    const auctions = await getAuctions();
    const updatedAuction = auctions.find(a => a.id === auctionResult.id);
    
    if (updatedAuction) {
      console.log('✅ Updated auction found:', {
        currentBid: updatedAuction.currentBid,
        bidsCount: updatedAuction.bids?.length || 0,
        expectedCurrentBid: 55,
        expectedBidsCount: 1
      });
      
      if (updatedAuction.currentBid === 55 && updatedAuction.bids && updatedAuction.bids.length > 0) {
        console.log('✅ BIDDING FUNCTIONALITY: WORKING');
        return true;
      } else {
        console.error('❌ BIDDING FUNCTIONALITY: BROKEN');
        console.error('Current bid:', updatedAuction.currentBid, 'Expected:', 55);
        console.error('Bids count:', updatedAuction.bids?.length || 0, 'Expected: > 0');
        return false;
      }
    } else {
      console.error('❌ Updated auction not found');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Bidding test failed:', error.message);
    return false;
  }
}

// Test user name display
async function testUserNameDisplay() {
  console.log('\n=== TESTING USER NAME DISPLAY ===');
  
  try {
    // Import functions
    const { registerBuyer, loginUser } = await import('./src/Firebase/authService.js');
    
    // 1. Clear any existing data
    localStorage.removeItem('krishisettu-current-user');
    localStorage.removeItem('krishisettu-buyers');
    
    // 2. Register a buyer with a specific name
    console.log('1. Registering buyer with name "Garv"...');
    const testEmail = `garv-test-${Date.now()}@test.com`;
    const buyerData = {
      businessName: 'Garv Business Corp',
      businessType: 'Retailer',
      businessLocation: 'Test City',
      contactPerson: 'Garv',
      phoneNumber: '9876543210',
      gstNumber: 'GST123456'
    };
    
    const registrationResult = await registerBuyer(testEmail, 'password123', buyerData);
    console.log('✅ Registration result:', registrationResult);
    
    // 3. Check what's stored
    const storedBuyers = JSON.parse(localStorage.getItem('krishisettu-buyers') || '[]');
    const storedUser = JSON.parse(localStorage.getItem('krishisettu-current-user') || 'null');
    
    console.log('📦 Stored buyer data:', storedBuyers[storedBuyers.length - 1]);
    console.log('📦 Current user data:', storedUser);
    
    // 4. Test login to see what name is displayed
    console.log('2. Testing login...');
    const loginResult = await loginUser(testEmail, 'password123');
    console.log('✅ Login result userData:', loginResult.userData);
    
    // 5. Check what name would be displayed
    const displayName = loginResult.userData?.fullName || loginResult.userData?.businessName || loginResult.userData?.contactPerson;
    console.log('🎯 Display name would be:', displayName);
    
    if (displayName === 'Garv' || displayName === 'Garv Business Corp') {
      console.log('✅ USER NAME DISPLAY: CORRECT');
      return true;
    } else {
      console.error('❌ USER NAME DISPLAY: INCORRECT');
      console.error('Expected: "Garv" or "Garv Business Corp", Got:', displayName);
      return false;
    }
    
  } catch (error) {
    console.error('❌ User name test failed:', error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting comprehensive issue testing...\n');
  
  const biddingWorks = await testBiddingFunctionality();
  const userNameWorks = await testUserNameDisplay();
  
  console.log('\n📊 TEST RESULTS:');
  console.log('Bidding Functionality:', biddingWorks ? '✅ WORKING' : '❌ BROKEN');
  console.log('User Name Display:', userNameWorks ? '✅ WORKING' : '❌ BROKEN');
  
  if (!biddingWorks || !userNameWorks) {
    console.log('\n🔧 ISSUES FOUND - FIXES NEEDED:');
    if (!biddingWorks) {
      console.log('- Fix bidding functionality');
    }
    if (!userNameWorks) {
      console.log('- Fix user name display');
    }
  } else {
    console.log('\n🎉 ALL TESTS PASSED - NO FIXES NEEDED');
  }
}

// Export for use in browser console
window.testCurrentIssues = runAllTests;
window.testBidding = testBiddingFunctionality;
window.testUserName = testUserNameDisplay;

// Auto-run if not in browser
if (typeof window === 'undefined') {
  runAllTests();
}
