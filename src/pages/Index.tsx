
import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import InsuranceCalculator from '@/components/InsuranceCalculator';
import SelectiveForm from '@/components/SelectiveForm';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <SelectiveForm />
        <InsuranceCalculator />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
