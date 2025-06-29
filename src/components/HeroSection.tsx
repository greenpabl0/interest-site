import React from 'react';
import { Button } from '@/components/ui/button';
import { Calculator } from 'lucide-react';

const HeroSection = () => {
  const scrollToCalculator = () => {
    const calculatorSection = document.getElementById('calculator');
    if (calculatorSection) {
      calculatorSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-br from-brand-green to-brand-green/80 text-white overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20">
        <div className="absolute top-0 left-0 w-1/2 h-full bg-brand-gold mix-blend-multiply"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-gold mix-blend-multiply"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-brand-gold mix-blend-multiply"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            คำนวณเบี้ยประกันภัย
            <span className="block text-brand-gold mt-2">ง่าย รวดเร็ว แม่นยำ</span>
          </h1>
          
          <p className="text-lg md:text-xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
            เครื่องมือคำนวณเบี้ยประกันภัยที่ช่วยให้คุณวางแผนการเงินได้อย่างมั่นใจ พร้อมแผนประกันที่หลากหลาย
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              onClick={scrollToCalculator}
              size="lg" 
              className="bg-brand-gold hover:bg-brand-gold/90 text-brand-green font-semibold px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Calculator className="mr-2 h-5 w-5" />
              เริ่มคำนวณเลย
            </Button>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-black/20 rounded-lg shadow-md backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-2">ความคุ้มครองที่หลากหลาย</h3>
              <p className="text-white/80 text-sm">เลือกแผนประกันที่ตรงกับความต้องการของคุณ</p>
            </div>
            <div className="p-4 bg-black/20 rounded-lg shadow-md backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-2">เปรียบเทียบง่าย</h3>
              <p className="text-white/80 text-sm">เปรียบเทียบเบี้ยประกันและผลประโยชน์ได้อย่างรวดเร็ว</p>
            </div>
            <div className="p-4 bg-black/20 rounded-lg shadow-md backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-2">คำนวณได้ทุกที่</h3>
              <p className="text-white/80 text-sm">ใช้งานได้บนทุกอุปกรณ์ ไม่ว่าจะอยู่ที่ไหน</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
