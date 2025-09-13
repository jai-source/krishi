import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Check, Sparkles } from "lucide-react";
import { ParticleBackground } from "./ParticleBackground";

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  description: string;
}

const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸", description: "Global Language" },
  { code: "hi", name: "Hindi", nativeName: "हिंदी", flag: "🇮🇳", description: "राष्ट्रीय भाषा" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇧🇩", description: "বাংলা ভাষা" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳", description: "महाराष्ट्राची भाषा" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳", description: "தமிழ் மொழி" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳", description: "తెలుగు భాష" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳", description: "ગુજરાતી ભાષા" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳", description: "ಕನ್ನಡ ಭಾಷೆ" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", flag: "🇮🇳", description: "മലയാള ഭാഷ" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳", description: "ਪੰਜਾਬੀ ਭਾਸ਼ਾ" },
];

interface LanguageSelectionProps {
  onLanguageSelect: (language: string) => void;
}

export default function LanguageSelection({ onLanguageSelect }: LanguageSelectionProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [isAnimating, setIsAnimating] = useState(false);

  // Check for saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('krishisettu-language');
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage);
    }
  }, []);

  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    // Save to localStorage
    localStorage.setItem('krishisettu-language', languageCode);
  };

  const handleContinue = () => {
    if (selectedLanguage) {
      setIsAnimating(true);
      // Save language preference
      localStorage.setItem('krishisettu-language', selectedLanguage);
      
      // Add a small delay for animation
      setTimeout(() => {
        onLanguageSelect(selectedLanguage);
      }, 500);
    }
  };

  const selectedLang = languages.find(lang => lang.code === selectedLanguage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 relative overflow-hidden">
      <ParticleBackground />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mr-4">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                  KrishiSettu
                </h1>
                <Badge variant="outline" className="text-sm">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Agricultural Marketplace
                </Badge>
              </div>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose your preferred language to get started with KrishiSettu
            </p>
          </div>

          {/* Language Selection */}
          <Card className="backdrop-blur-sm bg-background/80 border-primary/20 shadow-xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-foreground flex items-center justify-center">
                <Globe className="h-6 w-6 mr-2 text-primary" />
                Select Language
              </CardTitle>
              <CardDescription className="text-base">
                Choose your preferred language for the best experience
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {languages.map((language) => (
                  <Button
                    key={language.code}
                    variant={selectedLanguage === language.code ? "default" : "outline"}
                    className={`h-auto p-4 flex flex-col items-center space-y-2 transition-all duration-300 hover:scale-105 ${
                      selectedLanguage === language.code 
                        ? 'bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg' 
                        : 'hover:bg-primary/5 hover:border-primary/30'
                    }`}
                    onClick={() => handleLanguageSelect(language.code)}
                  >
                    <div className="text-2xl mb-1">{language.flag}</div>
                    <div className="text-center">
                      <div className="font-semibold text-sm">{language.name}</div>
                      <div className="text-xs opacity-70 mt-1">{language.nativeName}</div>
                      <div className="text-xs opacity-60 mt-1">{language.description}</div>
                    </div>
                    {selectedLanguage === language.code && (
                      <Check className="h-4 w-4 text-primary-foreground" />
                    )}
                  </Button>
                ))}
              </div>
              
              {selectedLanguage && (
                <div className="text-center pt-6 border-t border-border">
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-2">Selected Language:</p>
                    <Badge variant="secondary" className="text-base px-4 py-2">
                      {selectedLang?.flag} {selectedLang?.name} ({selectedLang?.nativeName})
                    </Badge>
                  </div>
                  <Button 
                    onClick={handleContinue}
                    disabled={isAnimating}
                    className="px-8 py-3 text-lg font-medium bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300"
                    size="lg"
                  >
                    {isAnimating ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Loading...
                      </div>
                    ) : (
                      <>
                        <Check className="h-5 w-5 mr-2" />
                        Continue to KrishiSettu
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              You can change your language preference anytime from the settings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}