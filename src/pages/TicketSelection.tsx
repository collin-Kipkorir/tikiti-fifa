import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/Header";
import { Event, CartItem } from "@/types/event";
import { useToast } from "@/hooks/use-toast";

// Mock data - same as Events page for consistency
const mockEvents: Event[] = [
  {
    id: "1",
    title: "Kenya vs Gambia",
    description: "2026 World Cup Qualifiers",
    date: "FRIDAY 5TH, SEPTEMBER",
    time: "4:00 PM",
    venue: "MOI INTERNATIONAL SPORTS CENTRE (MISC), KASARANI",
    location: "Nairobi, Kenya",
    image: "https://s3.amazonaws.com/tikiti.ke/01K3TG4B17ADWFSYH0WE7PS33Z.jpeg",
    teams: {
      home: { name: "Kenya", flag: "🇰🇪" },
      away: { name: "Gambia", flag: "🇬🇲" }
    },
    categories: [
      { id: "1", name: "Regular", price: 300, currency: "KES", available: 100 },
      { id: "2", name: "Silver", price: 500, currency: "KES", available: 50 },
      { id: "3", name: "VIP", price: 2000, currency: "KES", available: 20 },
      { id: "4", name: "VVIP", price: 5000, currency: "KES", available: 10 }
    ]
  },
  {
    id: "2", 
    title: "Kenya vs Seychelles",
    description: "2026 World Cup Qualifiers",
    date: "TUESDAY 9TH, SEPTEMBER",
    time: "4:00 PM", 
    venue: "MOI INTERNATIONAL SPORTS CENTRE (MISC), KASARANI",
    location: "Nairobi, Kenya",
    image: "https://s3.amazonaws.com/tikiti.ke/01K3TG4B17ADWFSYH0WE7PS34A.jpeg",
    teams: {
      home: { name: "Kenya", flag: "🇰🇪" },
      away: { name: "Seychelles", flag: "🇸🇨" }
    },
    categories: [
      { id: "1", name: "Regular", price: 300, currency: "KES", available: 100 },
      { id: "2", name: "Silver", price: 500, currency: "KES", available: 50 },
      { id: "3", name: "VIP", price: 2000, currency: "KES", available: 20 },
      { id: "4", name: "VVIP", price: 5000, currency: "KES", available: 10 }
    ]
  }
];

const TicketSelection = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [event, setEvent] = useState<Event | null>(null);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);

  // Auto-scroll to bottom when tickets are selected
  useEffect(() => {
    const totalQuantity = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
    if (totalQuantity > 0) {
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    }
  }, [quantities]);

  useEffect(() => {
    // TODO: Backend integration - fetch specific event from Supabase
    // const fetchEvent = async () => {
    //   try {
    //     const { data, error } = await supabase
    //       .from('events')
    //       .select(`
    //         *,
    //         ticket_categories (*)
    //       `)
    //       .eq('id', eventId)
    //       .single();
    //     
    //     if (error) throw error;
    //     setEvent(data);
    //   } catch (error) {
    //     console.error('Error fetching event:', error);
    //     navigate('/');
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchEvent();

    // Mock data for now
    const foundEvent = mockEvents.find(e => e.id === eventId);
    if (foundEvent) {
      setEvent(foundEvent);
    } else {
      navigate('/');
    }
    setLoading(false);
  }, [eventId, navigate]);

  const handleQuantityChange = (categoryId: string, quantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [categoryId]: Math.max(0, quantity)
    }));
  };

  const calculateTotal = () => {
    if (!event) return 0;
    return event.categories.reduce((total, category) => {
      const quantity = quantities[category.id] || 0;
      return total + (category.price * quantity);
    }, 0);
  };

  const handleContinue = () => {
    const selectedItems = Object.entries(quantities)
      .filter(([_, quantity]) => quantity > 0)
      .map(([categoryId, quantity]) => {
        const category = event?.categories.find(c => c.id === categoryId);
        return {
          eventId: eventId!,
          categoryId,
          quantity,
          price: category?.price || 0
        };
      });

    if (selectedItems.length === 0) {
      toast({
        title: "No tickets selected",
        description: "Please select at least one ticket to continue.",
        variant: "destructive"
      });
      return;
    }

    // Navigate to checkout with cart data
    navigate(`/checkout/${eventId}`, { 
      state: { cartItems: selectedItems, event } 
    });
  };

  if (loading || !event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="px-2 sm:px-4">
        {/* Mobile-first layout matching reference images */}
        <div className="max-w-md mx-auto lg:max-w-7xl lg:grid lg:grid-cols-2 lg:gap-8">
          
          {/* Event Poster */}
          <div className="mb-4 lg:mb-0">
            <img 
              src={event.image || "https://s3.amazonaws.com/tikiti.ke/01K3TG4B17ADWFSYH0WE7PS33Z.jpeg"} 
              alt={event.title}
              className="w-full h-auto rounded-lg"
            />
          </div>

          {/* Ticket Selection */}
          <div className="space-y-2">
            {event.categories.map((category) => (
              <div key={category.id} className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-sm text-gray-900">{category.name}</h3>
                  </div>
                  <p className="font-bold text-sm">
                    {category.currency} {category.price.toLocaleString()}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <Input
                    type="number"
                    min="0"
                    max={category.available}
                    value={quantities[category.id] || 0}
                    onChange={(e) => handleQuantityChange(category.id, parseInt(e.target.value) || 0)}
                    className="w-12 h-8 text-center text-xs border-gray-300"
                  />
                  <Button
                    className="h-8 px-4 text-xs font-semibold rounded bg-tikiti-yellow hover:bg-tikiti-yellow/90 text-black"
                    onClick={() => handleQuantityChange(category.id, (quantities[category.id] || 0) + 1)}
                  >
                    Purchase
                  </Button>
                </div>
              </div>
            ))}

            {/* Event Info */}
            <div className="bg-gray-50 rounded-lg p-3 mt-4">
              <h4 className="font-bold text-sm mb-1">{event.title}</h4>
              <p className="text-xs text-gray-600 mb-1">{event.description}</p>
              <p className="text-xs text-gray-600 mb-1">No tickets will be sold at the venue</p>
              <p className="text-xs text-gray-600">Kickoff {event.time}</p>
            </div>

            {/* Total and Continue */}
            {calculateTotal() > 0 && (
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-600">Total</p>
                  <p className="text-lg font-bold">KES {calculateTotal().toLocaleString()}</p>
                </div>
                <Button
                  onClick={handleContinue}
                  className="bg-tikiti-green hover:bg-tikiti-green/90 text-white font-semibold px-6 h-10 text-sm"
                >
                  Continue Shopping
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketSelection;