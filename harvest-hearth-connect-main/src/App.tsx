import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import LanguageSelection from "./components/LanguageSelection";
import Index from "./pages/Index";
import FarmerDashboard from "./pages/FarmerDashboard";
import NewFarmerDashboard from "./pages/NewFarmerDashboard";
import BuyerDashboard from "./pages/BuyerDashboard";
import AuctionRoom from "./pages/AuctionRoom";
import Logistics from "./pages/Logistics";
import AdminDashboard from "./pages/AdminDashboard";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

// Initialize React Query client for data fetching
const queryClient = new QueryClient();

const App = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for previously saved language preference on app initialization
  useEffect(() => {
    const savedLanguage = localStorage.getItem('krishisettu-language');
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage);
    }
    setIsLoading(false);
  }, []);

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    // Persist language choice in browser storage
    localStorage.setItem('krishisettu-language', language);
  };

  // Display loading spinner while checking for saved language preference
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading KrishiSettu...</p>
        </div>
      </div>
    );
  }

  // Show language selection screen for new users
  if (!selectedLanguage) {
    return <LanguageSelection onLanguageSelect={handleLanguageSelect} />;
  }

  return (
    <LanguageProvider initialLanguage={selectedLanguage}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/farmer-dashboard" element={<NewFarmerDashboard />} />
                <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
                <Route path="/auction/:id" element={<AuctionRoom />} />
                <Route path="/auctions" element={<BuyerDashboard />} />
                <Route path="/logistics" element={<Logistics />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/about" element={<About />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
