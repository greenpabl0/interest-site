
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { insurancePackages, InsurancePlan } from '@/data/insurancePackages';

interface SelectedPlan {
  packageId: string;
  planId: string;
  units: number;
  monthlyPremium: number;
}

interface PlanSelectorProps {
  selectedPackages: string[];
  selectedPlans: SelectedPlan[];
  onPlanSelect: (packageId: string, planId: string, units: number) => void;
  userAge: number;
  userGender: 'male' | 'female';
}

const PlanSelector: React.FC<PlanSelectorProps> = ({
  selectedPackages,
  selectedPlans,
  onPlanSelect,
  userAge,
  userGender
}) => {
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

  const getPlanPremium = (plan: InsurancePlan, age: number, gender: 'male' | 'female'): number => {
    const ageRange = getAgeRange(age);
    const premiumData = plan.monthlyPremium[gender];
    
    // Find the matching age range
    for (const [range, premium] of Object.entries(premiumData)) {
      const [minAge, maxAge] = range.split('-').map(Number);
      if (age >= minAge && age <= maxAge) {
        return premium;
      }
    }
    
    return 0;
  };

  const getSelectedPlan = (packageId: string, planId: string): SelectedPlan | undefined => {
    return selectedPlans.find(sp => sp.packageId === packageId && sp.planId === planId);
  };

  if (selectedPackages.length === 0) {
    return (
      <Card className="border-dashed border-2 border-gray-300">
        <CardContent className="text-center py-8">
          <p className="text-gray-500">กรุณาเลือกแพ็กเกจประกันก่อน</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-brand-green mb-2">
          เลือกแผนความคุ้มครอง
        </h3>
        <p className="text-sm text-gray-600">
          เลือกแผนและจำนวนหน่วยสำหรับแต่ละแพ็กเกจ
        </p>
      </div>

      {selectedPackages.map(packageId => {
        const pkg = insurancePackages.find(p => p.id === packageId);
        if (!pkg) return null;

        return (
          <Card key={packageId} className="border-l-4 border-l-brand-green">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-brand-green">{pkg.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pkg.plans.map(plan => {
                const monthlyPremium = getPlanPremium(plan, userAge, userGender);
                const selectedPlan = getSelectedPlan(packageId, plan.id);
                const isSelected = !!selectedPlan;
                const units = selectedPlan?.units || 1;

                return (
                  <div
                    key={plan.id}
                    className={`p-4 rounded-lg border transition-all ${
                      isSelected 
                        ? 'border-brand-green bg-green-50' 
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{plan.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {plan.coverage} บาท
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{plan.description}</p>
                        <p className="text-lg font-bold text-brand-green">
                          {monthlyPremium.toLocaleString()} บาท/เดือน
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Label htmlFor={`units-${packageId}-${plan.id}`} className="text-sm">
                          จำนวนหน่วย
                        </Label>
                        <Input
                          id={`units-${packageId}-${plan.id}`}
                          type="number"
                          min="0"
                          max="10"
                          value={isSelected ? units : 0}
                          onChange={(e) => {
                            const newUnits = parseInt(e.target.value) || 0;
                            onPlanSelect(packageId, plan.id, newUnits);
                          }}
                          className="w-20"
                        />
                      </div>
                      {isSelected && units > 0 && (
                        <div className="text-right">
                          <p className="text-sm text-gray-600">รวมต่อเดือน</p>
                          <p className="font-bold text-brand-green">
                            {(monthlyPremium * units).toLocaleString()} บาท
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default PlanSelector;
