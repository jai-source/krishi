import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  CheckCircle, 
  Truck, 
  CreditCard, 
  MapPin, 
  Calendar,
  Package,
  Phone
} from "lucide-react";
import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";

const Logistics = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  
  const [orderDetails] = useState({
    cropName: "Organic Wheat",
    farmer: "Ravi Kumar",
    quantity: "500 kg",
    finalPrice: "₹27.50/kg",
    totalAmount: "₹13,750",
    buyerName: "Farm Fresh Co.",
    pickupLocation: "Village Rampur, Punjab",
    deliveryLocation: "Green Valley Warehouse, Delhi"
  });

  const handlePayment = () => {
    // Simulate payment processing
    setTimeout(() => {
      setPaymentComplete(true);
      toast({
        title: t("toast.paymentSuccessTitle"),
        description: t("toast.paymentSuccessDescription"),
        variant: "default"
      });
    }, 2000);
  };

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingComplete(true);
    toast({
      title: t("toast.logisticsBookedTitle"),
      description: t("toast.logisticsBookedDescription"),
      variant: "default"
    });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{t("logistics.title")}</h1>
          <p className="text-muted-foreground">{t("logistics.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2 text-primary" />
                  {t("logistics.orderSummary")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("logistics.crop")}</span>
                    <span className="font-medium">{orderDetails.cropName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("logistics.farmer")}</span>
                    <span className="font-medium">{orderDetails.farmer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("logistics.quantity")}</span>
                    <span className="font-medium">{orderDetails.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("logistics.finalPrice")}</span>
                    <span className="font-medium">{orderDetails.finalPrice}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>{t("logistics.totalAmount")}</span>
                    <span className="text-success">{orderDetails.totalAmount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-primary" />
                  {t("logistics.deliveryDetails")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">{t("logistics.pickupLocation")}</p>
                    <p className="font-medium">{orderDetails.pickupLocation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("logistics.deliveryLocation")}</p>
                    <p className="font-medium">{orderDetails.deliveryLocation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("logistics.buyer")}</p>
                    <p className="font-medium">{orderDetails.buyerName}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment & Booking */}
          <div className="space-y-6">
            {/* Payment Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-primary" />
                  {t("logistics.paymentProcessing")}
                  {paymentComplete && (
                    <Badge variant="default" className="ml-2">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {t("logistics.completed")}
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  {t("logistics.paymentDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!paymentComplete ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">{t("logistics.paymentDetails")}</h4>
                      <p className="text-sm text-muted-foreground">{t("logistics.amount")}: {orderDetails.totalAmount}</p>
                      <p className="text-sm text-muted-foreground">{t("logistics.paymentMethod")}: {t("logistics.upiBankTransfer")}</p>
                    </div>
                    <Button onClick={handlePayment} variant="success" className="w-full">
                      {t("logistics.processPayment", { amount: orderDetails.totalAmount })}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <CheckCircle className="h-12 w-12 text-success mx-auto mb-3" />
                    <h4 className="font-semibold text-success mb-2">{t("logistics.paymentSuccess")}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t("logistics.transactionId")}: TXN{Math.random().toString(36).substr(2, 9).toUpperCase()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Logistics Booking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="h-5 w-5 mr-2 text-primary" />
                  {t("logistics.transportationBooking")}
                  {bookingComplete && (
                    <Badge variant="default" className="ml-2">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {t("logistics.booked")}
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  {t("logistics.schedulePickupDelivery")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!bookingComplete ? (
                  <form onSubmit={handleBooking} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="pickupDate">{t("logistics.preferredPickupDate")}</Label>
                        <Input 
                          id="pickupDate" 
                          type="date" 
                          required 
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div>
                        <Label htmlFor="pickupTime">{t("logistics.preferredTime")}</Label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                          <option value="morning">{t("logistics.morning")}</option>
                          <option value="afternoon">{t("logistics.afternoon")}</option>
                          <option value="evening">{t("logistics.evening")}</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="vehicleType">{t("logistics.vehicleType")}</Label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option value="small-truck">{t("logistics.smallTruck")}</option>
                        <option value="medium-truck">{t("logistics.mediumTruck")}</option>
                        <option value="large-truck">{t("logistics.largeTruck")}</option>
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="contactNumber">{t("logistics.contactNumber")}</Label>
                      <Input 
                        id="contactNumber" 
                        placeholder={t("logistics.contactNumberPlaceholder")} 
                        required 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="specialInstructions">{t("logistics.specialInstructions")}</Label>
                      <Input 
                        id="specialInstructions" 
                        placeholder={t("logistics.specialInstructionsPlaceholder")} 
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      variant="hero" 
                      className="w-full"
                      disabled={!paymentComplete}
                    >
                      {t("logistics.bookTransportation")}
                    </Button>
                    
                    {!paymentComplete && (
                      <p className="text-xs text-muted-foreground text-center">
                        {t("logistics.completePaymentFirst")}
                      </p>
                    )}
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center py-6">
                      <Truck className="h-12 w-12 text-success mx-auto mb-3" />
                      <h4 className="font-semibold text-success mb-2">{t("logistics.transportationBooked")}</h4>
                      <p className="text-sm text-muted-foreground">
                        {t("logistics.bookingId")}: BK{Math.random().toString(36).substr(2, 9).toUpperCase()}
                      </p>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-lg">
                      <h5 className="font-medium mb-2">{t("logistics.driverDetails")}</h5>
                      <div className="space-y-1 text-sm">
                        <p><strong>{t("logistics.driverName")}:</strong> Rajesh Kumar</p>
                        <p><strong>{t("logistics.driverPhone")}:</strong> +91 98765 43210</p>
                        <p><strong>{t("logistics.vehicle")}:</strong> HR-26-AB-1234</p>
                        <p><strong>{t("logistics.eta")}:</strong> {t("logistics.tomorrow10AM")}</p>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      <Phone className="h-4 w-4 mr-2" />
                      {t("logistics.contactDriver")}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Success State */}
        {paymentComplete && bookingComplete && (
          <Card className="mt-8 border-success">
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-success mb-2">
                  {t("logistics.orderComplete")}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {t("logistics.orderCompleteDescription")}
                </p>
                <Button variant="outline">
                  {t("logistics.trackOrder")}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Logistics;