import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "@/components/dashboard/Sidebar";
import { Bell, Download, Upload, Moon, Sun, ChevronDown } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useAuthStore } from "@/store";

export function Layout() {
  const { user, logout } = useAuthStore();
  const [isDark, setIsDark] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isDashboardRoute = ["/dashboard", "/transactions", "/categories"].some(
    (path) => location.pathname.startsWith(path)
  );

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  const handleLogout = () => {
    logout(); // logout from store
    navigate("/login"); // redirect to login
  };

  return (
    <div className="flex min-h-screen h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Sidebar */}
      {isDashboardRoute && <Sidebar />}

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Navbar */}
        {isDashboardRoute && (
          <nav className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between h-15 px-6">
              {/* 🔍 Search Bar */}
              <div className="flex items-center w-80 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 rounded-lg px-3 py-2 shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500 dark:text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent w-full text-sm text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 outline-none ml-2"
                />
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-6">
                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    className="p-2.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 transition-all shadow-sm hover:shadow-md"
                    title="Notifications"
                  >
                    <Bell className="h-5 w-5" />
                  </button>

                  <button
                    className="p-2.5 bg-green-50 text-green-600 rounded-md hover:bg-green-100 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800 transition-all shadow-sm hover:shadow-md"
                    title="Download"
                  >
                    <Download className="h-5 w-5" />
                  </button>

                  <button
                    className="p-2.5 bg-purple-50 text-purple-600 rounded-md hover:bg-purple-100 dark:bg-purple-900 dark:text-purple-300 dark:hover:bg-purple-800 transition-all shadow-sm hover:shadow-md"
                    title="Upload"
                  >
                    <Upload className="h-5 w-5" />
                  </button>
                </div>

                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="ml-2 p-2.5 bg-yellow-50 text-yellow-600 rounded-md hover:bg-yellow-100 dark:bg-gray-700 dark:text-yellow-400 dark:hover:bg-gray-600 transition-all shadow-sm hover:shadow-md"
                  title="Toggle Theme"
                >
                  {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>

                {/* User Info Dropdown */}
                <div
                  className="relative flex items-center gap-2 border-l pl-4 border-gray-200 dark:border-gray-700 cursor-pointer select-none"
                  ref={dropdownRef}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user?.name || "User"
                    )}&background=random`}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full border"
                  />
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {user?.name || "Guest User"}
                    </p>
                    <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </div>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg py-2 z-50">
                      <p className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 border-b dark:border-gray-700">
                        👋 Hi, <span className="font-medium">{user?.name || "User"}</span>
                      </p>
                      <button
                        onClick={() => navigate("/profile")}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        My Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-800"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </nav>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto text-gray-900 dark:text-gray-100 transition-colors duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
