import { Link, useLocation } from "wouter";
import { Search, Heart, MessageCircle, User } from "lucide-react";

export default function MobileNav() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Discover", icon: Search },
    { href: "/matches", label: "Matches", icon: Heart },
    { href: "/messages", label: "Messages", icon: MessageCircle },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="grid grid-cols-4 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link key={item.href} href={item.href}>
              <button className="p-4 text-center hover:bg-gray-50 transition-colors">
                <Icon className={`mx-auto mb-1 ${isActive ? "text-primary" : "text-gray-600"}`} size={20} />
                <div className={`text-xs ${isActive ? "text-primary" : "text-gray-600"}`}>
                  {item.label}
                </div>
              </button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
