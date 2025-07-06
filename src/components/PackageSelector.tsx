
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { insurancePackages, InsurancePackage } from '@/data/insurancePackages';
import { isPackageEligible, getEligibilityReason } from '@/utils/packageFilters';

interface PackageSelectorProps {
  selectedPackages: string[];
  onPackageSelect: (packageId: string) => void;
  userAge: number;
  userGender: 'male' | 'female';
}

const PackageSelector: React.FC<PackageSelectorProps> = ({
  selectedPackages,
  onPackageSelect,
  userAge,
  userGender
}) => {
  const eligiblePackages = insurancePackages.filter(pkg => 
    isPackageEligible(pkg.name, userAge, userGender)
  );

  const groupedPackages = eligiblePackages.reduce((acc, pkg) => {
    if (!acc[pkg.category]) {
      acc[pkg.category] = [];
    }
    acc[pkg.category].push(pkg);
    return acc;
  }, {} as Record<string, InsurancePackage[]>);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-brand-green mb-2">
          เลือกแพ็กเกจประกันภัย
        </h3>
        <p className="text-sm text-gray-600">
          พบแพ็กเกจที่เหมาะสำหรับคุณ {eligiblePackages.length} รายการ
        </p>
      </div>

      {Object.entries(groupedPackages).map(([category, packages]) => (
        <Card key={category} className="border-l-4 border-l-brand-green">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-brand-green">{category}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {packages.map((pkg) => {
              const isSelected = selectedPackages.includes(pkg.id);
              const eligibilityReason = getEligibilityReason(pkg.name, userAge, userGender);
              
              return (
                <div
                  key={pkg.id}
                  className={`p-4 rounded-lg border transition-all ${
                    isSelected 
                      ? 'border-brand-green bg-green-50' 
                      : 'border-gray-200 hover:border-brand-green/50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onPackageSelect(pkg.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900">{pkg.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          อายุ {pkg.minAge}-{pkg.maxAge} ปี
                        </Badge>
                        {pkg.allowedGenders.length === 1 && (
                          <Badge variant="secondary" className="text-xs">
                            {pkg.allowedGenders[0] === 'female' ? 'ผู้หญิงเท่านั้น' : 'ผู้ชายเท่านั้น'}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{pkg.description}</p>
                      {eligibilityReason && (
                        <p className="text-xs text-green-600">{eligibilityReason}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {pkg.plans.length} แผนความคุ้มครองให้เลือก
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PackageSelector;
