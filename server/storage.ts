import { users, matches, messages, type User, type InsertUser, type Match, type InsertMatch, type Message, type InsertMessage } from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByName(name: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  getUsersNearby(userId: number, excludeIds?: number[]): Promise<User[]>;
  
  // Match operations
  createMatch(match: InsertMatch): Promise<Match>;
  getMatchesByUser(userId: number): Promise<Match[]>;
  getMatch(userId: number, matchedUserId: number): Promise<Match | undefined>;
  updateMatch(id: number, status: string): Promise<Match | undefined>;
  getMutualMatches(userId: number): Promise<Match[]>;
  
  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesBetweenUsers(userId1: number, userId2: number): Promise<Message[]>;
  getConversations(userId: number): Promise<any[]>;
  markMessagesAsRead(userId: number, senderId: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private matches: Map<number, Match>;
  private messages: Map<number, Message>;
  private currentUserId: number;
  private currentMatchId: number;
  private currentMessageId: number;

  constructor() {
    this.users = new Map();
    this.matches = new Map();
    this.messages = new Map();
    this.currentUserId = 1;
    this.currentMatchId = 1;
    this.currentMessageId = 1;
    this.seedData();
  }

  private seedData() {
    // Create sample users
    const sampleUsers = [
      {
        name: "Jordan Smith",
        age: 26,
        bio: "Fitness enthusiast passionate about strength training and helping others reach their goals.",
        profileImage: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        location: "New York, NY",
        latitude: "40.7128",
        longitude: "-74.0060",
        fitnessGoals: ["Build muscle mass", "Improve cardiovascular health", "Find accountability partner"],
        workoutTypes: ["Strength Training", "Cardio"],
        experienceLevel: "Intermediate",
        preferredTime: "Evening (6-8 PM)",
        workoutDuration: "60-90 minutes",
        workoutFrequency: "4-5 times/week",
        isActive: true,
      },
      {
        name: "Sarah",
        age: 28,
        bio: "Strength training enthusiast looking for a gym buddy to push each other to new limits!",
        profileImage: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        location: "New York, NY",
        latitude: "40.7589",
        longitude: "-73.9851",
        fitnessGoals: ["Build strength", "Muscle gain"],
        workoutTypes: ["Strength"],
        experienceLevel: "Beginner",
        preferredTime: "Evening",
        workoutDuration: "45-60 minutes",
        workoutFrequency: "3-4 times/week",
        isActive: true,
      },
      {
        name: "Mike",
        age: 32,
        bio: "Marathon runner seeking running partner for early morning sessions and race training.",
        profileImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        location: "New York, NY",
        latitude: "40.7505",
        longitude: "-73.9934",
        fitnessGoals: ["Marathon training", "Endurance"],
        workoutTypes: ["Cardio"],
        experienceLevel: "Advanced",
        preferredTime: "Morning",
        workoutDuration: "60-90 minutes",
        workoutFrequency: "5-6 times/week",
        isActive: true,
      },
      {
        name: "Emma",
        age: 25,
        bio: "Yoga instructor looking for workout variety - interested in trying CrossFit with a supportive partner.",
        profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        location: "New York, NY",
        latitude: "40.7411",
        longitude: "-73.9897",
        fitnessGoals: ["Flexibility", "Try new workouts"],
        workoutTypes: ["Yoga", "CrossFit"],
        experienceLevel: "Intermediate",
        preferredTime: "Evening",
        workoutDuration: "45-75 minutes",
        workoutFrequency: "4-5 times/week",
        isActive: true,
      },
      {
        name: "Alex",
        age: 29,
        bio: "Personal trainer with 5+ years experience. Looking for someone to train with during off-hours. Let's push each other to be better!",
        profileImage: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
        location: "New York, NY",
        latitude: "40.7282",
        longitude: "-73.9942",
        fitnessGoals: ["Maintain fitness", "Help others"],
        workoutTypes: ["Strength", "Cardio"],
        experienceLevel: "Advanced",
        preferredTime: "Evening",
        workoutDuration: "60-90 minutes",
        workoutFrequency: "5-6 times/week",
        isActive: true,
      },
    ];

    sampleUsers.forEach((userData) => {
      const user: User = {
        id: this.currentUserId++,
        ...userData,
        bio: userData.bio || null,
        profileImage: userData.profileImage || null,
        latitude: userData.latitude || null,
        longitude: userData.longitude || null,
        fitnessGoals: userData.fitnessGoals || null,
        workoutTypes: userData.workoutTypes || null,
        isActive: userData.isActive ?? true,
        createdAt: new Date(),
      };
      this.users.set(user.id, user);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByName(name: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.name === name);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: this.currentUserId++,
      ...insertUser,
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser: User = { 
      ...user, 
      ...updates,
      fitnessGoals: updates.fitnessGoals || user.fitnessGoals,
      workoutTypes: updates.workoutTypes || user.workoutTypes,
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => user.isActive);
  }

  async getUsersNearby(userId: number, excludeIds: number[] = []): Promise<User[]> {
    const currentUser = this.users.get(userId);
    if (!currentUser) return [];
    
    return Array.from(this.users.values()).filter(user => 
      user.id !== userId && 
      user.isActive && 
      !excludeIds.includes(user.id)
    );
  }

  async createMatch(insertMatch: InsertMatch): Promise<Match> {
    const match: Match = {
      id: this.currentMatchId++,
      ...insertMatch,
      createdAt: new Date(),
    };
    this.matches.set(match.id, match);
    return match;
  }

  async getMatchesByUser(userId: number): Promise<Match[]> {
    return Array.from(this.matches.values()).filter(match => 
      match.userId === userId || match.matchedUserId === userId
    );
  }

  async getMatch(userId: number, matchedUserId: number): Promise<Match | undefined> {
    return Array.from(this.matches.values()).find(match => 
      (match.userId === userId && match.matchedUserId === matchedUserId) ||
      (match.userId === matchedUserId && match.matchedUserId === userId)
    );
  }

  async updateMatch(id: number, status: string): Promise<Match | undefined> {
    const match = this.matches.get(id);
    if (!match) return undefined;
    
    const updatedMatch = { ...match, status };
    this.matches.set(id, updatedMatch);
    return updatedMatch;
  }

  async getMutualMatches(userId: number): Promise<Match[]> {
    const userMatches = Array.from(this.matches.values()).filter(match => 
      (match.userId === userId || match.matchedUserId === userId) && 
      match.status === 'matched'
    );
    
    return userMatches;
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const message: Message = {
      id: this.currentMessageId++,
      ...insertMessage,
      isRead: insertMessage.isRead ?? false,
      createdAt: new Date(),
    };
    this.messages.set(message.id, message);
    return message;
  }

  async getMessagesBetweenUsers(userId1: number, userId2: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(message => 
        (message.senderId === userId1 && message.receiverId === userId2) ||
        (message.senderId === userId2 && message.receiverId === userId1)
      )
      .sort((a, b) => a.createdAt!.getTime() - b.createdAt!.getTime());
  }

  async getConversations(userId: number): Promise<any[]> {
    const userMessages = Array.from(this.messages.values())
      .filter(message => message.senderId === userId || message.receiverId === userId);
    
    const conversations = new Map();
    
    for (const message of userMessages) {
      const otherUserId = message.senderId === userId ? message.receiverId : message.senderId;
      const otherUser = this.users.get(otherUserId);
      
      if (otherUser) {
        if (!conversations.has(otherUserId) || 
            message.createdAt! > conversations.get(otherUserId).lastMessage.createdAt!) {
          conversations.set(otherUserId, {
            user: otherUser,
            lastMessage: message,
            unreadCount: 0, // Simple implementation - could be enhanced
          });
        }
      }
    }
    
    return Array.from(conversations.values())
      .sort((a, b) => b.lastMessage.createdAt!.getTime() - a.lastMessage.createdAt!.getTime());
  }

  async markMessagesAsRead(userId: number, senderId: number): Promise<void> {
    Array.from(this.messages.values())
      .filter(message => message.senderId === senderId && message.receiverId === userId)
      .forEach(message => {
        message.isRead = true;
        this.messages.set(message.id, message);
      });
  }
}

export const storage = new MemStorage();
