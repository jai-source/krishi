import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Plus, Wheat, DollarSign, Clock, CheckCircle, TrendingUp, BarChart3 } from "lucide-react";
import Header from "@/components/Header";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { useLanguage } from "@/contexts/LanguageContext";
import { addCrop, addAuction } from "@/Firebase/DBService";
import { useAuth } from "@/contexts/AuthContext";

const mainHeadings = {
  dashboard: "Farmer Dashboard",
  auctions: "Live Auctions",
  crops: "Crops & Produce",
  analytics: "Analytics & Insights"
};

const FarmerDashboard = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const { currentUser, userData } = useAuth();
  const [isRegistered, setIsRegistered] = useState(false);
  const [crops, setCrops] = useState([]);
  
  // Load farmer's actual crops on component mount
  useEffect(() => {
    const loadFarmerCrops = async () => {
      if (currentUser && userData && userData.fullName) {
        try {
          // This would load actual crops from the database
          // For now, starting with empty array for new farmers
          setCrops([]);
        } catch (error) {
          console.error('Error loading farmer crops:', error);
          setCrops([]);
        }
      }
    };
    
    loadFarmerCrops();
  }, [currentUser, userData]);

  const handleRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistered(true);
    toast({
      title: t("registration.successTitle"),
      description: t("registration.successDescription"),
    });
  };

  const handleCropListing = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    try {
      const cropData = {
        cropName: formData.get("cropName") as string,
        quantity: parseInt(formData.get("quantity") as string),
        basePrice: parseFloat(formData.get("basePrice") as string),
        auctionDuration: "7", // Default duration
        farmerUID: currentUser?.uid,
        farmerName: userData?.fullName,
        farmerLocation: userData?.farmLocation,
        quality: "Grade A",
        harvestDate: new Date().toISOString().split('T')[0],
        description: `Fresh ${formData.get("cropName")} available for auction`,
        farmingMethod: "Traditional"
      };

      // Add to crops collection
      const cropResult = await addCrop(cropData);
      
      if (cropResult.error) {
        throw new Error(cropResult.error);
      }

      // Also add to auctions collection so buyers can see it
      const auctionData = {
        ...cropData,
        status: "active",
        currentBid: cropData.basePrice,
        location: userData?.farmLocation,
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        bids: []
      };

      const auctionResult = await addAuction(auctionData);
      
      if (auctionResult.error) {
        console.warn("Failed to create auction:", auctionResult.error);
      }

      const newCrop = {
        id: cropResult.id || crops.length + 1,
        name: cropData.cropName,
        quantity: `${cropData.quantity} kg`,
        basePrice: `₹${cropData.basePrice}/kg`,
        status: "active",
        bids: 0,
        timeLeft: "7 days"
      };
      
      setCrops([newCrop, ...crops]);
      toast({
        title: t("cropListing.successTitle"),
        description: t("cropListing.successDescription"),
      });
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast({
        title: "Failed to list crop",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (!isRegistered) {
    return (
      <div className="min-h-screen bg-muted/30">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wheat className="h-6 w-6 mr-2 text-primary" />
                  {t("Farmer registration")}
                </CardTitle>
                
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegistration} className="space-y-4">
                  <div>
                    <Label htmlFor="farmerName">{t("Enter Full Name")}</Label>
                    <Input id="farmerName" placeholder={t("Full Name")} required />
                  </div>
                  <div>
                    <Label htmlFor="farmLocation">{t("Enter Farm Location")}</Label>
                    <Input id="farmLocation" placeholder={t("Farm Location")} required />
                  </div>
                  <div>
                    <Label htmlFor="farmSize">{t("Enter Farm Size")}</Label>
                    <Input id="farmSize" type="number" placeholder={t("Farm Size")} required />
                  </div>
                  <div>
                    <Label htmlFor="phoneNumber">{t("Enter Phone Number")}</Label>
                    <Input id="phoneNumber" placeholder={t("Phone Number")} required />
                  </div>
                  <div>
                    <Label htmlFor="aadharNumber">{t("Enter Aadhar Number")}</Label>
                    <Input id="aadharNumber" placeholder={t("Aadhar Number")} required />
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
          <h1 className="text-3xl font-bold text-foreground mb-2">{t("DashBoard")}</h1>
          
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                {t("Total Revenue")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                <AnimatedCounter value={125000} prefix="₹" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{t("This Month")}</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                {t("Growth Rate")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                <AnimatedCounter value={23.5} suffix="%" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{t("Vs Last Month")}</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                {t("Active Auctions")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                <AnimatedCounter value={crops.filter(crop => crop.status === 'active').length} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{t("Currently Running")}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="crops" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="crops">{t("dashboard.myCrops")}</TabsTrigger>
            <TabsTrigger value="add-crop">{t("Add New Crop")}</TabsTrigger>
          </TabsList>

          <TabsContent value="crops" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {crops.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Wheat className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">No crops listed yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">Start by adding your first crop to the marketplace!</p>
                  <Button variant="outline" onClick={() => {
                    // Switch to the Add Crop tab
                    const addCropTab = document.querySelector('[value="add-crop"]');
                    addCropTab?.click();
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Crop
                  </Button>
                </div>
              ) : (
                crops.map((crop) => (
                <Card key={crop.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{crop.name}</CardTitle>
                      <Badge variant={crop.status === "active" ? "default" : "secondary"}>
                        {t(`cropStatus.${crop.status}`)}
                      </Badge>
                    </div>
                    <CardDescription>{crop.quantity}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">
                          {t("Base Price")}: {crop.basePrice}
                          {crop.finalPrice && (
                            <span className="ml-2 font-semibold text-success">
                              {t("Final Price")}: {crop.finalPrice}
                            </span>
                          )}
                        </span>
                      </div>
                      
                      {crop.status === "active" && (
                        <>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-sm">{crop.timeLeft} {t("Time Left")}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm">{crop.bids} {t("Bids Received")}</span>
                          </div>
                          <Button size="sm" className="w-full mt-3">
                            {t("View Auction")}
                          </Button>
                        </>
                      )}
                      
                      {crop.status === "sold" && (
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-success" />
                          <span className="text-sm text-success">{t("Crop Sold To")} {crop.buyer}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="add-crop">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="h-6 w-6 mr-2 text-primary" />
                  {t("Add Crop")}
                </CardTitle>
                
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCropListing} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cropName">{t("Crop Name")}</Label>
                      <Input id="cropName" name="cropName" placeholder={t("Crop Name")} required />
                    </div>
                    <div>
                      <Label htmlFor="quantity">{t("Quantity")}</Label>
                      <Input id="quantity" name="quantity" type="number" placeholder={t("Quantity")} required />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="basePrice">{t("Base Price")}</Label>
                      <Input id="basePrice" name="basePrice" type="number" placeholder={t("Base Price")} required />
                    </div>
                    <div>
                      <Label htmlFor="auctionDuration">{t("Auction Duration")}</Label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" name="auctionDuration">
                        <option value="1">{t("Auction 1")}</option>
                        <option value="2" selected>{t("Auction 2")}</option>
                        <option value="3">{t("Auction 3")}</option>
                      </select>
                    </div>
                  </div>
                  
                
                  
                  
                  
                  <Button type="submit" variant="hero" className="w-full">
                    {t("Submit")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FarmerDashboard;