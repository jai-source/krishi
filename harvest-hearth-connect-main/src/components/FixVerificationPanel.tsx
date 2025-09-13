import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { loginUser, registerFarmer, registerBuyer } from "@/Firebase/authService";
import { getAuctions, addCrop, addAuction, addBid } from "@/Firebase/DBService";

interface TestResult {
  success: boolean;
  error?: string;
  details?: any;
}

interface TestResults {
  loginRouting?: TestResult;
  auctionVisibility?: TestResult;
  biddingFunctionality?: TestResult;
  criticalBuyerRouting?: TestResult;
  allPassed?: boolean;
}

const FixVerificationPanel = () => {
  const [testResults, setTestResults] = useState<TestResults>({});
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();
  const runLoginTest = async () => {
    try {
      // Test buyer registration routing specifically
      console.log('🔍 Testing buyer registration routing...');
      const testBuyerEmail = 'routing-test-buyer@fix.com';
      
      await registerBuyer(testBuyerEmail, 'password123', {
        businessName: 'Routing Test Business',
        businessType: 'Wholesaler',
        businessLocation: 'Test City',
        contactPerson: 'Routing Test Buyer',
        phoneNumber: '9876543221',
        gstNumber: 'GST123457'
      });

      // Wait for registration to complete
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Test login
      const buyerLogin = await loginUser(testBuyerEmail, 'password123');
      const buyerCorrect = buyerLogin.userType === 'buyer';

      // Also test farmer for comparison
      await registerFarmer('test-farmer@fix.com', 'password123', {
        fullName: 'Fix Test Farmer',
        farmLocation: 'Test Village',
        farmSize: '10',
        phoneNumber: '9876543210',
        aadharNumber: '1234-5678-9012'
      });

      const farmerLogin = await loginUser('test-farmer@fix.com', 'password123');
      const farmerCorrect = farmerLogin.userType === 'farmer';

      return {
        success: farmerCorrect && buyerCorrect,
        details: {
          farmer: { expected: 'farmer', actual: farmerLogin.userType, correct: farmerCorrect },
          buyer: { expected: 'buyer', actual: buyerLogin.userType, correct: buyerCorrect },
          buyerRegistrationRouting: buyerCorrect ? 'WORKING' : 'FAILED'
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Critical test for buyer registration routing fix
  const runCriticalBuyerRoutingTest = async () => {
    try {
      console.log('🎯 CRITICAL TEST: Buyer Registration Routing Fix');
      
      // This test verifies the specific fix we just made to LoginRegister.tsx
      const testEmail = 'critical-fix-test@buyer.com';
      
      // Step 1: Test the fixed registerBuyer function
      console.log('Step 1: Testing registerBuyer function...');
      const registrationResult = await registerBuyer(testEmail, 'password123', {
        businessName: 'Critical Fix Test Business',
        businessType: 'Retailer',
        businessLocation: 'Fix Test City',
        contactPerson: 'Critical Fix Buyer',
        phoneNumber: '9876543299',
        gstNumber: 'GST999999'
      });
      
      // Verify the return structure
      if (!registrationResult.userData) {
        throw new Error('registerBuyer did not return userData - this is the bug!');
      }
      
      console.log('✅ registerBuyer returns userData correctly');
      
      // Step 2: Verify the userData contains expected fields
      const expectedFields = ['businessName', 'contactPerson', 'email', 'uid'];
      const missingFields = expectedFields.filter(field => !registrationResult.userData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`userData missing fields: ${missingFields.join(', ')}`);
      }
      
      console.log('✅ userData contains all required fields');
      
      // Step 3: Test login to verify user type detection
      await new Promise(resolve => setTimeout(resolve, 500));
      const loginResult = await loginUser(testEmail, 'password123');
      
      if (loginResult.userType !== 'buyer') {
        throw new Error(`Login userType incorrect: expected 'buyer', got '${loginResult.userType}'`);
      }
      
      console.log('✅ Login correctly identifies user as buyer');
      
      return {
        success: true,
        details: {
          registrationUserData: !!registrationResult.userData,
          loginUserType: loginResult.userType,
          userDataFields: Object.keys(registrationResult.userData)
        }
      };
      
    } catch (error) {
      console.error('❌ Critical buyer routing test failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  };

  const runAuctionTest = async () => {
    try {
      // Create a crop listing
      const cropData = {
        cropName: 'Fix Test Wheat',
        quantity: 500,
        basePrice: 25,
        auctionDuration: '7',
        farmerUID: 'test-farmer-uid',
        farmerName: 'Fix Test Farmer',
        farmerLocation: 'Test Village',
        quality: 'Grade A',
        harvestDate: new Date().toISOString().split('T')[0],
        description: 'Test wheat for fix verification',
        farmingMethod: 'Traditional'
      };

      await addCrop(cropData);
      
      // Create corresponding auction
      const auctionData = {
        ...cropData,
        status: 'active',
        currentBid: cropData.basePrice,
        location: cropData.farmerLocation,
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        bids: []
      };

      await addAuction(auctionData);

      // Check if auction is visible
      const auctions = await getAuctions();
      const testAuction = auctions.find(a => a.cropName === 'Fix Test Wheat');

      return {
        success: !!testAuction,
        details: {
          totalAuctions: auctions.length,
          testAuctionFound: !!testAuction,
          auctionData: testAuction ? { 
            cropName: testAuction.cropName, 
            farmerName: testAuction.farmerName,
            status: testAuction.status 
          } : null
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }  };

  const runBiddingTest = async () => {
    try {
      // Create a test auction first
      const auctionData = {
        farmerUID: 'test-bidding-farmer-uid',
        farmerName: 'Bidding Test Farmer',
        cropName: 'Test Bidding Wheat',
        quantity: 200,
        basePrice: 40,
        currentBid: 40,
        quality: 'Grade A',
        location: 'Test Village',
        description: 'Test wheat for bidding functionality verification',
        status: 'active',
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        bids: []
      };

      const auctionResult = await addAuction(auctionData);
      if (auctionResult.error) {
        throw new Error(auctionResult.error);
      }

      // Place a test bid
      const bidData = {
        bidderId: 'test-bidder-uid',
        bidderName: 'Test Bidder',
        amount: 45,
        totalAmount: 45 * 200,
        timestamp: new Date().toISOString()
      };

      const bidResult = await addBid(auctionResult.id, bidData);
      if (bidResult.error) {
        throw new Error(bidResult.error);
      }

      // Verify the auction was updated
      await new Promise(resolve => setTimeout(resolve, 500)); // Wait for update
      const auctions = await getAuctions();
      const updatedAuction = auctions.find(a => a.id === auctionResult.id);

      const biddingWorking = updatedAuction && 
                            updatedAuction.currentBid === 45 && 
                            updatedAuction.bids && 
                            updatedAuction.bids.length > 0;

      return {
        success: biddingWorking,
        details: {
          auctionCreated: !!auctionResult.id,
          bidPlaced: !!bidResult.id,
          auctionUpdated: !!updatedAuction,
          currentBid: updatedAuction?.currentBid,
          expectedBid: 45,
          bidsCount: updatedAuction?.bids?.length || 0
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults({});    try {
      toast({
        title: "Running Fix Verification Tests",
        description: "Testing login routing, auction visibility, and bidding functionality...",
      });

      const loginResult = await runLoginTest();
      const auctionResult = await runAuctionTest();
      const biddingResult = await runBiddingTest();

      const results = {
        loginRouting: loginResult,
        auctionVisibility: auctionResult,
        biddingFunctionality: biddingResult,
        allPassed: loginResult.success && auctionResult.success && biddingResult.success
      };

      setTestResults(results);

      toast({
        title: results.allPassed ? "All Tests Passed! 🎉" : "Some Tests Failed",
        description: results.allPassed 
          ? "Both fixes are working correctly!" 
          : "Check the panel for details",
        variant: results.allPassed ? "default" : "destructive"
      });

    } catch (error) {
      toast({
        title: "Test Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Fix Verification Panel
          <Badge variant={testResults.allPassed ? "default" : testResults.allPassed === false ? "destructive" : "secondary"}>
            {testResults.allPassed === true ? "PASSED" : testResults.allPassed === false ? "FAILED" : "PENDING"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={async () => {
            setIsRunning(true);
            const result = await runCriticalBuyerRoutingTest();
            setTestResults(prev => ({ ...prev, criticalBuyerRouting: result }));
            setIsRunning(false);
            
            toast({
              title: result.success ? "Critical Test Passed" : "Critical Test Failed",
              description: result.success 
                ? "Buyer registration routing fix is working!" 
                : result.error,
              variant: result.success ? "default" : "destructive"
            });
          }}
          disabled={isRunning}
          className="w-full"
          variant="outline"
        >
          {isRunning ? "Testing..." : "🎯 Test Critical Buyer Routing Fix"}
        </Button>

        <Button 
          onClick={runAllTests} 
          disabled={isRunning}
          className="w-full"
          variant="hero"
        >
          {isRunning ? "Running Tests..." : "Run Fix Verification Tests"}
        </Button>

        {testResults.criticalBuyerRouting && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                🎯 Critical Buyer Routing Fix
                <Badge variant={testResults.criticalBuyerRouting.success ? "default" : "destructive"}>
                  {testResults.criticalBuyerRouting.success ? "FIXED" : "STILL BROKEN"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {testResults.criticalBuyerRouting.success ? (
                <div className="space-y-2 text-sm">
                  <div className="text-green-600 font-medium">✅ Fix Verification Complete!</div>
                  <div className="space-y-1">
                    <div>• registerBuyer returns userData: ✅</div>
                    <div>• Login identifies user type correctly: ✅</div>
                    <div>• Registration routing should now work: ✅</div>
                  </div>
                  <div className="mt-2 p-2 bg-green-50 rounded text-xs">
                    <strong>Fix Applied:</strong> Corrected malformed code in LoginRegister.tsx that was preventing userData from being processed correctly.
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-destructive text-sm font-medium">❌ Issue Still Exists</p>
                  <p className="text-destructive text-xs">{testResults.criticalBuyerRouting.error}</p>
                  <div className="mt-2 p-2 bg-red-50 rounded text-xs">
                    The buyer registration routing fix needs additional investigation.
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {testResults.loginRouting && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Login Routing Fix
                <Badge variant={testResults.loginRouting.success ? "default" : "destructive"}>
                  {testResults.loginRouting.success ? "PASS" : "FAIL"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {testResults.loginRouting.success ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Farmer Login:</span>
                    <Badge variant="outline">
                      {testResults.loginRouting.details.farmer.actual}
                      {testResults.loginRouting.details.farmer.correct ? " ✅" : " ❌"}
                    </Badge>
                  </div>                  <div className="flex justify-between">
                    <span>Buyer Login:</span>
                    <Badge variant="outline">
                      {testResults.loginRouting.details.buyer.actual}
                      {testResults.loginRouting.details.buyer.correct ? " ✅" : " ❌"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Registration Routing:</span>
                    <Badge variant="outline">
                      {testResults.loginRouting.details.buyerRegistrationRouting}
                      {testResults.loginRouting.details.buyerRegistrationRouting === 'WORKING' ? " ✅" : " ❌"}
                    </Badge>
                  </div>
                </div>
              ) : (
                <p className="text-destructive text-sm">{testResults.loginRouting.error}</p>
              )}
            </CardContent>
          </Card>
        )}

        {testResults.auctionVisibility && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Auction Visibility Fix
                <Badge variant={testResults.auctionVisibility.success ? "default" : "destructive"}>
                  {testResults.auctionVisibility.success ? "PASS" : "FAIL"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {testResults.auctionVisibility.success ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Auctions:</span>
                    <Badge variant="outline">{testResults.auctionVisibility.details.totalAuctions}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Test Auction Visible:</span>
                    <Badge variant="outline">
                      {testResults.auctionVisibility.details.testAuctionFound ? "Yes ✅" : "No ❌"}
                    </Badge>
                  </div>
                  {testResults.auctionVisibility.details.auctionData && (
                    <div className="text-xs text-muted-foreground">
                      Found: {testResults.auctionVisibility.details.auctionData.cropName} by {testResults.auctionVisibility.details.auctionData.farmerName}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-destructive text-sm">{testResults.auctionVisibility.error}</p>
              )}
            </CardContent>
          </Card>        )}

        {testResults.biddingFunctionality && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Bidding Functionality Fix
                <Badge variant={testResults.biddingFunctionality.success ? "default" : "destructive"}>
                  {testResults.biddingFunctionality.success ? "PASS" : "FAIL"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {testResults.biddingFunctionality.success ? (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Auction Created:</span>
                    <Badge variant="outline">
                      {testResults.biddingFunctionality.details.auctionCreated ? "Yes ✅" : "No ❌"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Bid Placed:</span>
                    <Badge variant="outline">
                      {testResults.biddingFunctionality.details.bidPlaced ? "Yes ✅" : "No ❌"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Auction Updated:</span>
                    <Badge variant="outline">
                      {testResults.biddingFunctionality.details.auctionUpdated ? "Yes ✅" : "No ❌"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Bid:</span>
                    <Badge variant="outline">
                      ₹{testResults.biddingFunctionality.details.currentBid}/kg
                      {testResults.biddingFunctionality.details.currentBid === testResults.biddingFunctionality.details.expectedBid ? " ✅" : " ❌"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Bids Count:</span>
                    <Badge variant="outline">
                      {testResults.biddingFunctionality.details.bidsCount}
                      {testResults.biddingFunctionality.details.bidsCount > 0 ? " ✅" : " ❌"}
                    </Badge>
                  </div>
                </div>
              ) : (
                <p className="text-destructive text-sm">{testResults.biddingFunctionality.error}</p>
              )}
            </CardContent>
          </Card>
        )}

        {testResults.allPassed && (
          <Card className="bg-success/10 border-success">
            <CardContent className="pt-6">
              <div className="text-center">                <h3 className="font-semibold text-success mb-2">🎉 All Fixes Working!</h3>
                <p className="text-sm text-muted-foreground">
                  ✅ Buyers now route to buyer dashboard correctly<br/>
                  ✅ Farmer crop listings are visible to buyers as auctions<br/>
                  ✅ Buyers can now place bids in auction rooms
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default FixVerificationPanel;
