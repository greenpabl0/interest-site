
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calculator, Settings, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import LoginModal from './LoginModal';

const Header = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-green rounded-lg flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-brand-green">
                  Premium Quote Builder
                </h1>
                <p className="text-xs text-gray-600">
                  คำนวณเบี้ยประกันภัย
                </p>
              </div>
            </Link>
            
            <nav className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white"
                onClick={() => setShowLoginModal(true)}
              >
                <LogIn className="w-4 h-4 mr-2" />
                เข้าสู่ระบบ
              </Button>
              
              <Link to="/admin">
                <Button variant="outline" size="sm" className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white">
                  <Settings className="w-4 h-4 mr-2" />
                  Admin
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </>
  );
};

export default Header;
