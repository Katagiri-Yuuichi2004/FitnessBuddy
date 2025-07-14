import { User } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Heart, Zap } from "lucide-react";

interface MatchCardProps {
  user: User;
  onPass: (userId: number) => void;
  onLike: (userId: number) => void;
}

export default function MatchCard({ user, onPass, onLike }: MatchCardProps) {
  const distance = `${(Math.random() * 2 + 0.5).toFixed(1)} miles away`;

  return (
    <div className="relative max-w-sm mx-auto">
      <Card className="rounded-3xl shadow-2xl overflow-hidden">
        <div className="relative">
          <img 
            src={user.profileImage || `https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500`} 
            alt={`${user.name}'s profile`} 
            className="w-full h-96 object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
            <h3 className="text-2xl font-bold text-white mb-2">{user.name}, {user.age}</h3>
            <p className="text-white text-sm mb-2">{distance}</p>
            <div className="flex flex-wrap gap-2">
              {user.workoutTypes?.slice(0, 2).map((type, index) => (
                <Badge key={index} className="bg-primary text-white">
                  {type}
                </Badge>
              ))}
              <Badge className="bg-accent text-white">
                {user.preferredTime}
              </Badge>
            </div>
          </div>
        </div>
        <CardContent className="p-6">
          <p className="text-gray-600 mb-4">{user.bio}</p>
          <div className="flex items-center justify-center space-x-8">
            <Button 
              onClick={() => onPass(user.id)}
              size="icon"
              variant="outline"
              className="w-16 h-16 rounded-full bg-gray-200 hover:bg-gray-300 border-0"
            >
              <X className="text-gray-600" size={24} />
            </Button>
            <Button 
              onClick={() => onLike(user.id)}
              size="icon"
              className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90"
            >
              <Heart className="text-white" size={24} />
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-accent text-white px-4 py-2 rounded-full text-sm font-medium">
        <Zap size={16} className="inline mr-1" />
        Super Match Available
      </div>
    </div>
  );
}
