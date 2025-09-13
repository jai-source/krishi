import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Sprout, 
  Users, 
  Gavel, 
  TrendingUp, 
  ArrowRight,
  CheckCircle,
  Star,
  Truck
} from "lucide-react";
import Header from "@/components/Header";
import { ScrollAnimation } from "@/components/ScrollAnimations";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { ParticleBackground } from "@/components/ParticleBackground";
import { FloatingChat } from "@/components/FloatingChat";
import heroImage from "@/assets/hero-agriculture.jpg";

const Index = () => {
  const { t } = useLanguage();
  const features = [
    {
      icon: Users,
      title: "Direct Connection",
      description: "Directly connects farmers and buyers for seamless trade."
    },
    {
      icon: Gavel,
      title: "Fair Auctions",
      description: "All auctions are fair, transparent, and live."
    },
    {
      icon: CheckCircle,
      title: "Verified Users",
      description: "All users, whether buyers or sellers, are verified."
    },
    {
      icon: Truck,
      title: "End To End Solution",
      description: "Provides a complete solution from farm to market."
    }
  ];

  const liveAuctions = [
    { crop: t("Wheat"), currentBid: "₹27.50/kg", timeLeft: "1d 12h", bids: 12 },
    { crop: t("basmati Rice"), currentBid: "₹48.00/kg", timeLeft: "3h 45m", bids: 18 },
    { crop: t("fresh Tomatoes"), currentBid: "₹15.20/kg", timeLeft: "5d 8h", bids: 6 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background relative">
      <ParticleBackground />
      <Header />
      <FloatingChat />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollAnimation animation="fade-in-left">
              <div>
              <Badge variant="outline" className="mb-4">
                🌾 {t("badge")}
              </Badge>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                <span className="text-primary">{t('landing.title')}</span>
                <br />
                {t('Bridging farmers with opportunities and buyers with trusted produce.')}
              </h1>
              
              <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-8">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-accent mr-1 fill-current" />
                  <AnimatedCounter value={1200} suffix={t("Farmers Suffix")} />
                </div>
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-success mr-1" />
                  <AnimatedCounter value={2.3} prefix="₹" suffix={t("Traded Suffix")} />
                </div>
              </div>
              </div>
            </ScrollAnimation>
            
            <ScrollAnimation animation="fade-in-right" delay={200}>
              <div className="relative">
                <img 
                  src={heroImage} 
                  alt={t("landing.heroAlt")} 
                  className="rounded-lg shadow-xl w-full"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                  <p className="text-sm text-muted-foreground">{t("Live Auctions")}</p>
                  <AnimatedCounter value={23} className="text-2xl font-bold text-success" />
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Live Auctions Preview */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <ScrollAnimation animation="fade-in-up">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">{t("Auctions")}</h2>
              
            </div>
          </ScrollAnimation>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {liveAuctions.map((auction, index) => (
              <ScrollAnimation key={index} animation="scale-in" delay={index * 100}>
                <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <CardTitle className="text-lg">{auction.crop}</CardTitle>
                  <CardDescription className="flex items-center justify-between">
                    <span>{t("Current Bid")}: <span className="font-semibold text-success">{auction.currentBid}</span></span>
                    <Badge variant="outline">{auction.timeLeft} {t("Time Left")}</Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{auction.bids} {t("Bids")}</span>
                    <Button size="sm" variant="outline">
                      {t("View Auction")}
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
                </Card>
              </ScrollAnimation>
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/buyer-dashboard">
              <Button variant="hero">
                {t("View All")}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Platform Features</h2>
            <p className="text-lg text-muted-foreground">
              Empowering Farmers & Buyers with Direct Connections, Fair Auctions, and End-to-End Solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-md transition-shadow">
                <CardContent>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-gradient-to-r from-primary to-accent">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            {t("Quick Actions")}
          </h2>
          
          
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6 max-w-2xl mx-auto">
            <Link to="/auctions">
              <Card className="p-6 hover:shadow-lg transition-shadow h-full">
                <CardContent className="text-center">
                  <Gavel className="h-12 w-12 text-success mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">{t("Auctions")}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t("Live auctions so that the farmers get the best price for their produce.")}
                  </p>
                  <Button variant="outline" className="w-full">
                    {t("Auctions")}
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
