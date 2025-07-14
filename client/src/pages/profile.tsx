import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dumbbell, 
  Heart, 
  Users, 
  Edit, 
  Camera, 
  MapPin,
  Clock,
  Target,
  Activity 
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const CURRENT_USER_ID = 1;

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<User>>({});
  const { toast } = useToast();

  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/users", CURRENT_USER_ID],
  });

  const { data: matches = [] } = useQuery({
    queryKey: ["/api/matches/mutual", CURRENT_USER_ID],
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<User>) => {
      const response = await apiRequest("PUT", `/api/users/${CURRENT_USER_ID}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", CURRENT_USER_ID] });
      setIsEditing(false);
      setEditedProfile({});
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile(user || {});
  };

  const handleSave = () => {
    updateProfileMutation.mutate(editedProfile);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile({});
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-200 rounded-2xl h-96 animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-500">User not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate mb-4">Your Profile</h1>
        <p className="text-xl text-gray-600">
          Manage your fitness profile and preferences
        </p>
      </div>

      <Card className="overflow-hidden">
        <div className="relative">
          <div 
            className="h-48 bg-gradient-to-r from-primary to-secondary"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute top-4 right-4">
            {isEditing ? (
              <div className="flex space-x-2">
                <Button 
                  onClick={handleSave}
                  disabled={updateProfileMutation.isPending}
                  className="bg-white bg-opacity-90 text-slate hover:bg-opacity-100"
                >
                  Save
                </Button>
                <Button 
                  onClick={handleCancel}
                  variant="outline"
                  className="bg-white bg-opacity-90 hover:bg-opacity-100"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button 
                onClick={handleEdit}
                className="bg-white bg-opacity-90 text-slate hover:bg-opacity-100"
              >
                <Edit className="mr-2" size={16} />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6 mb-8">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                <AvatarImage src={user.profileImage} />
                <AvatarFallback className="text-2xl">{user.name[0]}</AvatarFallback>
              </Avatar>
              {isEditing && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full border-2 border-white flex items-center justify-center cursor-pointer">
                  <Camera className="text-white" size={16} />
                </div>
              )}
            </div>
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={editedProfile.name || ""}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={editedProfile.age || ""}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={editedProfile.bio || ""}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell others about your fitness journey..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={editedProfile.location || ""}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-slate mb-2">{user.name}, {user.age}</h3>
                  <p className="text-gray-600 mb-3">{user.bio}</p>
                  <div className="flex items-center text-gray-500 mb-3">
                    <MapPin className="mr-2" size={16} />
                    {user.location}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {user.workoutTypes?.map((type, index) => (
                      <Badge key={index} className="bg-primary bg-opacity-20 text-primary">
                        {type}
                      </Badge>
                    ))}
                    <Badge className="bg-secondary bg-opacity-20 text-secondary">
                      {user.experienceLevel}
                    </Badge>
                    <Badge className="bg-accent bg-opacity-20 text-accent">
                      {user.preferredTime}
                    </Badge>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Fitness Goals */}
            <div>
              <h4 className="text-xl font-semibold text-slate mb-4 flex items-center">
                <Target className="mr-2 text-primary" />
                Fitness Goals
              </h4>
              {isEditing ? (
                <div className="space-y-2">
                  <Label>Select your fitness goals</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {["Build muscle mass", "Lose weight", "Improve endurance", "Increase flexibility", "General fitness"].map((goal) => (
                      <label key={goal} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={editedProfile.fitnessGoals?.includes(goal) || false}
                          onChange={(e) => {
                            const goals = editedProfile.fitnessGoals || [];
                            if (e.target.checked) {
                              setEditedProfile(prev => ({ 
                                ...prev, 
                                fitnessGoals: [...goals, goal] 
                              }));
                            } else {
                              setEditedProfile(prev => ({ 
                                ...prev, 
                                fitnessGoals: goals.filter(g => g !== goal) 
                              }));
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{goal}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {user.fitnessGoals?.map((goal, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Dumbbell className="text-primary" size={16} />
                      <span className="text-gray-700">{goal}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Workout Preferences */}
            <div>
              <h4 className="text-xl font-semibold text-slate mb-4 flex items-center">
                <Activity className="mr-2 text-secondary" />
                Workout Preferences
              </h4>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label>Experience Level</Label>
                    <Select 
                      value={editedProfile.experienceLevel || ""}
                      onValueChange={(value) => setEditedProfile(prev => ({ ...prev, experienceLevel: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Preferred Time</Label>
                    <Select 
                      value={editedProfile.preferredTime || ""}
                      onValueChange={(value) => setEditedProfile(prev => ({ ...prev, preferredTime: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select preferred time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Morning">Morning</SelectItem>
                        <SelectItem value="Afternoon">Afternoon</SelectItem>
                        <SelectItem value="Evening">Evening</SelectItem>
                        <SelectItem value="Night">Night</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Workout Duration</Label>
                    <Select 
                      value={editedProfile.workoutDuration || ""}
                      onValueChange={(value) => setEditedProfile(prev => ({ ...prev, workoutDuration: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30-45 minutes">30-45 minutes</SelectItem>
                        <SelectItem value="45-60 minutes">45-60 minutes</SelectItem>
                        <SelectItem value="60-90 minutes">60-90 minutes</SelectItem>
                        <SelectItem value="90+ minutes">90+ minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Experience Level</span>
                    <span className="text-primary font-medium">{user.experienceLevel}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Preferred Time</span>
                    <span className="text-primary font-medium">{user.preferredTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Workout Duration</span>
                    <span className="text-primary font-medium">{user.workoutDuration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Workout Frequency</span>
                    <span className="text-primary font-medium">{user.workoutFrequency}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">{matches.length}</div>
                <div className="text-sm text-gray-600">Connections</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-secondary mb-1">156</div>
                <div className="text-sm text-gray-600">Workouts</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-accent mb-1">8</div>
                <div className="text-sm text-gray-600">Active Partners</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-warning mb-1">92%</div>
                <div className="text-sm text-gray-600">Match Rate</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
