import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sprout, User, BarChart3, Globe, LogOut } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { useState } from "react";
import Login from "./LoginRegister";
import { logoutUser } from "../Firebase/authService";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const location = useLocation();
  const { t, currentLanguage, setLanguage } = useLanguage();
  const { currentUser, userData, userType } = useAuth();
  const { toast } = useToast();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  
  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "hi", name: "हिंदी", flag: "🇮🇳" },
    { code: "bn", name: "বাংলা", flag: "🇧🇩" },
    { code: "mr", name: "मराठी", flag: "🇮🇳" },
    { code: "ta", name: "தமிழ்", flag: "🇮🇳" },
    { code: "te", name: "తెలుగు", flag: "🇮🇳" },
    { code: "gu", name: "ગુજરાતી", flag: "🇮🇳" },
    { code: "kn", name: "ಕನ್ನಡ", flag: "🇮🇳" },
    { code: "ml", name: "മലയാളം", flag: "🇮🇳" },
    { code: "pa", name: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage);

  const handleLanguageChange = (languageCode: string) => {
    setLanguage(languageCode);
    localStorage.setItem('krishisettu-language', languageCode);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  return (
    <>
      <header className="bg-background border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Sprout className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">KrishiSettu</span>
            </Link>
            
            <nav className="hidden md:flex space-x-6">
              <Link 
                to="/" 
                className={`hover:text-primary transition-colors ${
                  location.pathname === "/" ? "text-primary font-medium" : "text-muted-foreground"
                }`}
              >
                Home
              </Link>
              <Link 
                to="/auctions" 
                className={`hover:text-primary transition-colors ${
                  location.pathname === "/auctions" ? "text-primary font-medium" : "text-muted-foreground"
                }`}
              >
                Auctions
              </Link>
              <Link 
                to="/about" 
                className={`hover:text-primary transition-colors ${
                  location.pathname === "/about" ? "text-primary font-medium" : "text-muted-foreground"
                }`}
              >
                About
              </Link>
            </nav>
            
            <div className="flex items-center space-x-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Globe className="h-4 w-4 mr-2" />
                    {currentLang?.flag} {currentLang?.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {languages.map((language) => (
                    <DropdownMenuItem
                      key={language.code}
                      onClick={() => handleLanguageChange(language.code)}
                      className={currentLanguage === language.code ? "bg-primary/10" : ""}
                    >
                      <span className="mr-2">{language.flag}</span>
                      {language.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <ThemeSwitcher />
              
              {currentUser ? (
                <>
                  <span className="text-sm text-muted-foreground">
                    Welcome, {userData?.fullName || userData?.businessName || userData?.contactPerson}
                  </span>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" onClick={() => {
                    setShowLogin(true);
                    setShowRegister(false);
                  }}>
                    <User className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => {
                    setShowRegister(true);
                    setShowLogin(false);
                  }}>
                    <User className="h-4 w-4 mr-2" />
                    Register
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {showLogin && (
        <Login 
          onClose={() => setShowLogin(false)} 
          initialMode="login"
        />
      )}
      {showRegister && (
        <Login 
          onClose={() => setShowRegister(false)} 
          initialMode="register"
        />
      )}
    </>
  );
};

export default Header;