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

const Login = ({ onClose }) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const { setUserData, setUserType } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    farmLocation: "",
    farmSize: "",
    phoneNumber: "",
    aadharNumber: "",
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
  const handleLogin = async (e, userType) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { user, userData, userType: loggedInUserType } = await loginUser(formData.email, formData.password);
      
      setUserData(userData);
      setUserType(loggedInUserType);
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${userData?.fullName || userData?.businessName || userData?.contactPerson}!`,
      });

      // Navigate to appropriate dashboard
      if (loggedInUserType === "farmer") {
        navigate("/farmer-dashboard");
      } else {
        navigate("/buyer-dashboard");
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

  const handleRegistration = async (e, userType) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      let result;
      if (userType === "farmer") {
        result = await registerFarmer(formData.email, formData.password, {
          fullName: formData.fullName,
          farmLocation: formData.farmLocation,
          farmSize: formData.farmSize,
          phoneNumber: formData.phoneNumber,
          aadharNumber: formData.aadharNumber
        });
        setUserType("farmer");
      } else {
        result = await registerBuyer(formData.email, formData.password, {
          businessName: formData.businessName,
          businessType: formData.businessType,
          businessLocation: formData.businessLocation,
          contactPerson: formData.contactPerson,
          phoneNumber: formData.phoneNumber,
          gstNumber: formData.gstNumber
        });
        setUserType("buyer");
      }
      
      toast({
        title: "Registration Successful",
        description: `Welcome to KrishiSettu, ${formData.fullName || formData.contactPerson}!`,
      });

      // Navigate to appropriate dashboard
      if (userType === "farmer") {
        navigate("/farmer-dashboard");
      } else {
        navigate("/buyer-dashboard");
      }

      onClose && onClose();
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="max-w-md w-full mx-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">Login to KrishiSettu</CardTitle>
              <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
            </div>
            <CardDescription>
              Sign in to your farmer or buyer account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="farmer" className="space-y-4">
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
                <form onSubmit={handleLogin} className="space-y-4">
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
                    {loading ? "Signing in..." : "Sign in as Farmer"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="buyer">
                <form onSubmit={handleLogin} className="space-y-4">
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
                    {loading ? "Signing in..." : "Sign in as Buyer"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
