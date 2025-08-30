import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title?: string;
}

export const Header = ({ title }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogoClick = () => {
    navigate("/");
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white border-b relative">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <button onClick={handleLogoClick} className="cursor-pointer">
              <img 
                src="https://tikiti.co.ke/tikiti.yellow.logo.png" 
                alt="TIKITI" 
                className="h-6 sm:h-8 md:h-10"
              />
            </button>
          </div>
          
          {/* Desktop Contact Info */}
          <div className="hidden sm:flex items-center gap-1 sm:gap-2">
            <div className="border border-gray-300 px-2 sm:px-3 py-1 rounded text-xs">
              +254720870700
            </div>
            <div className="border border-gray-300 px-2 sm:px-3 py-1 rounded text-xs">
              info@tikiti.co.ke
            </div>
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="sm:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 border border-gray-300 rounded"
              aria-label="Menu"
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b shadow-lg z-50 sm:hidden">
            <div className="container mx-auto px-4 py-3 space-y-2">
              <div className="border border-gray-300 px-3 py-2 rounded text-sm text-center">
                +254720870700
              </div>
              <div className="border border-gray-300 px-3 py-2 rounded text-sm text-center">
                info@tikiti.co.ke
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};