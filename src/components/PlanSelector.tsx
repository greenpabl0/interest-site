
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, Minus, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SubPlan {
  id: string;
  name: string;
  coverage: string;
  monthlyPremium: number;
  annualPremium: number;
}

interface SelectedPlan {
  planId: string;
  planName: string;
  coverage: string;
  units: number;
  monthlyPremium: number;
  annualPremium: number;
}

interface SelectedPackage {
  packageName: string;
  selectedPlans: SelectedPlan[];
}

interface PlanSelectorProps {
  selectedPackages: string[];
  userAge?: number;
  userGender?: string;
  onBack: () => void;
  onPlansSelected?: (packages: SelectedPackage[]) => void;
}

const PlanSelector: React.FC<PlanSelectorProps> = ({ 
  selectedPackages, 
  userAge = 25, 
  userGender = 'male',
  onBack,
  onPlansSelected 
}) => {
  const [packagePlans, setPackagePlans] = useState<Record<string, SelectedPlan[]>>({});
  const { toast } = useToast();

  const getSubPlans = (packageName: string): SubPlan[] => {
    const basePlans = [
      { coverage: '1M', multiplier: 1 },
      { coverage: '5M', multiplier: 5 },
      { coverage: '10M', multiplier: 10 },
      { coverage: '15M', multiplier: 15 }
    ];

    const basePricing = {
      'AIA Health Happy Kids': { monthly: 500, annual: 5500 },
      'AIA H&S (new standard)': { monthly: 800, annual: 9000 },
      'AIA H&S Extra (new standard)': { monthly: 1200, annual: 13500 },
      'AIA Health Saver': { monthly: 600, annual: 6800 },
      'AIA Health Happy': { monthly: 900, annual: 10200 },
      'AIA Infinite Care (new standard)': { monthly: 1500, annual: 17000 },
      'HB': { monthly: 700, annual: 8000 },
      'AIA HB Extra': { monthly: 1000, annual: 11500 },
      'ผลประโยชน์ Day Case ของสัญญาเพิ่มเติม HB และ AIA HB Extra': { monthly: 300, annual: 3500 },
      'AIA Health Cancer': { monthly: 1200, annual: 13800 },
      'AIA Care for Cancer': { monthly: 1000, annual: 11500 },
      'AIA CI Plus': { monthly: 1500, annual: 17500 },
      'AIA CI Top Up': { monthly: 800, annual: 9200 },
      'multi pay-ci plus': { monthly: 2000, annual: 23000 },
      'Lady Care & Lady Care Plus': { monthly: 1100, annual: 12800 },
      'AIA TPD': { monthly: 600, annual: 7000 },
      'AIA Multi-Pay CI': { monthly: 1800, annual: 20500 },
      'AIA Total Care': { monthly: 2200, annual: 25000 },
      'Accident Coverage': { monthly: 400, annual: 4500 }
    };

    const packagePricing = basePricing[packageName] || { monthly: 500, annual: 6000 };

    return basePlans.map(plan => ({
      id: `${packageName}-${plan.coverage}`,
      name: `${plan.coverage} Coverage`,
      coverage: plan.coverage,
      monthlyPremium: Math.round(packagePricing.monthly * plan.multiplier * (userAge > 40 ? 1.3 : 1.1) * (userGender === 'male' ? 1.1 : 1.0)),
      annualPremium: Math.round(packagePricing.annual * plan.multiplier * (userAge > 40 ? 1.3 : 1.1) * (userGender === 'male' ? 1.1 : 1.0))
    }));
  };

  const togglePlan = (packageName: string, plan: SubPlan) => {
    const currentPlans = packagePlans[packageName] || [];
    const existingPlanIndex = currentPlans.findIndex(p => p.planId === plan.id);
    
    if (existingPlanIndex > -1) {
      // Remove plan
      const newPlans = currentPlans.filter(p => p.planId !== plan.id);
      setPackagePlans({
        ...packagePlans,
        [packageName]: newPlans
      });
    } else {
      // Add plan
      const newPlan: SelectedPlan = {
        planId: plan.id,
        planName: plan.name,
        coverage: plan.coverage,
        units: 1,
        monthlyPremium: plan.monthlyPremium,
        annualPremium: plan.annualPremium
      };
      setPackagePlans({
        ...packagePlans,
        [packageName]: [...currentPlans, newPlan]
      });
    }
  };

  const updatePlanUnits = (packageName: string, planId: string, newUnits: number) => {
    if (newUnits < 1) return;
    
    const currentPlans = packagePlans[packageName] || [];
    const updatedPlans = currentPlans.map(plan => 
      plan.planId === planId ? { ...plan, units: newUnits } : plan
    );
    
    setPackagePlans({
      ...packagePlans,
      [packageName]: updatedPlans
    });
  };

  const handleSave = () => {
    const packagesWithPlans: SelectedPackage[] = [];
    
    Object.entries(packagePlans).forEach(([packageName, plans]) => {
      if (plans.length > 0) {
        packagesWithPlans.push({
          packageName,
          selectedPlans: plans
        });
      }
    });
    
    if (packagesWithPlans.length === 0) {
      toast({
        title: "ไม่พบข้อมูล",
        description: "กรุณาเลือกแผนอย่างน้อย 1 รายการ",
        variant: "destructive",
      });
      return;
    }

    console.log('Selected Plans:', packagesWithPlans);
    
    if (onPlansSelected) {
      onPlansSelected(packagesWithPlans);
    }
    
    toast({
      title: "บันทึกสำเร็จ",
      description: `บันทึกแผนประกันแล้ว ${packagesWithPlans.length} แพ็กเกจ`,
    });
  };

  const getTotalMonthly = () => {
    return Object.values(packagePlans).reduce((total, plans) => {
      return total + plans.reduce((planTotal, plan) => {
        return planTotal + (plan.monthlyPremium * plan.units);
      }, 0);
    }, 0);
  };

  const getTotalAnnual = () => {
    return Object.values(packagePlans).reduce((total, plans) => {
      return total + plans.reduce((planTotal, plan) => {
        return planTotal + (plan.annualPremium * plan.units);
      }, 0);
    }, 0);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6 bg-gradient-to-r from-brand-green/5 to-brand-gold/5 p-6 rounded-lg">
        <h3 className="text-2xl font-bold text-brand-green mb-3">
          เลือกแผนความคุ้มครอง
        </h3>
        <p className="text-brand-gold font-medium">
          ขั้นตอนที่ 2: เลือกแผนสำหรับแต่ละแพ็กเกจ ({selectedPackages.length} แพ็กเกจ)
        </p>
      </div>

      <Card className="shadow-lg border border-brand-green/20">
        <CardHeader className="bg-gradient-to-r from-brand-green to-brand-green/80 text-white py-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            เลือกแผนความคุ้มครอง
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          
          {selectedPackages.map((packageName) => (
            <div key={packageName} className="bg-white p-4 rounded-lg border shadow-sm">
              <h4 className="font-bold text-brand-green mb-4">{packageName}</h4>
              
              <div className="space-y-3">
                {getSubPlans(packageName).map((plan) => {
                  const currentPlans = packagePlans[packageName] || [];
                  const selectedPlan = currentPlans.find(p => p.planId === plan.id);
                  const isPlanSelected = !!selectedPlan;
                  
                  return (
                    <div key={plan.id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={isPlanSelected}
                            onCheckedChange={() => togglePlan(packageName, plan)}
                          />
                          <div>
                            <Label className="font-medium text-gray-800">
                              {plan.name} ({plan.coverage})
                            </Label>
                            <div className="text-xs text-gray-600">
                              ปีละ ฿{plan.annualPremium.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {isPlanSelected && selectedPlan && (
                        <div className="flex items-center gap-3 mt-3">
                          <Label className="text-sm text-gray-600">จำนวนหน่วย:</Label>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-8 h-8 p-0"
                              onClick={() => updatePlanUnits(packageName, plan.id, selectedPlan.units - 1)}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-12 text-center font-medium bg-white px-2 py-1 rounded border">
                              {selectedPlan.units}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-8 h-8 p-0"
                              onClick={() => updatePlanUnits(packageName, plan.id, selectedPlan.units + 1)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="text-sm text-brand-gold ml-4">
                            รวม: ฿{(selectedPlan.annualPremium * selectedPlan.units).toLocaleString()}/ปี
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Summary */}
          {Object.keys(packagePlans).some(pkg => packagePlans[pkg].length > 0) && (
            <div className="mt-6 p-6 bg-gradient-to-r from-brand-green/10 to-brand-gold/10 rounded-lg border border-brand-green/20">
              <h4 className="font-bold text-brand-green mb-4 text-lg">สรุปแผนที่เลือก:</h4>
              <div className="space-y-3">
                {Object.entries(packagePlans).filter(([, plans]) => plans.length > 0).map(([packageName, plans]) => (
                  <div key={packageName} className="space-y-2 bg-white p-4 rounded-lg shadow-sm">
                    <div className="font-bold text-brand-green">{packageName}</div>
                    {plans.map((plan) => (
                      <div key={plan.planId} className="flex justify-between items-center text-sm pl-4 py-2 bg-brand-green/5 rounded">
                        <span className="text-brand-green">{plan.planName} ({plan.coverage})</span>
                        <span className="text-brand-gold font-bold">
                          {plan.units} หน่วย - ฿{(plan.annualPremium * plan.units).toLocaleString()}/ปี
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-brand-green/20">
                <div className="flex justify-between items-center font-bold text-lg">
                  <span className="text-brand-green">รวมทั้งหมด:</span>
                  <div className="text-right">
                    <div className="text-brand-gold text-lg">฿{getTotalAnnual().toLocaleString()}/ปี</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-6 border-t border-brand-green/20 space-y-3">
            <Button 
              onClick={handleSave}
              className="brand-green text-white hover:opacity-90 w-full h-12 text-lg font-medium shadow-lg"
            >
              <Save className="w-5 h-5 mr-2" />
              บันทึกการเลือก
            </Button>
            
            <Button 
              onClick={onBack}
              variant="outline"
              className="border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white w-full h-12 text-lg font-medium shadow-lg"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              กลับไปเลือกแพ็กเกจ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlanSelector;
