// comprehensive-fix-test.js
import { registerFarmer, registerBuyer, loginUser } from './src/Firebase/authService.js';
import { addCrop, addAuction, addBid, getAuctions } from './src/Firebase/DBService.js';

async function testBuyerLoginRouting() {
  console.log('=== TESTING BUYER LOGIN ROUTING ===');
  
  try {
    // Clean up any existing test data
    const testEmail = 'comprehensive-buyer@test.com';
    
    // Register a new buyer
    console.log('1. Registering buyer...');
    const buyerResult = await registerBuyer(testEmail, 'password123', {
      businessName: 'Comprehensive Test Business',
      businessType: 'Retailer',
      businessLocation: 'Test City',
      contactPerson: 'Test Buyer',
      phoneNumber: '9876543299',
      gstNumber: 'GST999999'
    });
    console.log('✅ Buyer registered:', buyerResult.user.email);
    
    // Wait for data to be saved
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Login as buyer
    console.log('2. Logging in as buyer...');
    const loginResult = await loginUser(testEmail, 'password123');
    console.log('✅ Login result:', {
      email: loginResult.user.email,
      userType: loginResult.userType,
      userData: loginResult.userData ? 'Present' : 'Missing'
    });
    
    if (loginResult.userType !== 'buyer') {
      console.error('❌ BUYER LOGIN ROUTING FAILED');
      console.error(`Expected userType: "buyer", Got: "${loginResult.userType}"`);
      return false;
    }
    
    console.log('✅ BUYER LOGIN ROUTING: WORKING\n');
    return true;
    
  } catch (error) {
    console.error('❌ Buyer login routing test failed:', error.message);
    return false;
  }
}

async function testBiddingFunctionality() {
  console.log('=== TESTING BIDDING FUNCTIONALITY ===');
  
  try {
    // Create a test auction first
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
      description: 'Test wheat for bidding functionality test',
      status: 'active',
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      bids: []
    };
    
    const auctionResult = await addAuction(auctionData);
    console.log('✅ Test auction created:', auctionResult.id);
    
    // Place a bid
    console.log('2. Placing test bid...');
    const bidData = {
      bidderId: 'test-buyer-uid',
      bidderName: 'Test Bidder',
      amount: 55,
      totalAmount: 55 * 100,
      timestamp: new Date().toISOString()
    };
    
    const bidResult = await addBid(auctionResult.id, bidData);
    console.log('✅ Bid placed:', bidResult.id);
    
    // Verify auction was updated
    console.log('3. Verifying auction update...');
    const auctions = await getAuctions();
    const updatedAuction = auctions.find(a => a.id === auctionResult.id);
    
    if (updatedAuction) {
      console.log('✅ Updated auction found:', {
        cropName: updatedAuction.cropName,
        currentBid: updatedAuction.currentBid,
        bidsCount: updatedAuction.bids?.length || 0
      });
      
      if (updatedAuction.currentBid === 55 && updatedAuction.bids && updatedAuction.bids.length > 0) {
        console.log('✅ BIDDING FUNCTIONALITY: WORKING\n');
        return true;
      } else {
        console.error('❌ Auction not properly updated');
        console.error('Current bid:', updatedAuction.currentBid, 'Expected:', 55);
        console.error('Bids count:', updatedAuction.bids?.length || 0, 'Expected: > 0');
        return false;
      }
    } else {
      console.error('❌ Updated auction not found');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Bidding functionality test failed:', error.message);
    return false;
  }
}

async function runComprehensiveTest() {
  console.log('🚀 COMPREHENSIVE FIX VERIFICATION TEST\n');
  console.log('Testing both buyer login routing and bidding functionality...\n');
  
  const loginTest = await testBuyerLoginRouting();
  const biddingTest = await testBiddingFunctionality();
  
  console.log('=== FINAL RESULTS ===');
  console.log(`Buyer Login Routing: ${loginTest ? '✅ WORKING' : '❌ FAILED'}`);
  console.log(`Bidding Functionality: ${biddingTest ? '✅ WORKING' : '❌ FAILED'}`);
  
  if (loginTest && biddingTest) {
    console.log('\n🎉 ALL CRITICAL ISSUES RESOLVED!');
    console.log('✅ Buyers can now login and be routed correctly');
    console.log('✅ Buyers can now place bids in auction rooms');
  } else {
    console.log('\n⚠️ Some issues still need attention:');
    if (!loginTest) console.log('- Buyer login routing still needs fixing');
    if (!biddingTest) console.log('- Bidding functionality still needs fixing');
  }
}

// Run the test
runComprehensiveTest();
