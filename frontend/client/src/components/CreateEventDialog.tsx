import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { CalendarEvent } from "@/lib/types";

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialDate?: string;
}

export default function CreateEventDialog({
  open,
  onOpenChange,
  initialDate,
}: CreateEventDialogProps) {
  const today = new Date().toISOString().split("T")[0];
  
  const [title, setTitle] = useState("");
  const [type, setType] = useState<CalendarEvent["type"]>("create-playlist");
  const [date, setDate] = useState(initialDate || today);
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  
  const { addEvent } = useAuth();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !date) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    const newEvent: Omit<CalendarEvent, "id"> = {
      title,
      type,
      date,
      time: time || undefined,
      description: description || undefined,
      color: getEventColor(type),
    };
    
    addEvent(newEvent);
    
    toast({
      title: "Success",
      description: "Event created successfully!",
    });
    
    // Reset form and close dialog
    resetForm();
    onOpenChange(false);
  };
  
  const resetForm = () => {
    setTitle("");
    setType("create-playlist");
    setDate(today);
    setTime("");
    setDescription("");
  };
  
  const getEventColor = (eventType: CalendarEvent["type"]): string => {
    switch (eventType) {
      case "create-playlist":
        return "green";
      case "listen-playlist":
        return "blue";
      case "discover-music":
        return "purple";
      default:
        return "green";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#282828] text-white border-none sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create Music Event</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label className="text-sm font-medium mb-2" htmlFor="event-title">
              Event Title
            </Label>
            <Input
              type="text"
              id="event-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-[#121212] border border-gray-700 focus:border-[#1DB954] text-white"
              placeholder="Listen to Chill Vibes"
              required
            />
          </div>
          
          <div className="mb-4">
            <Label className="text-sm font-medium mb-2" htmlFor="event-type">
              Event Type
            </Label>
            <Select
              value={type}
              onValueChange={(value) => setType(value as CalendarEvent["type"])}
            >
              <SelectTrigger className="w-full px-3 py-2 bg-[#121212] border border-gray-700 focus:border-[#1DB954] text-white">
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent className="bg-[#181818] text-white border-gray-700">
                <SelectItem value="create-playlist">Create Playlist</SelectItem>
                <SelectItem value="listen-playlist">Listen to Playlist</SelectItem>
                <SelectItem value="discover-music">Discover New Music</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="mb-4">
            <Label className="text-sm font-medium mb-2" htmlFor="event-date">
              Date
            </Label>
            <Input
              type="date"
              id="event-date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 bg-[#121212] border border-gray-700 focus:border-[#1DB954] text-white"
              required
            />
          </div>
          
          <div className="mb-4">
            <Label className="text-sm font-medium mb-2" htmlFor="event-time">
              Time (optional)
            </Label>
            <Input
              type="time"
              id="event-time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 bg-[#121212] border border-gray-700 focus:border-[#1DB954] text-white"
            />
          </div>
          
          <div className="mb-6">
            <Label className="text-sm font-medium mb-2" htmlFor="event-description">
              Description (optional)
            </Label>
            <Textarea
              id="event-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-[#121212] border border-gray-700 focus:border-[#1DB954] text-white resize-none"
              placeholder="Add details about your music event"
              rows={3}
            />
          </div>
          
          <DialogFooter className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white border-none"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-4 py-2 bg-[#1DB954] hover:bg-opacity-80 text-white"
            >
              Create Event
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
