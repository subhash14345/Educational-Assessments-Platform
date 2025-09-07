import React from 'react';
import { LogOut, User, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Tab {
  key: string;
  label: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: Tab[];
  onUserProfileRightClick?: (e: React.MouseEvent) => void;
  onUserProfileClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, tabs, onUserProfileRightClick, onUserProfileClick }) => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogoClick = () => {
    // Open the website when logo is clicked
    window.open('https://www.indonalandatech.com/', '_blank');
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <div className="flex items-center">
            <div className="relative group">
              <img 
                src="INT-logo.jpeg" 
                alt="INT Logo" 
                width={70}
                className="border-2 border-gray-200 hover:border-b-blue-500 cursor-pointer hover:opacity-100 hover:scale-105 transition-all duration-150 ease-in-out transform hover:shadow-2xl"
                onClick={handleLogoClick}
              />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-black text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                Visit Website
              </div>
            </div>
            <h1 className="pl-2 text-sm sm:text-base lg:text-base w-4 font-bold text-gray-900">
              Assessment Platform
            </h1>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden custom-xl:flex space-x-4 lg:space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-2 py-2 rounded-sm text-sm lg:text-base font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-blue-100 text-blue-800 border-b-4 border-b-green-200' 
                    : 'text-gray-600 hover:text-gray-800 border-b-2 hover:border-b-green-300'
                }`}
              >
                <div className="flex items-center space-x-1 justify-center">
                  {tab.icon && <tab.icon className="h-5 w-5" />}
                  <span>{tab.label}</span>
                </div>
              </button>
            ))}
          </nav>

          {/* Desktop User Info */}
          <div className="md:flex items-center space-x-4">
            <div
              className="flex items-center space-x-2 text-sm lg:text-base cursor-pointer"
              onClick={onUserProfileClick}
              onContextMenu={onUserProfileRightClick}
            >
              <User className="h-5 w-5 text-gray-500" />
              <span className="text-gray-700 truncate max-w-32 lg:max-w-none">
                {user?.name} ({user?.regno})
              </span>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm lg:text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="custom-xl:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="custom-xl:hidden border-t border-gray-200 py-4 mobile-menu-height-adjust">
            <div className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-2 w-full text-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    activeTab === tab.key
                      ? 'bg-blue-200 text-blue-700'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  {tab.icon && <tab.icon className="h-5 w-5" />}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-300">
            <div 
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 cursor-pointer rounded-md transition-colors"
              onClick={onUserProfileClick}
            >
              <User className="h-5 w-5 text-gray-500 " />
              <span className="truncate">
                {user?.name} ({user?.regno})
              </span>
            </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 w-full pr-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-2" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
