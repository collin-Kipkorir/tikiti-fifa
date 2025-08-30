import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Event } from "@/types/event";
import { useNavigate } from "react-router-dom";

interface EventCardProps {
  event: Event;
}

export const EventCard = ({ event }: EventCardProps) => {
  const navigate = useNavigate();

  const handleViewEvent = () => {
    // Navigate to ticket selection page
    navigate(`/event/${event.id}`);
  };

  return (
    <Card className="w-full overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-card border-2 border-tikiti-purple">
      {/* Event Image */}
      {event.image && (
        <div className="relative overflow-hidden bg-muted">
          <img 
            src={event.image} 
            alt={event.title}
            className="w-full h-auto object-contain"
          />
        </div>
      )}
      
      {/* Event Content */}
      <CardContent className="p-3 sm:p-4 bg-white">
        {/* Event Title/Teams with purple background */}
        {event.teams ? (
          <div className="text-center mb-2 sm:mb-3 bg-tikiti-purple text-white p-2 sm:p-3 rounded-lg">
            <h3 className="font-bold text-lg sm:text-xl leading-tight">
              {event.teams.home.name.toUpperCase()} vs {event.teams.away.name.toUpperCase()}
            </h3>
          </div>
        ) : (
          <div className="text-center mb-2 sm:mb-3 bg-tikiti-purple text-white p-2 sm:p-3 rounded-lg">
            <h3 className="font-bold text-lg sm:text-xl leading-tight">{event.title}</h3>
          </div>
        )}

        {/* Venue */}
        <div className="text-center mb-2">
          <p className="text-xs sm:text-sm text-muted-foreground font-medium uppercase tracking-wide">{event.venue}</p>
        </div>

        {/* Date */}
        <div className="text-center mb-3 sm:mb-4">
          <p className="text-xs sm:text-sm text-muted-foreground font-medium uppercase">{event.date}</p>
        </div>

        {/* Purchase Button */}
        <Button 
          onClick={handleViewEvent}
          className="w-full bg-tikiti-purple hover:bg-tikiti-purple/90 text-white font-semibold py-2 sm:py-3 rounded-lg text-sm"
        >
          Purchase Tickets
        </Button>
      </CardContent>
    </Card>
  );
};