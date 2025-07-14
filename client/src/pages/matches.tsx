import { useQuery, useMutation } from "@tanstack/react-query";
import { User, Match } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Heart, Users, Star } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const CURRENT_USER_ID = 1;

export default function Matches() {
  const { toast } = useToast();

  const { data: matches = [], isLoading } = useQuery({
    queryKey: ["/api/matches/mutual", CURRENT_USER_ID],
  });

  const { data: pendingMatches = [] } = useQuery({
    queryKey: ["/api/matches/user", CURRENT_USER_ID],
    select: (data) => data.filter((match: Match) => match.status === 'pending'),
  });

  const updateMatchMutation = useMutation({
    mutationFn: async ({ matchId, status }: { matchId: number; status: string }) => {
      const response = await apiRequest("PUT", `/api/matches/${matchId}`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
      toast({
        title: "Match updated",
        description: "Your match status has been updated!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update match",
        variant: "destructive",
      });
    },
  });

  const handleMessage = (userId: number) => {
    toast({
      title: "Message feature",
      description: "Visit the Messages page to start chatting!",
    });
  };

  const handleAcceptMatch = (matchId: number) => {
    updateMatchMutation.mutate({ matchId, status: 'matched' });
  };

  const handleRejectMatch = (matchId: number) => {
    updateMatchMutation.mutate({ matchId, status: 'rejected' });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-2xl h-64 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate mb-4">Your Matches</h1>
        <p className="text-xl text-gray-600">
          Connect with people who share your fitness passion
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">{matches.length}</div>
            <div className="text-sm text-gray-600">Mutual Matches</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-secondary mb-1">{pendingMatches.length}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-accent mb-1">8</div>
            <div className="text-sm text-gray-600">Active Chats</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-warning mb-1">92%</div>
            <div className="text-sm text-gray-600">Match Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Mutual Matches */}
      {matches.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate mb-4 flex items-center">
            <Heart className="mr-2 text-red-500" />
            Mutual Matches
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match: any) => (
              <Card key={match.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img 
                    src={match.user?.profileImage || "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"} 
                    alt={match.user?.name} 
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-accent text-white p-1 rounded-full">
                    <Star size={16} />
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-slate">{match.user?.name}, {match.user?.age}</h3>
                    <span className="text-sm text-gray-500">
                      {Math.floor(Math.random() * 24) + 1}h ago
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {match.user?.bio}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {match.user?.workoutTypes?.slice(0, 2).map((type: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                  </div>
                  <Button 
                    onClick={() => handleMessage(match.user?.id)}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    <MessageCircle className="mr-2" size={16} />
                    Message
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Pending Matches */}
      {pendingMatches.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate mb-4 flex items-center">
            <Users className="mr-2 text-secondary" />
            People Who Liked You
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingMatches.map((match: Match) => (
              <Card key={match.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src="https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-slate">Someone liked you!</h3>
                      <p className="text-sm text-gray-600">
                        {Math.floor(Math.random() * 24) + 1}h ago
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => handleAcceptMatch(match.id)}
                      className="flex-1 bg-accent hover:bg-accent/90"
                      disabled={updateMatchMutation.isPending}
                    >
                      Accept
                    </Button>
                    <Button 
                      onClick={() => handleRejectMatch(match.id)}
                      variant="outline"
                      className="flex-1"
                      disabled={updateMatchMutation.isPending}
                    >
                      Pass
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {matches.length === 0 && pendingMatches.length === 0 && (
        <div className="text-center py-12">
          <Heart className="mx-auto mb-4 text-gray-400" size={48} />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No matches yet</h3>
          <p className="text-gray-500 mb-6">
            Start swiping to find your perfect workout partner!
          </p>
          <Button className="bg-primary hover:bg-primary/90">
            Discover People
          </Button>
        </div>
      )}
    </div>
  );
}
