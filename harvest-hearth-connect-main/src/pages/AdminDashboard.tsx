import { useEffect, useState } from "react";
import { translateText } from "@/lib/googleTranslate";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { ScrollAnimation } from "@/components/ScrollAnimations";
import { 
  Users, 
  Gavel, 
  TrendingUp, 
  DollarSign,
  Wheat,
  ShoppingCart,
  BarChart3,
  Eye
} from "lucide-react";
import Header from "@/components/Header";
import FixVerificationPanel from "@/components/FixVerificationPanel";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { getFarmers, getBuyers, getAuctions, getCrops } from "@/Firebase/DBService";
import { seedDatabase } from "@/Firebase/enhancedSeedData";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const { t, currentLanguage } = useLanguage();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Real-time data from Firebase
  const [farmers, setFarmers] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  // Check if user is admin (you can adjust this logic based on your admin identification method)
  useEffect(() => {
    if (!currentUser) {
      navigate("/");
      return;
    }
    // Add your admin check logic here
    // For now, we'll allow any authenticated user to access admin dashboard
  }, [currentUser, navigate]);

  // Fetch all data from Firebase
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [farmersData, buyersData, auctionsData, cropsData] = await Promise.all([
          getFarmers(),
          getBuyers(),
          getAuctions(),
          getCrops()
        ]);
        
        setFarmers(farmersData);
        setBuyers(buyersData);
        setAuctions(auctionsData);
        setCrops(cropsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching admin data:", error);
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Function to seed the database with sample data
  const handleSeedDatabase = async () => {
    setSeeding(true);
    try {
      await seedDatabase();
      toast({
        title: "Database Seeded Successfully",
        description: "Sample farmers, buyers, crops, and auctions have been added to the database.",
      });
      
      // Refresh data after seeding
      const [farmersData, buyersData, auctionsData, cropsData] = await Promise.all([
        getFarmers(),
        getBuyers(),
        getAuctions(),
        getCrops()
      ]);
      
      setFarmers(farmersData);
      setBuyers(buyersData);
      setAuctions(auctionsData);
      setCrops(cropsData);
      
    } catch (error) {
      console.error("Error seeding database:", error);
      toast({
        title: "Database Seeding Failed",
        description: "There was an error while seeding the database. Check console for details.",
        variant: "destructive"
      });
    } finally {
      setSeeding(false);
    }
  };

  // Calculate real-time statistics
  const stats = {
    totalUsers: farmers.length + buyers.length,
    activeFarmers: farmers.filter(f => f.status === "active").length,
    activeBuyers: buyers.filter(b => b.status === "active").length,
    totalAuctions: auctions.length,
    activeAuctions: auctions.filter(a => a.status === "active").length,
    completedAuctions: auctions.filter(a => a.status === "completed").length,
    totalCrops: crops.length,
    totalRevenue: "₹2,34,56,780", // This would be calculated from auction data
    monthlyGrowth: "+12.5%" // This would be calculated based on time-series data
  };

  // Clean, user-friendly headings and tab labels
  const mainHeadings = {
    dashboard: "Admin Dashboard",
    analytics: "Analytics & Insights",
    users: "Users",
    auctions: "Live Auctions",
    crops: "Crops & Produce"
  };

  // Get recent users (latest 5)
  const recentUsers = [
    ...farmers.slice(-3).map(f => ({ 
      name: f.name || f.contactPerson, 
      type: "Farmer", 
      location: f.location || f.farmLocation, 
      joinDate: f.createdAt?.toDate?.()?.toLocaleDateString() || "Recent", 
      status: f.status || "verified" 
    })),
    ...buyers.slice(-2).map(b => ({ 
      name: b.businessName || b.contactPerson, 
      type: "Buyer", 
      location: b.businessLocation, 
      joinDate: b.createdAt?.toDate?.()?.toLocaleDateString() || "Recent", 
      status: b.status || "verified" 
    }))
  ];

  // Get active auctions
  const activeAuctions = auctions.filter(a => a.status === "active").slice(0, 5).map(auction => ({
    id: auction.id,
    crop: auction.cropName,
    farmer: auction.farmerName,
    currentBid: `₹${auction.currentBid || auction.basePrice}/kg`,
    timeLeft: "Active",
    bids: auction.bids?.length || 0
  }));

  // Get top crops from real data or use fallback
  const topCrops = crops.length > 0 ? 
    crops.reduce((acc, crop) => {
      const existing = acc.find(c => c.name === crop.cropName);
      if (existing) {
        existing.auctions++;
      } else {
        acc.push({
          name: crop.cropName,
          auctions: 1,
          avgPrice: `₹${crop.basePrice}/kg`,
          trend: "+5.2%" // This would be calculated from historical data
        });
      }
      return acc;
    }, []).slice(0, 5) :
    [
      { name: "Wheat", auctions: 45, avgPrice: "₹25.30/kg", trend: "+5.2%" },
      { name: "Rice", auctions: 38, avgPrice: "₹42.50/kg", trend: "+8.1%" },
      { name: "Tomatoes", auctions: 29, avgPrice: "₹18.75/kg", trend: "-2.3%" },
      { name: "Onions", auctions: 22, avgPrice: "₹22.40/kg", trend: "+15.6%" },
      { name: "Potatoes", auctions: 18, avgPrice: "₹16.20/kg", trend: "+3.2%" }
    ];

  // State for translated dynamic content
  const [translatedCrops, setTranslatedCrops] = useState<string[]>(topCrops.map(c => c.name));
  const [translatedUsers, setTranslatedUsers] = useState<string[]>(recentUsers.map(u => u.name));
  const [translatedLocations, setTranslatedLocations] = useState<string[]>(recentUsers.map(u => u.location));
  const [translatedAuctionCrops, setTranslatedAuctionCrops] = useState<string[]>(activeAuctions.map(a => a.crop));
  const [translatedAuctionFarmers, setTranslatedAuctionFarmers] = useState<string[]>(activeAuctions.map(a => a.farmer));
  const [translatedStats, setTranslatedStats] = useState<any>({});
  const [translatedTabs, setTranslatedTabs] = useState<any>({});
  const [translatedHeader, setTranslatedHeader] = useState({ title: mainHeadings.dashboard, subtitle: mainHeadings.analytics });

  useEffect(() => {
    async function translateAll() {
      setTranslatedCrops(await Promise.all(topCrops.map(crop => translateText(crop.name, currentLanguage))));
      setTranslatedUsers(await Promise.all(recentUsers.map(user => translateText(user.name, currentLanguage))));
      setTranslatedLocations(await Promise.all(recentUsers.map(user => translateText(user.location, currentLanguage))));
      setTranslatedAuctionCrops(await Promise.all(activeAuctions.map(a => translateText(a.crop, currentLanguage))));
      setTranslatedAuctionFarmers(await Promise.all(activeAuctions.map(a => translateText(a.farmer, currentLanguage))));
      // Translate all visible static labels (now using only main keys)
      setTranslatedStats({
        totalUsers: await translateText("Total Users", currentLanguage),
        farmers: await translateText("Farmers", currentLanguage),
        buyers: await translateText("Buyers", currentLanguage),
        totalAuctions: await translateText("Total Auctions", currentLanguage),
        active: await translateText("Active", currentLanguage),
        completed: await translateText("Completed", currentLanguage),
        totalRevenue: await translateText("Total Revenue", currentLanguage),
        fromLastMonth: await translateText("From Last Month", currentLanguage),
        growthRate: await translateText("Growth Rate", currentLanguage),
        monthlyUserGrowth: await translateText("Monthly User Growth", currentLanguage)
      });
      setTranslatedTabs({
        analytics: await translateText(mainHeadings.analytics, currentLanguage),
        users: await translateText(mainHeadings.users, currentLanguage),
        auctions: await translateText("Auctions", currentLanguage),
        crops: await translateText(mainHeadings.crops, currentLanguage)
      });
      setTranslatedHeader({
        title: await translateText(mainHeadings.dashboard, currentLanguage),
        subtitle: await translateText("Subtitle", currentLanguage)
      });
    }
    translateAll();
  }, [currentLanguage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{translatedHeader.title}</h1>
              <p className="text-muted-foreground">{translatedHeader.subtitle}</p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleSeedDatabase} 
                disabled={seeding}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Wheat className="h-4 w-4" />
                {seeding ? "Seeding..." : "Seed Database"}
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ScrollAnimation animation="scale-in">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{translatedStats.totalUsers}</p>
                    <AnimatedCounter value={stats.totalUsers} className="text-2xl font-bold" />
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div className="mt-2 flex text-sm">
                  <span className="text-muted-foreground">
                    {stats.activeFarmers} {translatedStats.farmers}, {stats.activeBuyers} {translatedStats.buyers}
                  </span>
                </div>
              </CardContent>
            </Card>
          </ScrollAnimation>

          <ScrollAnimation animation="scale-in" delay={100}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{translatedStats.totalAuctions}</p>
                    <AnimatedCounter value={stats.totalAuctions} className="text-2xl font-bold" />
                  </div>
                  <Gavel className="h-8 w-8 text-accent" />
                </div>
                <div className="mt-2 flex text-sm">
                  <span className="text-muted-foreground">
                    {stats.activeAuctions} {translatedStats.active}, {stats.completedAuctions} {translatedStats.completed}
                  </span>
                </div>
              </CardContent>
            </Card>
          </ScrollAnimation>

          <ScrollAnimation animation="scale-in" delay={200}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{translatedStats.totalRevenue}</p>
                    <p className="text-2xl font-bold">{stats.totalRevenue}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-success" />
                </div>
                <div className="mt-2 flex text-sm">
                  <span className="text-success font-medium">{stats.monthlyGrowth}</span>
                  <span className="text-muted-foreground ml-1">{translatedStats.fromLastMonth}</span>
                </div>
              </CardContent>
            </Card>
          </ScrollAnimation>

          <ScrollAnimation animation="scale-in" delay={300}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{translatedStats.growthRate}</p>
                    <p className="text-2xl font-bold text-success">{stats.monthlyGrowth}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-success" />
                </div>
                <div className="mt-2 flex text-sm">
                  <span className="text-muted-foreground">{translatedStats.monthlyUserGrowth}</span>
                </div>
              </CardContent>
            </Card>
          </ScrollAnimation>
        </div>

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="analytics">{translatedTabs.analytics}</TabsTrigger>
            <TabsTrigger value="users">{translatedTabs.users}</TabsTrigger>
            <TabsTrigger value="auctions">{translatedTabs.auctions}</TabsTrigger>
            <TabsTrigger value="crops">{translatedTabs.crops}</TabsTrigger>
            <TabsTrigger value="tests">Fix Tests</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                    {t('analytics.topCrops')}
                  </CardTitle>
                  <CardDescription>{t('analytics.cropsDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topCrops.map((crop, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Wheat className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{translatedCrops[index]}</p>
                            <p className="text-sm text-muted-foreground">{crop.auctions} {t('analytics.auctions')}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{crop.avgPrice}</p>
                          <p className={`text-sm ${crop.trend.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                            {crop.trend}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('analytics.growthChart')}</CardTitle>
                  <CardDescription>{t('analytics.growthDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>{t('analytics.chartPlaceholder')}</p>
                      <p className="text-sm">{t('analytics.chartIntegration')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>{translatedTabs.users}</CardTitle>
                <CardDescription>{translatedTabs.users}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUsers.map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          {user.type === "Farmer" ? (
                            <Wheat className="h-5 w-5 text-primary" />
                          ) : (
                            <ShoppingCart className="h-5 w-5 text-accent" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{translatedUsers[index]}</p>
                          <p className="text-sm text-muted-foreground">{translatedLocations[index]}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant={user.type === "Farmer" ? "default" : "secondary"}>
                          {t(`users.${user.type.toLowerCase()}`)}
                        </Badge>
                        <Badge variant={user.status === "verified" ? "default" : "secondary"}>
                          {t(`users.${user.status}`)}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{user.joinDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="auctions">
            <Card>
              <CardHeader>
                <CardTitle>{translatedTabs.auctions}</CardTitle>
                <CardDescription>{translatedTabs.auctions}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeAuctions.map((auction, index) => (
                    <div key={auction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{translatedAuctionCrops[index]}</p>
                        <p className="text-sm text-muted-foreground">{t('auctions.by')} {translatedAuctionFarmers[index]}</p>
                      </div>
                      <div className="flex items-center space-x-6 text-sm">
                        <div>
                          <p className="text-muted-foreground">{t('auctions.currentBid')}</p>
                          <p className="font-semibold text-success">{auction.currentBid}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">{t('auctions.timeLeft')}</p>
                          <p className="font-medium">{auction.timeLeft}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">{t('auctions.totalBids')}</p>
                          <p className="font-medium">{auction.bids}</p>
                        </div>
                        <Eye className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-primary" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="crops">
            <Card>
              <CardHeader>
                <CardTitle>{translatedTabs.crops}</CardTitle>
                <CardDescription>{translatedTabs.crops}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {topCrops.map((crop, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{translatedCrops[index]}</h4>
                          <Wheat className="h-4 w-4 text-primary" />
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{t('crops.auctions')}:</span>
                            <span>{crop.auctions}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{t('crops.avgPrice')}:</span>
                            <span>{crop.avgPrice}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{t('crops.trend')}:</span>
                            <span className={crop.trend.startsWith('+') ? 'text-success' : 'text-destructive'}>
                              {crop.trend}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Fix Verification Tests</CardTitle>
                <CardDescription>
                  Test the recent fixes for buyer login routing and auction visibility issues
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FixVerificationPanel />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;