import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wheat, ShoppingCart, Eye, EyeOff } from "lucide-react";
import { loginUser, registerFarmer, registerBuyer } from "@/Firebase/authService";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginRegister = ({ onClose, initialMode = "login" }) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const { setUserData, setUserType } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState(initialMode); // "login" or "register"
  const [userType, setCurrentUserType] = useState("farmer"); // "farmer" or "buyer"
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    // Farmer fields
    fullName: "",
    farmLocation: "",
    farmSize: "",
    phoneNumber: "",
    aadharNumber: "",
    // Buyer fields
    businessName: "",
    businessType: "",
    businessLocation: "",
    contactPerson: "",
    gstNumber: ""
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { user, userData, userType: loggedInUserType } = await loginUser(formData.email, formData.password);
      
      setUserData(userData);
      setUserType(loggedInUserType);
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${userData?.fullName || userData?.businessName || userData?.contactPerson}!`,
      });      // Navigate to appropriate dashboard with enhanced routing logic
      if (loggedInUserType === "farmer") {
        console.log('🔍 Navigating to farmer dashboard');
        localStorage.setItem('FORCE_FARMER_SESSION', 'true');
        localStorage.removeItem('FORCE_BUYER_SESSION');
        navigate("/farmer-dashboard");
      } else if (loggedInUserType === "buyer") {
        console.log('🔍 Navigating to buyer dashboard');
        // EMERGENCY FIX: Set buyer session flag for login too
        localStorage.setItem('FORCE_BUYER_SESSION', 'true');
        localStorage.removeItem('FORCE_FARMER_SESSION');
        navigate("/buyer-dashboard");
      } else {
        // EMERGENCY FIX: If userType is unclear but userData suggests buyer, go to buyer dashboard
        if (userData && (userData.businessName || userData.gstNumber || userData.contactPerson)) {
          console.log('🚨 EMERGENCY: userData suggests buyer, forcing buyer dashboard');
          localStorage.setItem('FORCE_BUYER_SESSION', 'true');
          localStorage.removeItem('FORCE_FARMER_SESSION');
          navigate("/buyer-dashboard");
        } else if (userData && (userData.fullName || userData.farmLocation || userData.aadharNumber)) {
          console.log('🚨 EMERGENCY: userData suggests farmer, forcing farmer dashboard');
          localStorage.setItem('FORCE_FARMER_SESSION', 'true');
          localStorage.removeItem('FORCE_BUYER_SESSION');
          navigate("/farmer-dashboard");
        } else {
          console.log('🚨 EMERGENCY: Unclear user type, defaulting to home');
          navigate("/");
        }
      }

      onClose && onClose();
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log('🔍 Starting registration process for userType:', userType);
    console.log('🔍 Form data:', formData);

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      let result;      let registeredUserType;
      if (userType === "farmer") {
        console.log('🔍 Registering as farmer...');
        result = await registerFarmer(formData.email, formData.password, {
          fullName: formData.fullName,
          farmLocation: formData.farmLocation,
          farmSize: formData.farmSize,
          phoneNumber: formData.phoneNumber,
          aadharNumber: formData.aadharNumber
        });
        
        if (result && result.userData) {
          console.log('✅ Setting farmer data and user type');
          setUserData(result.userData);
          setUserType("farmer");
          registeredUserType = "farmer";
        } else {
          console.error('❌ Farmer registration completed but user data is missing');
          throw new Error('Registration completed but user data is missing');
        }
      } else {
        console.log('🔍 Registering as buyer...');
        console.log('🔍 Current userType state:', userType);
        console.log('🔍 Form data for buyer:', {
          businessName: formData.businessName,
          businessType: formData.businessType,
          businessLocation: formData.businessLocation,
          contactPerson: formData.contactPerson,
          phoneNumber: formData.phoneNumber,
          gstNumber: formData.gstNumber
        });
        
        result = await registerBuyer(formData.email, formData.password, {
          businessName: formData.businessName,
          businessType: formData.businessType,
          businessLocation: formData.businessLocation,
          contactPerson: formData.contactPerson,
          phoneNumber: formData.phoneNumber,
          gstNumber: formData.gstNumber
        });
        console.log('🔍 Buyer registration result:', result);
        
        if (result && result.userData) {
          console.log('✅ Setting buyer data and user type');
          setUserData(result.userData);
          setUserType("buyer");
          registeredUserType = "buyer";
          console.log('✅ registeredUserType set to:', registeredUserType);
          
          // Ensure AuthContext is updated by waiting a bit
          await new Promise(resolve => setTimeout(resolve, 100));
        } else {
          console.error('❌ Registration completed but user data is missing');
          throw new Error('Registration completed but user data is missing');
        }
      }
        console.log('✅ Registration completed successfully:', result);
      console.log('🔍 Final registeredUserType:', registeredUserType);
      
      toast({
        title: "Registration Successful",
        description: `Welcome to KrishiSettu, ${formData.fullName || formData.contactPerson}!`,
      });      // Navigate to appropriate dashboard
      console.log('🔍 About to navigate based on registeredUserType:', registeredUserType);
      if (registeredUserType === "farmer") {
        console.log('🔍 Navigating to farmer dashboard');
        navigate("/farmer-dashboard");
      } else if (registeredUserType === "buyer") {
        console.log('🔍 Navigating to buyer dashboard');
        // EMERGENCY FIX: Set buyer session flag immediately
        localStorage.setItem('FORCE_BUYER_SESSION', 'true');
        
        // Pass state to indicate this is a fresh registration
        navigate("/buyer-dashboard", { 
          state: { 
            justRegistered: true, 
            userType: "buyer",
            userData: result.userData 
          } 
        });
      } else {
        console.error('❌ Unknown registeredUserType:', registeredUserType);
        console.log('🔍 Fallback navigation based on userType state:', userType);
        if (userType === "buyer") {
          // EMERGENCY FIX: Set buyer session flag
          localStorage.setItem('FORCE_BUYER_SESSION', 'true');
          navigate("/buyer-dashboard", { 
            state: { 
              justRegistered: true, 
              userType: "buyer" 
            } 
          });
        } else {
          navigate("/farmer-dashboard");
        }
      }

      onClose && onClose();
    } catch (error) {
      console.error('❌ Registration failed:', error);
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderLoginForm = () => (
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder={`${userType}@example.com`}
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      <Button type="submit" className="w-full" variant="hero" disabled={loading}>
        {loading ? "Signing in..." : `Sign in as ${userType.charAt(0).toUpperCase() + userType.slice(1)}`}
      </Button>
      <div className="text-center">
        <Button 
          type="button" 
          variant="link" 
          onClick={() => setMode("register")}
        >
          Don't have an account? Register here
        </Button>
      </div>
    </form>
  );

  const renderFarmerRegistrationForm = () => (
    <form onSubmit={handleRegistration} className="space-y-4">
      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          name="fullName"
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={handleInputChange}
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
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Create a password (min 6 characters)"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="farmLocation">Farm Location</Label>
        <Input
          id="farmLocation"
          name="farmLocation"
          placeholder="Enter farm location"
          value={formData.farmLocation}
          onChange={handleInputChange}
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
          value={formData.farmSize}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          placeholder="Enter phone number"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="aadharNumber">Aadhar Number</Label>
        <Input
          id="aadharNumber"
          name="aadharNumber"
          placeholder="Enter Aadhar number"
          value={formData.aadharNumber}
          onChange={handleInputChange}
          required
        />
      </div>
      <Button type="submit" className="w-full" variant="hero" disabled={loading}>
        {loading ? "Registering..." : "Register as Farmer"}
      </Button>
      <div className="text-center">
        <Button 
          type="button" 
          variant="link" 
          onClick={() => setMode("login")}
        >
          Already have an account? Login here
        </Button>
      </div>
    </form>
  );

  const renderBuyerRegistrationForm = () => (
    <form onSubmit={handleRegistration} className="space-y-4">
      <div>
        <Label htmlFor="businessName">Business Name</Label>
        <Input
          id="businessName"
          name="businessName"
          placeholder="Enter business name"
          value={formData.businessName}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="contactPerson">Contact Person</Label>
        <Input
          id="contactPerson"
          name="contactPerson"
          placeholder="Enter contact person name"
          value={formData.contactPerson}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="buyer@example.com"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Create a password (min 6 characters)"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="businessType">Business Type</Label>
        <Input
          id="businessType"
          name="businessType"
          placeholder="e.g., Wholesaler, Retailer, Processor"
          value={formData.businessType}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="businessLocation">Business Location</Label>
        <Input
          id="businessLocation"
          name="businessLocation"
          placeholder="Enter business location"
          value={formData.businessLocation}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          placeholder="Enter phone number"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="gstNumber">GST Number (Optional)</Label>
        <Input
          id="gstNumber"
          name="gstNumber"
          placeholder="Enter GST number"
          value={formData.gstNumber}
          onChange={handleInputChange}
        />
      </div>
      <Button type="submit" className="w-full" variant="hero" disabled={loading}>
        {loading ? "Registering..." : "Register as Buyer"}
      </Button>
      <div className="text-center">
        <Button 
          type="button" 
          variant="link" 
          onClick={() => setMode("login")}
        >
          Already have an account? Login here
        </Button>
      </div>
    </form>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">
                {mode === "login" ? "Login to KrishiSettu" : "Join KrishiSettu"}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
            </div>
            <CardDescription>
              {mode === "login" 
                ? "Sign in to your farmer or buyer account" 
                : "Create your farmer or buyer account"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={userType} onValueChange={setCurrentUserType} className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="farmer" className="flex items-center">
                  <Wheat className="h-4 w-4 mr-2" />
                  Farmer
                </TabsTrigger>
                <TabsTrigger value="buyer" className="flex items-center">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Buyer
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="farmer">
                {mode === "login" 
                  ? renderLoginForm() 
                  : renderFarmerRegistrationForm()
                }
              </TabsContent>
              
              <TabsContent value="buyer">
                {mode === "login" 
                  ? renderLoginForm() 
                  : renderBuyerRegistrationForm()
                }
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginRegister;
