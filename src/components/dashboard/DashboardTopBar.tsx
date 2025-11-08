import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, RefreshCw, Download, Upload, Settings, ChevronDown, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store';
import { api } from '@/lib/api';

export function DashboardTopBar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };

    if (showProfileDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown]);

  const handleLogout = async () => {
    try {
      await api.auth.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      logout();
      navigate('/login');
      setShowProfileDropdown(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-6 bg-[#1a1a1a] border-b border-gray-800">
      {/* Left: Search Bar */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search here..."
            className="pl-10 w-64 bg-[#252525] border-gray-700 text-white placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* Right: Icons and User Profile */}
      <div className="flex items-center gap-4">
        {/* Icons */}
        <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
          <RefreshCw className="h-5 w-5 text-gray-400" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
          <Download className="h-5 w-5 text-gray-400" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
          <Upload className="h-5 w-5 text-gray-400" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
          <Settings className="h-5 w-5 text-gray-400" />
        </button>

        {/* User Profile */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-white">{user?.name || 'John Wick'}</p>
              <p className="text-xs text-gray-400">Free plan</p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>

          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-[#252525] rounded-lg shadow-lg border border-gray-700 py-1 z-50">
              <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800">
                Profile
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800">
                Settings
              </button>
              <div className="border-t border-gray-700 my-1" />
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

