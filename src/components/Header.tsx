
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { User, Menu, X } from 'lucide-react';
import LoginModal from './LoginModal';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);

  const handleLogin = (userData: { name?: string; email: string }) => {
    setUser(userData);
    setIsLoggedIn(true);
    setIsLoginOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <>
      <header className="brand-green text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 brand-gold rounded-full flex items-center justify-center">
                <span className="text-brand-green font-bold text-lg">I</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">ประกันภัยออนไลน์</h1>
                <p className="text-xs opacity-90">Insurance Calculator</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#calculator" className="hover:text-brand-gold transition-colors">
                คำนวณเบี้ยประกัน
              </a>
              <a href="#packages" className="hover:text-brand-gold transition-colors">
                แผนประกัน
              </a>
              <a href="#about" className="hover:text-brand-gold transition-colors">
                เกี่ยวกับเรา
              </a>
              
              {isLoggedIn ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span className="text-sm">{user?.name || user?.email}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleLogout}
                    className="border-white text-white hover:bg-white hover:text-brand-green"
                  >
                    ออกจากระบบ
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={() => setIsLoginOpen(true)}
                  className="brand-gold text-brand-green hover:bg-opacity-90"
                >
                  เข้าสู่ระบบ
                </Button>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t border-white/20">
              <div className="flex flex-col space-y-3 pt-4">
                <a href="#calculator" className="hover:text-brand-gold transition-colors">
                  คำนวณเบี้ยประกัน
                </a>
                <a href="#packages" className="hover:text-brand-gold transition-colors">
                  แผนประกัน
                </a>
                <a href="#about" className="hover:text-brand-gold transition-colors">
                  เกี่ยวกับเรา
                </a>
                
                {isLoggedIn ? (
                  <div className="flex flex-col space-y-2 pt-2 border-t border-white/20">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span className="text-sm">{user?.name || user?.email}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleLogout}
                      className="border-white text-white hover:bg-white hover:text-brand-green w-fit"
                    >
                      ออกจากระบบ
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={() => setIsLoginOpen(true)}
                    className="brand-gold text-brand-green hover:bg-opacity-90 w-fit"
                  >
                    เข้าสู่ระบบ
                  </Button>
                )}
              </div>
            </nav>
          )}
        </div>
      </header>

      <LoginModal 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleLogin}
      />
    </>
  );
};

export default Header;
