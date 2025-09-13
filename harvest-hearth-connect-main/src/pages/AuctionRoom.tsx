import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { getAuctions, addBid } from "@/Firebase/DBService";
import { 
  Clock, 
  Gavel, 
  TrendingUp, 
  MapPin, 
  Star,
  CheckCircle,
  Download,
  Truck,
  Users,
  Eye,
  Heart
} from "lucide-react";
import Header from "@/components/Header";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { translateText } from "@/lib/googleTranslate";

const AuctionRoom = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const { t, currentLanguage } = useLanguage();
  const { currentUser, userData, userType } = useAuth();
  const navigate = useNavigate();
  
  const [bidAmount, setBidAmount] = useState("");
  const [timeLeft, setTimeLeft] = useState({ hours: 1, minutes: 12, seconds: 45 });
  const [isAuctionEnded, setIsAuctionEnded] = useState(false);
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bids, setBids] = useState([]);

  // Check authentication
  useEffect(() => {
    if (!currentUser) {
      navigate("/");
      return;
    }
  }, [currentUser, navigate]);

  // Fetch auction data
  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const auctions = await getAuctions();
        const auctionData = auctions.find(a => a.id === id);
        
        if (!auctionData) {
          toast({
            title: "Error",
            description: "Auction not found",
            variant: "destructive"
          });
          navigate("/buyer-dashboard");
          return;
        }
        
        setAuction(auctionData);
        setBids(auctionData.bids || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching auction:", error);
        toast({
          title: "Error",
          description: "Failed to load auction data",
          variant: "destructive"
        });
        navigate("/buyer-dashboard");
      }
    };

    if (id) {
      fetchAuction();
    }
  }, [id, navigate, toast]);

  // Example dynamic auction data
  const auctionItems = [
    { name: "Premium Wheat", seller: "Ravi Kumar", description: "High quality wheat for auction." },
    { name: "Fresh Rice", seller: "Sita Devi", description: "Freshly harvested rice available." }
  ];

  const [translatedNames, setTranslatedNames] = useState<string[]>(auctionItems.map(i => i.name));
  const [translatedSellers, setTranslatedSellers] = useState<string[]>(auctionItems.map(i => i.seller));
  const [translatedDescriptions, setTranslatedDescriptions] = useState<string[]>(auctionItems.map(i => i.description));
  const [translatedBidSuccess, setTranslatedBidSuccess] = useState<string>("");
  const [translatedWinner, setTranslatedWinner] = useState<string>("");
  const [translatedMinimumBid, setTranslatedMinimumBid] = useState<string>("");
  const [translatedTotalBid, setTranslatedTotalBid] = useState<string>("");

  const mainHeadings = {
    auctionRoom: "Auction Room",
    currentBids: "Current Bids",
    placeBid: "Place a Bid",
    auctionDetails: "Auction Details"
  };

  const [translatedHeadings, setTranslatedHeadings] = useState<any>({});

  useEffect(() => {
    async function translateAll() {
      setTranslatedNames(await Promise.all(auctionItems.map(item => translateText(item.name, currentLanguage))));
      setTranslatedSellers(await Promise.all(auctionItems.map(item => translateText(item.seller, currentLanguage))));
      setTranslatedDescriptions(await Promise.all(auctionItems.map(item => translateText(item.description, currentLanguage))));
      // Example dynamic strings for auction features
      setTranslatedBidSuccess(await translateText(`Bid placed successfully for amount ₹${1000}.`, currentLanguage));
      setTranslatedWinner(await translateText(`Winner: Ravi Kumar, Price: ₹1200/kg`, currentLanguage));
      setTranslatedMinimumBid(await translateText(`Minimum bid is ₹1001.`, currentLanguage));
      setTranslatedTotalBid(await translateText(`Total bid: ₹1500.`, currentLanguage));
      setTranslatedHeadings({
        auctionRoom: await translateText(mainHeadings.auctionRoom, currentLanguage),
        currentBids: await translateText(mainHeadings.currentBids, currentLanguage),
        placeBid: await translateText(mainHeadings.placeBid, currentLanguage),
        auctionDetails: await translateText(mainHeadings.auctionDetails, currentLanguage)
      });
    }
    translateAll();
  }, [currentLanguage]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.hours === 0 && prev.minutes === 0 && prev.seconds === 0) {
          setIsAuctionEnded(true);
          clearInterval(timer);
          return prev;
        }
        
        let newSeconds = prev.seconds - 1;
        let newMinutes = prev.minutes;
        let newHours = prev.hours;
        
        if (newSeconds < 0) {
          newSeconds = 59;
          newMinutes--;
        }
        if (newMinutes < 0) {
          newMinutes = 59;
          newHours--;
        }
        
        return { hours: newHours, minutes: newMinutes, seconds: newSeconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleBid = async () => {
    if (!auction || userType !== "buyer") {
      toast({
        title: "Error",
        description: "Only registered buyers can place bids",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(bidAmount);
    const currentPricePerKg = auction.currentBid || auction.basePrice;
    
    if (amount <= currentPricePerKg) {
      toast({
        title: "Invalid Bid",
        description: `Bid must be higher than current price of ₹${currentPricePerKg}/kg`,
        variant: "destructive"
      });
      return;
    }

    const bidData = {
      bidderId: currentUser.uid,
      bidderName: userData?.businessName || userData?.contactPerson || "Anonymous",
      amount: amount,
      totalAmount: amount * auction.quantity,
      timestamp: new Date().toISOString()
    };

    try {
      const result = await addBid(auction.id, bidData);
      
      if (result.error) {
        throw new Error(result.error);
      }

      // Refresh auction data to get updated bids and current bid
      const updatedAuctions = await getAuctions();
      const updatedAuction = updatedAuctions.find(a => a.id === auction.id);
      
      if (updatedAuction) {
        setAuction(updatedAuction);
        setBids(updatedAuction.bids || []);
      } else {
        // Fallback to local updates if refresh fails
        const newBid = {
          ...bidData,
          time: "Just now"
        };
        
        setBids([newBid, ...bids]);
        
        // Update auction current bid
        setAuction(prev => ({
          ...prev,
          currentBid: amount,
          bids: [newBid, ...(prev.bids || [])]
        }));
      }
      
      setBidAmount("");
      
      toast({
        title: "Bid Placed Successfully",
        description: `Your bid of ₹${amount}/kg has been placed`,
        variant: "default"
      });
    } catch (error) {
      console.error("Bidding error:", error);
      toast({
        title: "Bid Failed",
        description: error.message || "Failed to place bid",
        variant: "destructive"
      });
    }
  };

  const handleAcceptBid = () => {
    if (userType !== "farmer") {
      toast({
        title: "Error",
        description: "Only farmers can accept bids",
        variant: "destructive"
      });
      return;
    }

    setIsAuctionEnded(true);
    toast({
      title: "Auction Ended",
      description: "Auction has been successfully ended",
      variant: "default"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-muted/20 to-muted/40">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Loading auction...</p>
        </div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-muted/20 to-muted/40">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Auction not found</p>
          <Link to="/buyer-dashboard">
            <Button className="mt-4">Go Back</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentPricePerKg = auction.currentBid || auction.basePrice;

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/20 to-muted/40">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Auction Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="outline" className="text-sm">
                  <Gavel className="h-3 w-3 mr-1" />
                  {t("badge.liveAuction")}
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  <Users className="h-3 w-3 mr-1" />
                  <AnimatedCounter value={bids.length} /> {t("badge.bidders")}
                </Badge>
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-3">{auction.cropName}</h1>
              <p className="text-muted-foreground flex items-center mb-4">
                <MapPin className="h-4 w-4 mr-2" />
                {auction.farmerName}, {auction.location}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  <AnimatedCounter value={156} /> {t("stats.views")}
                </div>
                <div className="flex items-center">
                  <Heart className="h-4 w-4 mr-1" />
                  <AnimatedCounter value={23} /> {t("stats.watchers")}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {!isAuctionEnded ? (
                <Card className="p-6 bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20">
                  <div className="text-center">
                    <Clock className="h-6 w-6 mx-auto mb-3 text-destructive" />
                    <div className="text-3xl font-bold text-destructive mb-1">
                      {String(timeLeft.hours).padStart(2, '0')}:
                      {String(timeLeft.minutes).padStart(2, '0')}:
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </div>
                    <p className="text-sm text-muted-foreground">{t("timer.timeRemaining")}</p>
                  </div>
                </Card>
              ) : (
                <Card className="p-6 bg-gradient-to-br from-success/10 to-success/5 border-success/20">
                  <div className="text-center">
                    <CheckCircle className="h-6 w-6 mx-auto mb-3 text-success" />
                    <div className="text-lg font-bold text-success mb-1">{t("timer.auctionEnded")}</div>
                    <p className="text-sm text-muted-foreground">{t("timer.winnerDeclared")}</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Crop Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{translatedHeadings.auctionDetails}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{t("details.quantity")}</p>
                    <p className="font-semibold">{auction.quantity} kg</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("details.quality")}</p>
                    <p className="font-semibold flex items-center">
                      <Star className="h-4 w-4 mr-1 text-accent fill-current" />
                      {auction.quality || "Grade A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("details.farmingMethod")}</p>
                    <p className="font-semibold">{auction.farmingMethod || "Traditional"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("details.harvestDate")}</p>
                    <p className="font-semibold">{auction.harvestDate || "Recent"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">{t("details.description")}</p>
                  <p className="text-sm">{auction.description || "No description available"}</p>
                </div>
              </CardContent>
            </Card>

            {/* Current Bid Status */}
            <Card className="bg-gradient-to-br from-success/5 to-primary/5 border-success/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-success" />
                  {t("status.currentAuctionStatus")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div className="p-4 bg-success/10 rounded-lg">
                    <p className="text-3xl font-bold text-success">
                      <AnimatedCounter value={currentPricePerKg} prefix="₹" suffix="/kg" />
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">{t("status.currentBid")}</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-3xl font-bold text-foreground">
                      <AnimatedCounter value={auction.basePrice} prefix="₹" suffix="/kg" />
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">{t("status.basePrice")}</p>
                  </div>
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <p className="text-3xl font-bold text-primary">
                      <AnimatedCounter value={bids.length} />
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">{t("status.totalBids")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Post-Auction Actions */}
            {isAuctionEnded && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-success" />
                    {t("actions.auctionCompleted")}
                  </CardTitle>
                  <CardDescription>
                    Winner: {bids[0]?.bidderName || bids[0]?.bidder}, Price: ₹{currentPricePerKg.toFixed(2)}/kg
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-3">
                    <Button variant="success" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      {t("actions.downloadInvoice")}
                    </Button>
                    <Link to="/logistics" className="flex-1">
                      <Button variant="outline" className="w-full">
                        <Truck className="h-4 w-4 mr-2" />
                        {t("actions.arrangeLogistics")}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Bidding Panel */}
          <div className="space-y-6">
            {/* Place Bid */}
            {!isAuctionEnded && userType === "buyer" && (
              <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Gavel className="h-5 w-5 mr-2 text-primary" />
                    {translatedHeadings.placeBid}
                  </CardTitle>
                  <CardDescription>
                    Minimum bid: ₹{(currentPricePerKg + 1).toFixed(2)}/kg
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Input
                        type="number"
                        placeholder={t("bidding.enterBidAmount")}
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        step="0.50"
                        min={currentPricePerKg + 1}
                        className="text-lg"
                      />
                    </div>
                    {bidAmount && (
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="text-sm text-muted-foreground">{t("bidding.totalAmount")}</div>
                        <div className="text-lg font-bold text-success">
                          ₹{(parseFloat(bidAmount) * auction.quantity).toFixed(2)}
                        </div>
                      </div>
                    )}
                    <Button onClick={handleBid} className="w-full" variant="hero" size="lg">
                      <Gavel className="h-4 w-4 mr-2" />
                      {t("bidding.placeBid")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Farmer Actions */}
            {!isAuctionEnded && userType === "farmer" && auction.farmerUID === currentUser?.uid && (
              <Card>
                <CardHeader>
                  <CardTitle>{t("farmerActions.title")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button onClick={handleAcceptBid} variant="success" className="w-full">
                    {t("farmerActions.acceptBid")}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Live Bids */}
            <Card className="bg-gradient-to-br from-muted/30 to-muted/10">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                  {translatedHeadings.currentBids}
                </CardTitle>
                <CardDescription>{t("liveBids.description")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {bids.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">No bids yet</p>
                    </div>
                  ) : (
                    bids.map((bid, index) => (
                      <div key={index} className={`flex justify-between items-center p-4 rounded-lg transition-all duration-300 ${
                        index === 0 ? 'bg-success/10 border border-success/20' : 'bg-muted/50 hover:bg-muted/70'
                      }`}>
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-3 ${
                            index === 0 ? 'bg-success animate-pulse' : 'bg-muted-foreground/50'
                          }`} />
                          <div>
                            <p className="font-medium text-sm">{bid.bidderName || bid.bidder}</p>
                            <p className="text-xs text-muted-foreground">{bid.time}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${index === 0 ? 'text-success' : 'text-foreground'}`}>
                            ₹{bid.amount}/kg
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Total: ₹{(bid.amount * auction.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionRoom;