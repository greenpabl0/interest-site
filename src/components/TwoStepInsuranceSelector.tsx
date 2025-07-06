
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, ShoppingCart } from 'lucide-react';
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
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [selectedPlans, setSelectedPlans] = useState<SelectedPlan[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState('packages');
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
      
      // Remove plans from deselected packages
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
    setActiveTab('cart');
    
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
    
    toast({
      title: "บันทึกใบเสนอราคาสำเร็จ",
      description: `บันทึก ${cartItems.length} รายการเรียบร้อยแล้ว`,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg text-brand-green">
          เลือกแพ็กเกจและแผนประกันภัย
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="packages">1. เลือกแพ็กเกจ</TabsTrigger>
            <TabsTrigger value="plans">2. เลือกแผน</TabsTrigger>
            <TabsTrigger value="cart" className="relative">
              ตะกร้า
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="packages" className="mt-6">
            <PackageSelector
              selectedPackages={selectedPackages}
              onPackageSelect={handlePackageSelect}
              userAge={userAge}
              userGender={userGender}
            />
            {selectedPackages.length > 0 && (
              <div className="mt-6 text-center">
                <Button
                  onClick={() => setActiveTab('plans')}
                  className="bg-brand-green text-white hover:bg-brand-green/90"
                >
                  ไปยังขั้นตอนเลือกแผน
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="plans" className="mt-6">
            <PlanSelector
              selectedPackages={selectedPackages}
              selectedPlans={selectedPlans}
              onPlanSelect={handlePlanSelect}
              userAge={userAge}
              userGender={userGender}
            />
            {selectedPlans.length > 0 && (
              <div className="mt-6 text-center">
                <Button
                  onClick={handleSearch}
                  className="bg-brand-green text-white hover:bg-brand-green/90 h-12 px-8"
                  size="lg"
                >
                  <Search className="w-5 h-5 mr-2" />
                  ค้นหาเบี้ยประกัน
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="cart" className="mt-6">
            <ShoppingCart
              cartItems={cartItems}
              onRemoveItem={handleRemoveCartItem}
              onUpdateUnits={handleUpdateCartUnits}
              onSaveQuote={handleSaveQuote}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TwoStepInsuranceSelector;
