
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

const HeroSection = () => {
  const scrollToCalculator = () => {
    const calculatorElement = document.getElementById('calculator');
    if (calculatorElement) {
      calculatorElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-white via-gray-50 to-brand-gold/10 py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 brand-green rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 brand-gold rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 brand-green rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-brand-green mb-6 leading-tight tracking-wide">
            เครื่องคำนวณ
            <br />
            <span className="text-brand-gold">เบี้ยประกันภัย</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            คำนวณเบี้ยประกันที่เหมาะสมกับคุณ
          </p>

          {/* Feature Highlights */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="bg-white px-6 py-3 rounded-full shadow-md border border-brand-green/10">
              <span className="text-brand-green font-medium">✓ คำนวณฟรี</span>
            </div>
            <div className="bg-white px-6 py-3 rounded-full shadow-md border border-brand-green/10">
              <span className="text-brand-green font-medium">✓ ใบเสนอราคา PDF</span>
            </div>
            <div className="bg-white px-6 py-3 rounded-full shadow-md border border-brand-green/10">
              <span className="text-brand-green font-medium">✓ ไม่ต้องล็อกอิน</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              onClick={scrollToCalculator}
              size="lg"
              className="brand-green text-white hover:opacity-90 px-8 py-4 text-lg font-semibold shadow-lg"
            >
              เริ่มคำนวณเลย
              <ArrowDown className="ml-2 w-5 h-5" />
            </Button>
            
            <Button 
              variant="outline"
              size="lg" 
              className="border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white px-8 py-4 text-lg font-semibold"
            >
              ดูแผนประกัน
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg viewBox="0 0 1200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L50 110C100 100 200 80 300 70C400 60 500 60 600 65C700 70 800 80 900 85C1000 90 1100 90 1150 90L1200 90V120H1150C1100 120 1000 120 900 120C800 120 700 120 600 120C500 120 400 120 300 120C200 120 100 120 50 120H0Z" fill="#496650" fillOpacity="0.1"/>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
