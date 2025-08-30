import { EventCard } from "@/components/EventCard";
import { Header } from "@/components/Header";
import { Event } from "@/types/event";
import { useEffect, useState } from "react";

// Mock data - TODO: Replace with Supabase integration
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
    image: "https://s3.amazonaws.com/tikiti.ke/01K3TG349RVC4HVYFJ0G5KE7KQ.jpeg",
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

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Backend integration - fetch from Supabase
    // const fetchEvents = async () => {
    //   try {
    //     const { data, error } = await supabase
    //       .from('events')
    //       .select(`
    //         *,
    //         ticket_categories (*)
    //       `)
    //       .order('date', { ascending: true });
    //     
    //     if (error) throw error;
    //     setEvents(data || []);
    //   } catch (error) {
    //     console.error('Error fetching events:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchEvents();

    // Mock data for now
    setTimeout(() => {
      setEvents(mockEvents);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Events Grid */}
      <main className="container mx-auto p-2 sm:p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 mt-4 sm:mt-8">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Events;