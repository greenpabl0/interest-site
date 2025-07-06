
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Save, ChevronRight, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PackageSelector from './PackageSelector';
import PlanSelector from './PlanSelector';
import ShoppingCart from './ShoppingCart';
import { insurancePackages } from '@/data/insurancePackages';

interface SelectedPlan {
  packageId: string;
  planId: string;
  units: number;
  monthlyPremium: number;
}

interface CartItem {
  packageId: string;
  packageName: string;
  planId: string;
  planName: string;
  coverage: string;
  units: number;
  monthlyPremium: number;
  totalMonthly: number;
}

interface TwoStepInsuranceSelectorProps {
  userAge: number;
  userGender: 'male' | 'female';
  onQuoteSaved: (cartItems: CartItem[]) => void;
}

const TwoStepInsuranceSelector: React.FC<TwoStepInsuranceSelectorProps> = ({
  userAge,
  userGender,
  onQuoteSaved
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [selectedPlans, setSelectedPlans] = useState<SelectedPlan[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const getAgeRange = (age: number): string => {
    if (age <= 10) return '0-10';
    if (age <= 17) return '11-17';
    if (age <= 30) return '18-30';
    if (age <= 50) return '31-50';
    if (age <= 60) return '51-60';
    if (age <= 65) return '51-65';
    if (age <= 70) return '51-70';
    return '61-75';
  };

  const getPlanPremium = (packageId: string, planId: string): number => {
    const pkg = insurancePackages.find(p => p.id === packageId);
    const plan = pkg?.plans.find(p => p.id === planId);
    if (!plan) return 0;

    const ageRange = getAgeRange(userAge);
    const premiumData = plan.monthlyPremium[userGender];
    
    for (const [range, premium] of Object.entries(premiumData)) {
      const [minAge, maxAge] = range.split('-').map(Number);
      if (userAge >= minAge && userAge <= maxAge) {
        return premium;
      }
    }
    
    return 0;
  };

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackages(prev => {
      const newSelection = prev.includes(packageId)
        ? prev.filter(id => id !== packageId)
        : [...prev, packageId];
      
      if (!newSelection.includes(packageId)) {
        setSelectedPlans(current => 
          current.filter(sp => sp.packageId !== packageId)
        );
      }
      
      return newSelection;
    });
  };

  const handlePlanSelect = (packageId: string, planId: string, units: number) => {
    const monthlyPremium = getPlanPremium(packageId, planId);
    
    setSelectedPlans(prev => {
      const filtered = prev.filter(sp => !(sp.packageId === packageId && sp.planId === planId));
      
      if (units > 0) {
        return [...filtered, { packageId, planId, units, monthlyPremium }];
      }
      
      return filtered;
    });
  };

  const handleNextToPlans = () => {
    if (selectedPackages.length === 0) {
      toast({
        title: "กรุณาเลือกแพ็กเกจ",
        description: "เลือกอย่างน้อย 1 แพ็กเกจเพื่อดำเนินการต่อ",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep(2);
  };

  const handleSearch = () => {
    if (selectedPlans.length === 0) {
      toast({
        title: "กรุณาเลือกแผนความคุ้มครอง",
        description: "เลือกอย่างน้อย 1 แผนเพื่อค้นหาเบี้ยประกัน",
        variant: "destructive",
      });
      return;
    }

    const newCartItems: CartItem[] = selectedPlans.map(sp => {
      const pkg = insurancePackages.find(p => p.id === sp.packageId)!;
      const plan = pkg.plans.find(p => p.id === sp.planId)!;
      
      return {
        packageId: sp.packageId,
        packageName: pkg.name,
        planId: sp.planId,
        planName: plan.name,
        coverage: plan.coverage,
        units: sp.units,
        monthlyPremium: sp.monthlyPremium,
        totalMonthly: sp.monthlyPremium * sp.units
      };
    });

    setCartItems(newCartItems);
    setCurrentStep(3);
    
    toast({
      title: "ค้นหาเบี้ยประกันสำเร็จ",
      description: `พบ ${newCartItems.length} รายการในตะกร้า`,
    });
  };

  const handleRemoveCartItem = (packageId: string, planId: string) => {
    setCartItems(prev => prev.filter(item => 
      !(item.packageId === packageId && item.planId === planId)
    ));
    
    setSelectedPlans(prev => prev.filter(sp => 
      !(sp.packageId === packageId && sp.planId === planId)
    ));
  };

  const handleUpdateCartUnits = (packageId: string, planId: string, units: number) => {
    const monthlyPremium = getPlanPremium(packageId, planId);
    
    setCartItems(prev => prev.map(item => 
      item.packageId === packageId && item.planId === planId
        ? { ...item, units, totalMonthly: monthlyPremium * units }
        : item
    ));
    
    setSelectedPlans(prev => prev.map(sp => 
      sp.packageId === packageId && sp.planId === planId
        ? { ...sp, units }
        : sp
    ));
  };

  const handleSaveQuote = () => {
    if (cartItems.length === 0) {
      toast({
        title: "ตะกร้าว่างเปล่า",
        description: "ไม่มีรายการในตะกร้าให้บันทึก",
        variant: "destructive",
      });
      return;
    }

    onQuoteSaved(cartItems);
    setCurrentStep(4);
    
    toast({
      title: "บันทึกใบเสนอราคาสำเร็จ",
      description: `บันทึก ${cartItems.length} รายการเรียบร้อยแล้ว`,
    });
  };

  const steps = [
    { number: 1, title: "เลือกแพ็กเกจ", completed: currentStep > 1 },
    { number: 2, title: "เลือกแผนความคุ้มครอง", completed: currentStep > 2 },
    { number: 3, title: "ค้นหาเบี้ยประกัน", completed: currentStep > 3 },
    { number: 4, title: "บันทึกใบเสนอราคา", completed: currentStep > 4 }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg text-brand-green">
          เลือกแพ็กเกจและแผนประกันภัย
        </CardTitle>
        
        {/* Step indicator */}
        <div className="flex items-center justify-between mt-4">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-bold ${
                step.completed 
                  ? 'bg-green-500 border-green-500 text-white' 
                  : currentStep === step.number
                    ? 'bg-brand-green border-brand-green text-white'
                    : 'bg-gray-100 border-gray-300 text-gray-500'
              }`}>
                {step.completed ? <Check className="w-4 h-4" /> : step.number}
              </div>
              <span className={`ml-2 text-xs font-medium ${
                currentStep >= step.number ? 'text-brand-green' : 'text-gray-500'
              }`}>
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
              )}
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        {currentStep === 1 && (
          <div className="space-y-6">
            <PackageSelector
              selectedPackages={selectedPackages}
              onPackageSelect={handlePackageSelect}
              userAge={userAge}
              userGender={userGender}
            />
            <div className="text-center">
              <Button
                onClick={handleNextToPlans}
                className="bg-brand-green text-white hover:bg-brand-green/90 h-12 px-8"
                size="lg"
              >
                เลือกแผนความคุ้มครอง
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <PlanSelector
              selectedPackages={selectedPackages}
              selectedPlans={selectedPlans}
              onPlanSelect={handlePlanSelect}
              userAge={userAge}
              userGender={userGender}
            />
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => setCurrentStep(1)}
                variant="outline"
                className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white h-12 px-6"
              >
                ย้อนกลับ
              </Button>
              <Button
                onClick={handleSearch}
                className="bg-brand-green text-white hover:bg-brand-green/90 h-12 px-8"
                size="lg"
              >
                <Search className="w-5 h-5 mr-2" />
                ค้นหาเบี้ยประกัน
              </Button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <ShoppingCart
              cartItems={cartItems}
              onRemoveItem={handleRemoveCartItem}
              onUpdateUnits={handleUpdateCartUnits}
              onSaveQuote={handleSaveQuote}
            />
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => setCurrentStep(2)}
                variant="outline"
                className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white h-12 px-6"
              >
                ย้อนกลับ
              </Button>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-brand-green">
              บันทึกใบเสนอราคาสำเร็จ!
            </h3>
            <p className="text-gray-600">
              ข้อมูลของคุณได้รับการบันทึกเรียบร้อยแล้ว
            </p>
            <div className="space-y-2">
              <Button
                onClick={() => {
                  setCurrentStep(1);
                  setSelectedPackages([]);
                  setSelectedPlans([]);
                  setCartItems([]);
                }}
                variant="outline"
                className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white"
              >
                เริ่มต้นใหม่
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TwoStepInsuranceSelector;
