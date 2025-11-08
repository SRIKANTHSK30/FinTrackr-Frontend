import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CreditCard,
  Tag,
  Settings,
  Menu,
} from "lucide-react";
import clsx from "clsx";

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Mock user data (replace with actual user fetching logic)
  const user = {
    name: "John Doe",
    avatarUrl: "https://i.pravatar.cc/40",
  };

  useEffect(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    if (saved === "true") setIsCollapsed(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", String(isCollapsed));
  }, [isCollapsed]);

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/atm-cards", label: "Cards", icon: CreditCard },
    { path: "/transactions", label: "Transactions", icon: CreditCard },
    { path: "/categories", label: "Categories", icon: Tag },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside
      className={clsx(
        "flex flex-col h-screen min-h-screen overflow-hidden",
        "backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-r border-gray-200 dark:border-gray-800 transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
              F
            </div>
            <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-200 tracking-wide">
              FinTrackr
            </h1>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                "group flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 relative",
                isActive
                  ? "bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-blue-400 font-semibold"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-800/60"
              )}
              title={isCollapsed ? item.label : ""}
            >
              <Icon
                size={20}
                className={clsx(
                  "transition-transform duration-200 group-hover:scale-110",
                  isActive && "text-blue-600 dark:text-blue-400"
                )}
              />
              {!isCollapsed && <span>{item.label}</span>}
              {isActive && (
                <span className="absolute right-2 w-1.5 h-6 bg-blue-500 rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-gray-800 dark:text-gray-200 font-medium font-semibold">
                {user.name}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 font-semibold">
                View Profile
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
