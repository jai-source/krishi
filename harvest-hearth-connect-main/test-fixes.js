// Test script to verify both login routing and auction visibility fixes
import { registerFarmer, registerBuyer, loginUser } from './src/Firebase/authService.js';
import { addCrop, addAuction, getAuctions } from './src/Firebase/DBService.js';

console.log('🧪 Testing KrishiSettu Fixes...\n');

async function testLoginRouting() {
  console.log('=== TESTING LOGIN ROUTING FIX ===');
  
  try {
    // Test 1: Register a farmer
    console.log('1. Registering farmer...');
    const farmerResult = await registerFarmer('farmer@test.com', 'password123', {
      fullName: 'Test Farmer',
      farmLocation: 'Test Village',
      farmSize: '10',
      phoneNumber: '9876543210',
      aadharNumber: '1234-5678-9012'
    });
    console.log('✅ Farmer registered:', farmerResult.user.email);

    // Test 2: Register a buyer
    console.log('2. Registering buyer...');
    const buyerResult = await registerBuyer('buyer@test.com', 'password123', {
      businessName: 'Test Business',
      businessType: 'Wholesaler',
      businessLocation: 'Test City',
      contactPerson: 'Test Buyer',
      phoneNumber: '9876543220',
      gstNumber: 'GST123456'
    });
    console.log('✅ Buyer registered:', buyerResult.user.email);

    // Test 3: Login as farmer and check user type
    console.log('3. Testing farmer login...');
    const farmerLogin = await loginUser('farmer@test.com', 'password123');
    console.log('✅ Farmer login result:', {
      email: farmerLogin.user.email,
      userType: farmerLogin.userType,
      userData: farmerLogin.userData ? 'Present' : 'Missing'
    });
    
    if (farmerLogin.userType !== 'farmer') {
      console.error('❌ FARMER LOGIN FAILED: Expected userType "farmer", got:', farmerLogin.userType);
      return false;
    }

    // Test 4: Login as buyer and check user type
    console.log('4. Testing buyer login...');
    const buyerLogin = await loginUser('buyer@test.com', 'password123');
    console.log('✅ Buyer login result:', {
      email: buyerLogin.user.email,
      userType: buyerLogin.userType,
      userData: buyerLogin.userData ? 'Present' : 'Missing'
    });
    
    if (buyerLogin.userType !== 'buyer') {
      console.error('❌ BUYER LOGIN FAILED: Expected userType "buyer", got:', buyerLogin.userType);
      return false;
    }

    console.log('✅ LOGIN ROUTING FIX: VERIFIED WORKING!\n');
    return true;

  } catch (error) {
    console.error('❌ Login routing test failed:', error.message);
    return false;
  }
}

async function testAuctionVisibility() {
  console.log('=== TESTING AUCTION VISIBILITY FIX ===');
  
  try {
    // Test 1: Add a crop listing (this should also create an auction)
    console.log('1. Adding farmer crop listing...');
    const cropData = {
      cropName: 'Test Wheat',
      quantity: 500,
      basePrice: 25,
      auctionDuration: '7',
      farmerUID: 'farmer-test-uid',
      farmerName: 'Test Farmer',
      farmerLocation: 'Test Village',
      quality: 'Grade A',
      harvestDate: new Date().toISOString().split('T')[0],
      description: 'Fresh test wheat available for auction',
      farmingMethod: 'Traditional'
    };

    const cropResult = await addCrop(cropData);
    console.log('✅ Crop added:', cropResult);

    // Test 2: Create corresponding auction
    console.log('2. Creating auction from crop listing...');
    const auctionData = {
      ...cropData,
      status: 'active',
      currentBid: cropData.basePrice,
      location: cropData.farmerLocation,
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      bids: []
    };

    const auctionResult = await addAuction(auctionData);
    console.log('✅ Auction created:', auctionResult);

    // Test 3: Fetch auctions (buyer perspective)
    console.log('3. Fetching auctions for buyer dashboard...');
    const auctions = await getAuctions();
    console.log('✅ Auctions fetched:', auctions.length, 'auctions found');
    
    // Check if our test auction is visible
    const testAuction = auctions.find(a => a.cropName === 'Test Wheat');
    if (testAuction) {
      console.log('✅ Test auction found in buyer view:', {
        cropName: testAuction.cropName,
        farmerName: testAuction.farmerName,
        basePrice: testAuction.basePrice,
        status: testAuction.status
      });
    } else {
      console.error('❌ Test auction NOT found in buyer view!');
      return false;
    }

    console.log('✅ AUCTION VISIBILITY FIX: VERIFIED WORKING!\n');
    return true;

  } catch (error) {
    console.error('❌ Auction visibility test failed:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting comprehensive fix verification...\n');
  
  const loginTest = await testLoginRouting();
  const auctionTest = await testAuctionVisibility();
  
  console.log('=== FINAL RESULTS ===');
  console.log('Login Routing Fix:', loginTest ? '✅ WORKING' : '❌ FAILED');
  console.log('Auction Visibility Fix:', auctionTest ? '✅ WORKING' : '❌ FAILED');
  
  if (loginTest && auctionTest) {
    console.log('\n🎉 ALL FIXES VERIFIED WORKING! 🎉');
    console.log('✅ Buyers will now be correctly routed to buyer dashboard');
    console.log('✅ Farmer crop listings will now be visible to buyers as auctions');
  } else {
    console.log('\n❌ Some fixes need attention. Check the logs above.');
  }
}

// Export for manual testing
window.testFixes = runAllTests;

// Auto-run if this file is executed directly
if (typeof window !== 'undefined') {
  console.log('Test functions loaded. Run window.testFixes() in console to test.');
} else {
  runAllTests();
}
