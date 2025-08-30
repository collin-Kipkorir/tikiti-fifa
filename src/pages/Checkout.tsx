import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/Header";
import { Event, CartItem, BillingDetails } from "@/types/event";
import { useToast } from "@/hooks/use-toast";

const Checkout = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { cartItems, event } = location.state as { cartItems: CartItem[], event: Event } || {};
  
  const [billingDetails, setBillingDetails] = useState<BillingDetails>({
    name: "",
    email: "",
    phone: "",
    paymentMethod: "M-Pesa"
  });
  
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!cartItems || !event) {
      toast({
        title: "Invalid checkout session",
        description: "Please select tickets first.",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [cartItems, event, navigate, toast]);

  const calculateSubtotal = () => {
    return cartItems?.reduce((total, item) => total + (item.price * item.quantity), 0) || 0;
  };

  const handleInputChange = (field: keyof BillingDetails, value: string) => {
    setBillingDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCompleteOrder = async () => {
    // Validate form
    if (!billingDetails.name || !billingDetails.email || !billingDetails.phone) {
      toast({
        title: "Please fill all fields",
        description: "All billing details are required to complete your order.",
        variant: "destructive"
      });
      return;
    }

    // Validate phone number format for M-Pesa
    if (billingDetails.paymentMethod === "M-Pesa" && !billingDetails.phone.match(/^(254|0)[0-9]{9}$/)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid Kenyan phone number for M-Pesa payments.",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);

    try {
      // TODO: Backend integration - Complete order process
      // 1. Save order to Supabase
      // const { data: order, error: orderError } = await supabase
      //   .from('orders')
      //   .insert({
      //     event_id: eventId,
      //     items: cartItems,
      //     billing_details: billingDetails,
      //     total: calculateSubtotal(),
      //     status: 'pending'
      //   })
      //   .select()
      //   .single();

      // if (orderError) throw orderError;

      // 2. Initiate M-Pesa STK Push
      // const { data: paymentResponse, error: paymentError } = await supabase.functions.invoke('mpesa-stk-push', {
      //   body: {
      //     phone: billingDetails.phone,
      //     amount: calculateSubtotal(),
      //     orderId: order.id,
      //     description: `Tikiti - ${event.title} tickets`
      //   }
      // });

      // if (paymentError) throw paymentError;

      // 3. Handle payment success
      // - Update order status to 'completed'
      // - Generate and send e-ticket via email
      // - Redirect to success page

      // Mock successful payment for demo
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Payment Successful!",
        description: "Your e-ticket has been sent to your email.",
      });

      // Show success message
      toast({
        title: "Order completed successfully!",
        description: "Check your phone for M-Pesa confirmation and email for e-ticket.",
      });

      // Navigate back to events page
      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (error) {
      console.error('Order processing error:', error);
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleUpdateCart = () => {
    // Go back to ticket selection
    navigate(`/event/${eventId}`);
  };

  if (!cartItems || !event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Success Banner */}
      <div className="bg-green-100 border border-green-300 text-green-700 p-3 text-center text-sm">
        <span className="font-medium">Success!</span> Ticket added/updated in your cart successfully.
        <button className="ml-2 text-green-600 hover:text-green-800">×</button>
      </div>

      <Header />

      <div className="container mx-auto p-3 sm:p-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          {/* Order Summary - Left Side */}
          <Card className="shadow-sm">
            <CardHeader className="border-b">
              <CardTitle className="text-lg sm:text-xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              {/* Table Header */}
              <div className="grid grid-cols-5 gap-4 text-sm font-semibold border-b pb-3 mb-4">
                <span>Ticket</span>
                <span>Price</span>
                <span>Quantity</span>
                <span>Subtotal</span>
                <span>Remove</span>
              </div>
              
              {/* Table Rows */}
              {cartItems.map((item, index) => {
                const category = event.categories.find(c => c.id === item.categoryId);
                return (
                  <div key={index} className="grid grid-cols-5 gap-4 text-sm py-3 border-b">
                    <span className="font-medium">{category?.name || 'Regular'}</span>
                    <span>KES {item.price.toLocaleString()}</span>
                    <span>{item.quantity}</span>
                    <span>KES {(item.price * item.quantity).toLocaleString()}</span>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="text-xs h-7 w-16"
                      onClick={() => {
                        toast({
                          title: "Item removed",
                          description: "Ticket removed from cart."
                        });
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                );
              })}
              
              {/* Total */}
              <div className="flex justify-between font-bold text-base sm:text-lg mt-6 pt-4 border-t">
                <span>Total:</span>
                <span>KES {calculateSubtotal().toLocaleString()}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-6">
                <Button
                  variant="outline"
                  onClick={handleUpdateCart}
                  className="flex-1"
                >
                  Update Cart
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="flex-1"
                >
                  Continue Shopping
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Billing Details - Right Side */}
          <Card className="shadow-sm">
            <CardHeader className="border-b">
              <CardTitle className="text-lg sm:text-xl">Billing Details</CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium">Name</Label>
                <Input
                  id="name"
                  value={billingDetails.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={billingDetails.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email address"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
                <Input
                  id="phone"
                  value={billingDetails.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="0712345678"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Phone will be used for M-Pesa payment
                </p>
              </div>

              <div>
                <Label htmlFor="payment-method" className="text-sm font-medium">Payment Method</Label>
                <Select
                  value={billingDetails.paymentMethod}
                  onValueChange={(value) => handleInputChange('paymentMethod', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M-Pesa">M-Pesa</SelectItem>
                    <SelectItem value="Card" disabled>Card (Coming Soon)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleCompleteOrder}
                disabled={processing}
                className="w-full bg-tikiti-green hover:bg-tikiti-green/90 text-white font-bold mt-8 h-12"
              >
                {processing ? "Processing..." : "Complete Order"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 sm:mt-16 pb-6 sm:pb-8 text-gray-500">
          <p className="text-xs">© 2025 Tikiti. All Rights Reserved.</p>
          <button className="text-xs text-blue-600 hover:underline mt-1">
            Refund Policy
          </button>
        </footer>
      </div>
    </div>
  );
};

export default Checkout;