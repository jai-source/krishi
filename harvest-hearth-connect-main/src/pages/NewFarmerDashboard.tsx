import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Plus, Wheat, DollarSign, Clock, CheckCircle, TrendingUp, BarChart3 } from "lucide-react";
import Header from "@/components/Header";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { registerFarmer } from "@/Firebase/authService";
import { addCrop, getCrops, addAuction } from "@/Firebase/DBService";

const NewFarmerDashboard = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const { currentUser, userData, userType } = useAuth();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    fullName: "",
    farmLocation: "",
    farmSize: "",
    phoneNumber: "",
    aadharNumber: "",
    email: "",
    password: ""
  });

  useEffect(() => {
    if (currentUser && userType === "farmer") {
      fetchCrops();
    }
  }, [currentUser, userType]);

  const fetchCrops = async () => {
    try {
      const allCrops = await getCrops();
      const farmerCrops = allCrops.filter(crop => crop.farmerId === userData?.id);
      setCrops(farmerCrops.map(crop => ({
        id: crop.id,
        name: crop.cropName,
        quantity: `${crop.quantity} kg`,
        basePrice: `₹${crop.basePrice}/kg`,
        status: crop.status || "active",
        bids: crop.bids?.length || 0,
        timeLeft: `${crop.auctionDuration} days`
      })));
    } catch (error) {
      console.error("Error fetching crops:", error);
    }
  };

  const handleRegistrationInputChange = (e) => {
    setRegistrationData({
      ...registrationData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { user, farmerId } = await registerFarmer(
        registrationData.email,
        registrationData.password,
        {
          fullName: registrationData.fullName,
          farmLocation: registrationData.farmLocation,
          farmSize: registrationData.farmSize,
          phoneNumber: registrationData.phoneNumber,
          aadharNumber: registrationData.aadharNumber
        }
      );

      toast({
        title: "Registration Successful",
        description: "Welcome to KrishiSettu! You can now start listing your crops.",
      });
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };  const handleCropListing = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    
    try {
      const cropData = {
        cropName: formData.get("cropName") as string,
        quantity: parseInt(formData.get("quantity") as string),
        basePrice: parseFloat(formData.get("basePrice") as string),
        auctionDuration: formData.get("auctionDuration") as string,
        farmerUID: currentUser?.uid,
        farmerId: userData?.id,
        farmerName: userData?.fullName,
        farmerLocation: userData?.farmLocation,
        quality: "Grade A", // Default quality
        harvestDate: new Date().toISOString().split('T')[0],
        description: `Fresh ${formData.get("cropName") as string} available for auction`,
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
        endDate: new Date(Date.now() + parseInt(cropData.auctionDuration) * 24 * 60 * 60 * 1000).toISOString(),
        bids: []
      };

      const auctionResult = await addAuction(auctionData);
      
      if (auctionResult.error) {
        console.warn("Failed to create auction:", auctionResult.error);
      }

      setCrops([{
        id: cropResult.id,
        name: cropData.cropName,
        quantity: `${cropData.quantity} kg`,
        basePrice: `₹${cropData.basePrice}/kg`,
        status: "active",
        bids: 0,
        timeLeft: `${cropData.auctionDuration} days`
      }, ...crops]);

      toast({
        title: "Crop Listed Successfully",
        description: "Your crop has been added to the auction platform.",
      });
      
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast({
        title: "Failed to list crop",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Show registration form if user is not logged in or not a farmer
  if (!currentUser || userType !== "farmer") {
    return (
      <div className="min-h-screen bg-muted/30">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wheat className="h-6 w-6 mr-2 text-primary" />
                  Farmer Registration
                </CardTitle>
                <CardDescription>
                  Join KrishiSettu as a farmer and start selling your produce directly to buyers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegistration} className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      placeholder="Enter your full name"
                      value={registrationData.fullName}
                      onChange={handleRegistrationInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="farmer@example.com"
                      value={registrationData.email}
                      onChange={handleRegistrationInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Create a password"
                      value={registrationData.password}
                      onChange={handleRegistrationInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="farmLocation">Farm Location</Label>
                    <Input
                      id="farmLocation"
                      name="farmLocation"
                      placeholder="Enter farm location"
                      value={registrationData.farmLocation}
                      onChange={handleRegistrationInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="farmSize">Farm Size (in acres)</Label>
                    <Input
                      id="farmSize"
                      name="farmSize"
                      type="number"
                      placeholder="Enter farm size"
                      value={registrationData.farmSize}
                      onChange={handleRegistrationInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      placeholder="Enter phone number"
                      value={registrationData.phoneNumber}
                      onChange={handleRegistrationInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="aadharNumber">Aadhar Number</Label>
                    <Input
                      id="aadharNumber"
                      name="aadharNumber"
                      placeholder="Enter Aadhar number"
                      value={registrationData.aadharNumber}
                      onChange={handleRegistrationInputChange}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" variant="hero" disabled={loading}>
                    {loading ? "Registering..." : "Register as Farmer"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Show farmer dashboard if user is logged in and is a farmer
  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <div className="container mx-auto px-4 py-8">        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Farmer Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {
              userData?.fullName || 
              currentUser?.displayName ||
              JSON.parse(localStorage.getItem('krishisettu-current-user') || '{}')?.fullName ||
              "Farmer"
            }!
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                <AnimatedCounter value={125000} prefix="₹" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">This Month</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Growth Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                <AnimatedCounter value={23.5} suffix="%" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Vs Last Month</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Active Auctions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                <AnimatedCounter value={crops.filter(crop => crop.status === 'active').length} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Currently Running</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="crops" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="crops">My Crops</TabsTrigger>
            <TabsTrigger value="add-crop">Add New Crop</TabsTrigger>
          </TabsList>

          <TabsContent value="crops" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {crops.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <Wheat className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No crops listed yet. Add your first crop to get started!</p>
                </div>
              ) : (
                crops.map((crop) => (
                  <Card key={crop.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{crop.name}</CardTitle>
                        <Badge variant={crop.status === "active" ? "default" : "secondary"}>
                          {crop.status}
                        </Badge>
                      </div>
                      <CardDescription>{crop.quantity}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">Base Price: {crop.basePrice}</span>
                        </div>
                        
                        {crop.status === "active" && (
                          <>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span className="text-sm">{crop.timeLeft} remaining</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-sm">{crop.bids} bids received</span>
                            </div>
                            <Button size="sm" className="w-full mt-3">
                              View Auction
                            </Button>
                          </>
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
                  Add New Crop
                </CardTitle>
                <CardDescription>
                  List your crop for auction and connect with potential buyers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCropListing} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cropName">Crop Name</Label>
                      <Input id="cropName" name="cropName" placeholder="e.g., Organic Wheat" required />
                    </div>
                    <div>
                      <Label htmlFor="quantity">Quantity (kg)</Label>
                      <Input id="quantity" name="quantity" type="number" placeholder="e.g., 500" required />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="basePrice">Base Price (₹/kg)</Label>
                      <Input id="basePrice" name="basePrice" type="number" placeholder="e.g., 25" required />
                    </div>
                    <div>
                      <Label htmlFor="auctionDuration">Auction Duration</Label>                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" name="auctionDuration" required>
                        <option value="1">1 day</option>
                        <option value="3">3 days</option>
                        <option value="7">7 days</option>
                        <option value="14">14 days</option>
                      </select>
                    </div>
                  </div>
                  
                  <Button type="submit" variant="hero" className="w-full" disabled={loading}>
                    {loading ? "Listing Crop..." : "List Crop for Auction"}
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

export default NewFarmerDashboard;
