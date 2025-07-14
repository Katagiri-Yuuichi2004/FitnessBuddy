import { User } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle } from "lucide-react";

interface UserCardProps {
  user: User;
  onConnect: (userId: number) => void;
  onMessage: (userId: number) => void;
  onLike?: (userId: number) => void;
  showDistance?: boolean;
}

export default function UserCard({ user, onConnect, onMessage, onLike, showDistance = true }: UserCardProps) {
  const distance = showDistance ? `${(Math.random() * 2 + 0.1).toFixed(1)} miles away` : null;

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img 
          src={user.profileImage || `https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300`} 
          alt={`${user.name}'s profile`} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4 bg-white rounded-full p-2">
          <Heart 
            className={`cursor-pointer ${Math.random() > 0.7 ? 'text-red-500' : 'text-gray-400'} hover:text-red-500`}
            size={20}
            onClick={() => onLike?.(user.id)}
          />
        </div>
      </div>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold text-slate">{user.name}, {user.age}</h3>
          {distance && <span className="text-sm text-gray-500">{distance}</span>}
        </div>
        <p className="text-gray-600 mb-3">{user.bio}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {user.workoutTypes?.slice(0, 2).map((type, index) => (
            <Badge key={index} variant="secondary" className="bg-primary bg-opacity-20 text-primary">
              {type}
            </Badge>
          ))}
          <Badge variant="secondary" className="bg-accent bg-opacity-20 text-accent">
            {user.preferredTime}
          </Badge>
          <Badge variant="secondary" className="bg-secondary bg-opacity-20 text-secondary">
            {user.experienceLevel}
          </Badge>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={() => onConnect(user.id)} 
            className="flex-1 bg-primary hover:bg-primary/90 text-white"
          >
            Connect
          </Button>
          <Button 
            onClick={() => onMessage(user.id)} 
            variant="outline" 
            size="icon"
            className="hover:bg-gray-100"
          >
            <MessageCircle size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
