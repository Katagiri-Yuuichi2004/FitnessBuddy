import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import UserCard from "@/components/user-card";
import MatchCard from "@/components/match-card";
import { MapPin, Dumbbell, Heart, Users } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const CURRENT_USER_ID = 1;

export default function Home() {
  const [excludedIds, setExcludedIds] = useState<number[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const { toast } = useToast();

  const { data: nearbyUsers = [], isLoading } = useQuery({
    queryKey: ["/api/users", CURRENT_USER_ID, "nearby"],
    queryFn: async () => {
      const response = await fetch(`/api/users/${CURRENT_USER_ID}/nearby?exclude=${excludedIds.join(',')}`);
      return response.json();
    },
  });

  const createMatchMutation = useMutation({
    mutationFn: async ({ userId, status }: { userId: number; status: string }) => {
      const response = await apiRequest("POST", "/api/matches", {
        userId: CURRENT_USER_ID,
        matchedUserId: userId,
        status,
      });
      return response.json();
    },
    onSuccess: (data, variables) => {
      const action = variables.status === 'matched' ? 'liked' : 'passed';
      toast({
        title: action === 'liked' ? "Great choice!" : "Maybe next time",
        description: action === 'liked' ? "We'll let you know if they like you back!" : "There are plenty more matches to discover",
      });
      
      setExcludedIds(prev => [...prev, variables.userId]);
      setCurrentMatchIndex(prev => prev + 1);
      queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to process match",
        variant: "destructive",
      });
    },
  });

  const handleConnect = (userId: number) => {
    createMatchMutation.mutate({ userId, status: 'matched' });
  };

  const handleMessage = (userId: number) => {
    toast({
      title: "Message feature",
      description: "Visit the Messages page to start chatting!",
    });
  };

  const handleLike = (userId: number) => {
    createMatchMutation.mutate({ userId, status: 'matched' });
  };

  const handlePass = (userId: number) => {
    createMatchMutation.mutate({ userId, status: 'rejected' });
  };

  const displayUsers = nearbyUsers.filter((user: User) => !excludedIds.includes(user.id));
  const currentMatchUser = displayUsers[currentMatchIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-secondary text-white py-20">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Find Your Perfect<br />Workout Partner
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Connect with fitness enthusiasts in your area, share workout goals, and build lasting friendships through fitness.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-full font-semibold text-lg"
            >
              Start Matching
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 rounded-full font-semibold text-lg"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Discovery Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate mb-4">
              Discover Workout Partners
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find people who share your fitness goals and workout preferences in your area.
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8 flex flex-wrap gap-4 justify-center">
            <Button className="bg-primary text-white hover:bg-primary/90 rounded-full">
              <MapPin className="mr-2" size={16} />
              Nearby (2 mi)
            </Button>
            <Button variant="outline" className="rounded-full">
              <Dumbbell className="mr-2" size={16} />
              Strength Training
            </Button>
            <Button variant="outline" className="rounded-full">
              <Heart className="mr-2" size={16} />
              Cardio
            </Button>
            <Button variant="outline" className="rounded-full">
              <Users className="mr-2" size={16} />
              Yoga
            </Button>
          </div>

          {/* User Cards Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-2xl h-96 animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayUsers.slice(0, 6).map((user: User) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    onConnect={handleConnect}
                    onMessage={handleMessage}
                    onLike={handleLike}
                  />
                ))}
              </div>

              <div className="text-center mt-8">
                <Button variant="outline" className="rounded-full">
                  Load More Profiles
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Quick Match Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate mb-4">Quick Match</h2>
            <p className="text-xl text-gray-600">
              Swipe through potential workout partners in your area
            </p>
          </div>

          {currentMatchUser ? (
            <MatchCard
              user={currentMatchUser}
              onLike={handleLike}
              onPass={handlePass}
            />
          ) : (
            <div className="text-center">
              <p className="text-gray-500 text-lg">
                No more matches available. Check back later for new users!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
