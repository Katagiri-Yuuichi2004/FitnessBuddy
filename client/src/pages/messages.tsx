import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import ChatInterface from "@/components/chat-interface";
import { MessageCircle, Users } from "lucide-react";

const CURRENT_USER_ID = 1;

export default function Messages() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ["/api/conversations", CURRENT_USER_ID],
  });

  const { data: mutualMatches = [] } = useQuery({
    queryKey: ["/api/matches/mutual", CURRENT_USER_ID],
  });

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-gray-200 rounded-2xl h-96 animate-pulse" />
          <div className="lg:col-span-2 bg-gray-200 rounded-2xl h-96 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate mb-4">Messages</h1>
        <p className="text-xl text-gray-600">
          Connect with your workout partners
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="mr-2" size={20} />
                Recent Conversations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {conversations.length > 0 ? (
                  conversations.map((conversation: any) => (
                    <div
                      key={conversation.user.id}
                      onClick={() => setSelectedUser(conversation.user)}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedUser?.id === conversation.user.id ? "bg-primary bg-opacity-5" : ""
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={conversation.user.profileImage} />
                          <AvatarFallback>{conversation.user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-slate">{conversation.user.name}</h4>
                            <span className="text-xs text-gray-500">
                              {new Date(conversation.lastMessage.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            {conversation.lastMessage.content}
                          </p>
                        </div>
                        {conversation.unreadCount > 0 && (
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4">
                    <p className="text-gray-500 text-center">No conversations yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Mutual Matches */}
          {mutualMatches.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2" size={20} />
                  Your Matches
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {mutualMatches.slice(0, 5).map((match: any) => (
                    <div
                      key={match.id}
                      onClick={() => setSelectedUser(match.user)}
                      className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={match.user?.profileImage} />
                          <AvatarFallback>{match.user?.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate text-sm">{match.user?.name}</h4>
                          <div className="flex space-x-1 mt-1">
                            {match.user?.workoutTypes?.slice(0, 2).map((type: string, index: number) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {type}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <ChatInterface currentUserId={CURRENT_USER_ID} selectedUser={selectedUser} />
        </div>
      </div>
    </div>
  );
}
