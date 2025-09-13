import { useEffect, useState } from "react";
import { translateText } from "@/lib/googleTranslate";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, MapPin, Clock, Gavel, Star } from "lucide-react";
import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { getAuctions, addBuyer } from "@/Firebase/DBService";

const BuyerDashboard = () => {
  const { toast } = useToast();
  const { t, currentLanguage } = useLanguage();
  const { currentUser, userData, userType } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isRegistered, setIsRegistered] = useState(false);
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myBids] = useState([
    {
      id: 1,
      cropName: "Organic Wheat",
      myBid: "₹26/kg",
      currentBid: "₹27/kg",
      status: "outbid",
      timeLeft: "1d 12h"
    },
    {
      id: 2,
      cropName: "Fresh Tomatoes",
      myBid: "₹15/kg",
      currentBid: "₹15/kg",
      status: "winning",
      timeLeft: "5d 8h"
    }
  ]);

  // Check authentication and user type
  useEffect(() => {
    const navigationState = location.state as any;
    
    console.log('🔍 BuyerDashboard useEffect triggered:', {
      currentUser: !!currentUser,
      userType,
      userData: !!userData,
      userEmail: currentUser?.email,
      navigationState,
      pathname: location.pathname
    });
    
    if (!currentUser) {
      console.log('🔍 No current user, redirecting to home');
      navigate("/");
      return;
    }

    // EMERGENCY FIX: Always assume this is a buyer if they're on buyer dashboard
    const isOnBuyerDashboard = location.pathname === '/buyer-dashboard';
    const forceAsBuyer = localStorage.getItem('FORCE_BUYER_SESSION') === 'true';
    const emergencyCurrentUser = JSON.parse(localStorage.getItem('krishisettu-current-user') || 'null');
    
    console.log('🔍 Emergency routing checks:', {
      isOnBuyerDashboard,
      forceAsBuyer,
      emergencyCurrentUser: !!emergencyCurrentUser,
      emergencyUserType: emergencyCurrentUser?.userType
    });
    
    if (isOnBuyerDashboard || forceAsBuyer || emergencyCurrentUser?.userType === 'buyer') {
      console.log('🚨 EMERGENCY FIX: User is on buyer dashboard - treating as buyer');
      setIsRegistered(true);
      setLoading(false);
      return;
    }
    
    // Check if user just registered as buyer (from navigation state) - HIGHEST PRIORITY
    if (navigationState?.justRegistered && navigationState?.userType === "buyer") {
      console.log('✅ User just registered as buyer (from navigation state) - HIGHEST PRIORITY');
      setIsRegistered(true);
      setLoading(false);
      
      // Store emergency flag to prevent future redirects
      localStorage.setItem('FORCE_BUYER_SESSION', 'true');
      
      // Clear the navigation state to avoid confusion on refresh
      navigate(location.pathname, { replace: true, state: null });
      return;
    }
    
    // Check for userData indicating buyer (SECOND PRIORITY)
    if (userData && (userData.businessName || userData.gstNumber || userData.contactPerson)) {
      console.log('✅ User data indicates buyer (businessName/gstNumber found)');
      setIsRegistered(true);
      setLoading(false);
      localStorage.setItem('FORCE_BUYER_SESSION', 'true');
      return;
    }
    
    // Fix: Check for buyer user type and set registration status (THIRD PRIORITY)
    if (userType === "buyer") {
      console.log('✅ User confirmed as buyer by AuthContext');
      setIsRegistered(true);
      setLoading(false);
      localStorage.setItem('FORCE_BUYER_SESSION', 'true');
      return;
    } 
    
    // Only redirect to farmer dashboard if we're absolutely sure they're a farmer
    if (userType === "farmer" && userData && userData.fullName && !userData.businessName) {
      console.log('🔄 User is definitely a farmer (has fullName, no businessName), redirecting to farmer dashboard');
      navigate("/farmer-dashboard");
      return;
    } 
    
    // If userType is null/undefined, wait but don't redirect (LOWEST PRIORITY)
    if (userType === null || userType === undefined) {
      console.log('⚠️ User type is null/undefined, waiting for auth context to update...');
      // But if they're already on buyer dashboard, assume they're a buyer
      if (location.pathname === '/buyer-dashboard') {
        console.log('🎯 User is on buyer dashboard with null userType - assuming buyer');
        setIsRegistered(true);
        setLoading(false);
        localStorage.setItem('FORCE_BUYER_SESSION', 'true');
        return;
      }
      setLoading(true);
      return;
    }
    
    console.log('⚠️ Unknown user type:', userType);
    setLoading(false);
  }, [currentUser, userData, userType, navigate, location]);

  // Fetch auctions from Firebase
  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const auctionsData = await getAuctions();
        setAuctions(auctionsData);
      } catch (error) {
        console.error("Error fetching auctions:", error);
        toast({
          title: "Error",
          description: "Failed to load auctions",
          variant: "destructive"
        });
      }
    };

    if (isRegistered) {
      fetchAuctions();
    }
  }, [isRegistered, toast]);

  // Example dynamic featured products
  const featuredProducts = [
    { name: "Organic Tomatoes", seller: "Green Valley Traders", description: "Fresh organic tomatoes available." },
    { name: "Basmati Rice", seller: "Farm Fresh Co.", description: "Premium basmati rice for sale." }
  ];

  const [translatedNames, setTranslatedNames] = useState<string[]>(featuredProducts.map(p => p.name));
  const [translatedSellers, setTranslatedSellers] = useState<string[]>(featuredProducts.map(p => p.seller));
  const [translatedDescriptions, setTranslatedDescriptions] = useState<string[]>(featuredProducts.map(p => p.description));

  const mainHeadings = {
    dashboard: "Buyer Dashboard",
    auctions: "Live Auctions",
    crops: "Crops & Produce",
    analytics: "Analytics & Insights"
  };

  const [translatedHeadings, setTranslatedHeadings] = useState<any>({});

  useEffect(() => {
    async function translateAll() {
      setTranslatedNames(await Promise.all(featuredProducts.map(product => translateText(product.name, currentLanguage))));
      setTranslatedSellers(await Promise.all(featuredProducts.map(product => translateText(product.seller, currentLanguage))));
      setTranslatedDescriptions(await Promise.all(featuredProducts.map(product => translateText(product.description, currentLanguage))));
      setTranslatedHeadings({
        dashboard: await translateText(mainHeadings.dashboard, currentLanguage),
        auctions: await translateText(mainHeadings.auctions, currentLanguage),
        crops: await translateText(mainHeadings.crops, currentLanguage),
        analytics: await translateText(mainHeadings.analytics, currentLanguage)
      });
    }
    translateAll();
  }, [currentLanguage]);

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast({
        title: "Error",
        description: "Please login first",
        variant: "destructive"
      });
      return;
    }

    const formData = new FormData(e.target as HTMLFormElement);
    const buyerData = {
      uid: currentUser.uid,
      email: currentUser.email,
      businessName: formData.get("businessName") as string,
      businessType: formData.get("businessType") as string,
      businessLocation: formData.get("businessLocation") as string,
      contactPerson: formData.get("contactPerson") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      gstNumber: formData.get("gstNumber") as string,
    };

    try {
      const result = await addBuyer(buyerData);
      if (result.error) {
        throw new Error(result.error);
      }
      
      setIsRegistered(true);
      toast({
        title: "Registration Successful",
        description: "Registration completed successfully",
      });
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isRegistered) {
    return (
      <div className="min-h-screen bg-muted/30">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-6 w-6 mr-2 text-primary" />
                  {t("Buyer Registration")}
                </CardTitle>
                
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegistration} className="space-y-4">
                  <div>
                    <Label htmlFor="businessName">{t("Business Name")}</Label>
                    <Input id="businessName" name="businessName" placeholder={t("Business Name")} required />
                  </div>
                  <div>
                    <Label htmlFor="businessType">{t("Business Type")}</Label>
                    <select name="businessType" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="retailer">{t("Retailer")}</option>
                      <option value="wholesaler">{t("Wholesaler")}</option>
                      <option value="processor">{t("Processor")}</option>
                      <option value="exporter">{t("Exporter")}</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="businessLocation">{t("Business Location")}</Label>
                    <Input id="businessLocation" name="businessLocation" placeholder={t("Business Location")} required />
                  </div>
                  <div>
                    <Label htmlFor="contactPerson">{t("Contact Person")}</Label>
                    <Input id="contactPerson" name="contactPerson" placeholder={t("Contact Person")} required />
                  </div>
                  <div>
                    <Label htmlFor="phoneNumber">{t("Phone Number")}</Label>
                    <Input id="phoneNumber" name="phoneNumber" placeholder={t("Phone Number")} required />
                  </div>
                  <div>
                    <Label htmlFor="gstNumber">{t("GSTIN Number")}</Label>
                    <Input id="gstNumber" name="gstNumber" placeholder={t("GSTIN number")} required />
                  </div>
                  <Button type="submit" className="w-full" variant="hero">
                    {t("Submit")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{translatedHeadings.dashboard}</h1>
          <p className="text-muted-foreground">
            Welcome back, {
              userData?.businessName || 
              userData?.contactPerson || 
              currentUser?.displayName ||
              JSON.parse(localStorage.getItem('krishisettu-current-user') || '{}')?.businessName ||
              JSON.parse(localStorage.getItem('krishisettu-current-user') || '{}')?.contactPerson ||
              "Buyer"
            }!
          </p>
        </div>

        <Tabs defaultValue="auctions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="auctions">{translatedHeadings.auctions}</TabsTrigger>
            <TabsTrigger value="my-bids">{t("My Bids")}</TabsTrigger>
          </TabsList>

          <TabsContent value="auctions" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {auctions.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground">No active auctions available</p>
                </div>
              ) : (
                auctions.map((auction) => (
                  <Card key={auction.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{auction.cropName}</CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {auction.farmerName}, {auction.location}
                          </CardDescription>
                        </div>
                        <Badge variant={auction.status === "ending-soon" ? "destructive" : "default"}>
                          {auction.status === "ending-soon" ? t("Auction Ending soon") : t("Auction Active")}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t("Auction Quantity")}:</span>
                          <span className="font-medium">{auction.quantity} kg</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t("Auction Quality")}:</span>
                          <span className="font-medium flex items-center">
                            <Star className="h-3 w-3 mr-1 text-accent fill-current" />
                            {auction.quality || "Grade A"}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t("Base Price")}:</span>
                          <span>₹{auction.basePrice}/kg</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t("Current Bid")}:</span>
                          <span className="font-semibold text-success">₹{auction.currentBid || auction.basePrice}/kg</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {t("Time Left")}:
                          </span>
                          <span className="font-medium">{auction.timeLeft || "Active"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground flex items-center">
                            <Gavel className="h-3 w-3 mr-1" />
                            {t("Total Bids")}:
                          </span>
                          <span>{auction.bids?.length || 0}</span>
                        </div>
                        
                        <div className="pt-2">
                          <Link to={`/auction/${auction.id}`}>
                            <Button className="w-full" variant="hero">
                              {t("Join Auction")}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="my-bids">
            <div className="space-y-4">
              {myBids.map((bid) => (
                <Card key={bid.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{bid.cropName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {t("Your Bids")}: {bid.myBid} | {t("My Bids")}: {bid.currentBid}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={bid.status === "winning" ? "default" : "secondary"}>
                          {bid.status === "winning" ? t("dashboard.myBids.winning") : t("dashboard.myBids.outbid")}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{bid.timeLeft} {t("dashboard.myBids.left")}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BuyerDashboard;