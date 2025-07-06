
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ArrowRight, Filter, AlertCircle } from 'lucide-react';
import { filterEligiblePackages, getEligibilityReason } from '@/utils/packageFilters';

interface PackageSelectorProps {
  userAge?: number;
  userGender?: string;
  onPackagesSelected: (packages: string[]) => void;
}

const PackageSelector: React.FC<PackageSelectorProps> = ({ 
  userAge = 25, 
  userGender = 'male', 
  onPackagesSelected 
}) => {
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const categories = {
    additional: {
      id: 'additional',
      name: 'Additional contract',
      packages: [
        'AIA Health Happy Kids',
        'AIA H&S (new standard)',
        'AIA H&S Extra (new standard)',
        'AIA Health Saver',
        'AIA Health Happy',
        'AIA Infinite Care (new standard)',
        'HB',
        'AIA HB Extra',
        'ผลประโยชน์ Day Case ของสัญญาเพิ่มเติม HB และ AIA HB Extra'
      ]
    },
    critical: {
      id: 'critical',
      name: 'Critical Illness',
      packages: [
        'AIA Health Cancer',
        'AIA Care for Cancer',
        'AIA CI Plus',
        'AIA CI Top Up',
        'multi pay-ci plus',
        'Lady Care & Lady Care Plus',
        'AIA TPD'
      ]
    },
    accident: {
      id: 'accident',
      name: 'Accident coverage',
      packages: [
        'Accident Coverage'
      ]
    }
  };

  const subPackages = {
    'multi pay-ci plus': [
      'AIA Multi-Pay CI',
      'AIA Total Care'
    ]
  };

  // Filter categories and packages based on user eligibility
  const getFilteredCategories = () => {
    const validGender = (userGender === 'male' || userGender === 'female') ? userGender : 'male';
    const validAge = userAge && userAge > 0 ? userAge : 25;

    const filteredCategories = { ...categories };
    
    Object.keys(filteredCategories).forEach(categoryKey => {
      const category = filteredCategories[categoryKey];
      category.packages = filterEligiblePackages(category.packages, validAge, validGender);
    });

    // Remove empty categories
    Object.keys(filteredCategories).forEach(categoryKey => {
      if (filteredCategories[categoryKey].packages.length === 0) {
        delete filteredCategories[categoryKey];
      }
    });

    return filteredCategories;
  };

  const toggleCategory = (categoryId: string) => {
    const newExpanded = [...expandedCategories];
    const index = newExpanded.indexOf(categoryId);
    
    if (index > -1) {
      newExpanded.splice(index, 1);
    } else {
      newExpanded.push(categoryId);
    }
    
    setExpandedCategories(newExpanded);
  };

  const togglePackage = (packageName: string) => {
    const newSelected = [...selectedPackages];
    const index = newSelected.indexOf(packageName);
    
    if (index > -1) {
      newSelected.splice(index, 1);
      // Remove sub-packages if main package is deselected
      if (subPackages[packageName]) {
        subPackages[packageName].forEach(subPkg => {
          const subIndex = newSelected.indexOf(subPkg);
          if (subIndex > -1) {
            newSelected.splice(subIndex, 1);
          }
        });
      }
    } else {
      newSelected.push(packageName);
    }
    
    setSelectedPackages(newSelected);
  };

  const toggleSubPackage = (subPackageName: string, parentPackage: string) => {
    const newSelected = [...selectedPackages];
    const index = newSelected.indexOf(subPackageName);
    
    if (index > -1) {
      newSelected.splice(index, 1);
    } else {
      // Ensure parent package is selected
      if (!newSelected.includes(parentPackage)) {
        newSelected.push(parentPackage);
      }
      newSelected.push(subPackageName);
    }
    
    setSelectedPackages(newSelected);
  };

  const handleContinue = () => {
    if (selectedPackages.length === 0) return;
    onPackagesSelected(selectedPackages);
  };

  const filteredCategories = getFilteredCategories();
  const validGender = (userGender === 'male' || userGender === 'female') ? userGender : 'male';
  const validAge = userAge && userAge > 0 ? userAge : 25;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6 bg-gradient-to-r from-brand-green/5 to-brand-gold/5 p-6 rounded-lg">
        <h3 className="text-2xl font-bold text-brand-green mb-3">
          เลือกแพ็กเกจประกันภัย
        </h3>
        <p className="text-brand-gold font-medium">
          ขั้นตอนที่ 1: เลือกแพ็กเกจที่ต้องการ
        </p>
        <div className="mt-3 flex items-center justify-center gap-2 text-sm text-brand-green">
          <Filter className="w-4 h-4" />
          <span>กรองสำหรับ: {validGender === 'male' ? 'ชาย' : 'หญิง'} อายุ {validAge} ปี</span>
        </div>
      </div>

      <Card className="shadow-lg border border-brand-green/20">
        <CardHeader className="bg-gradient-to-r from-brand-green to-brand-green/80 text-white py-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            เลือกหมวดหมู่แพ็กเกจ
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          
          {Object.keys(filteredCategories).length === 0 && (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">ไม่มีแพ็กเกจที่เหมาะสมสำหรับข้อมูลที่กรอก</p>
              <p className="text-sm text-gray-500 mt-1">กรุณาตรวจสอบอายุและเพศที่กรอก</p>
            </div>
          )}

          {Object.values(filteredCategories).map((category) => (
            <Collapsible 
              key={category.id}
              open={expandedCategories.includes(category.id)}
              onOpenChange={() => toggleCategory(category.id)}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between h-12 text-left border-brand-green hover:bg-brand-green/5"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-brand-green">{category.name}</span>
                    <span className="text-xs text-gray-500">({category.packages.length} แพ็กเกจ)</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 transition-transform ${
                    expandedCategories.includes(category.id) ? 'rotate-180' : ''
                  }`} />
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="space-y-3 mt-3 pl-4">
                {category.packages.map((packageName) => {
                  const isSelected = selectedPackages.includes(packageName);
                  const eligibilityReason = getEligibilityReason(packageName, validAge, validGender);
                  
                  return (
                    <div key={packageName} className="space-y-2">
                      <div className="bg-white p-4 rounded-lg border shadow-sm">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => togglePackage(packageName)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <Label className="font-medium text-gray-800 cursor-pointer">
                                {packageName}
                              </Label>
                              {eligibilityReason && (
                                <div className="text-xs text-brand-gold bg-brand-gold/10 px-2 py-1 rounded mt-1 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  {eligibilityReason}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Sub Packages */}
                      {subPackages[packageName] && isSelected && (
                        <div className="ml-8 space-y-2">
                          <Label className="text-sm font-medium text-brand-gold">
                            ตัวเลือกเพิ่มเติม:
                          </Label>
                          {subPackages[packageName].map((subPackage) => {
                            const isSubSelected = selectedPackages.includes(subPackage);
                            
                            return (
                              <div key={subPackage} className="bg-brand-gold/10 p-3 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <Checkbox
                                    checked={isSubSelected}
                                    onCheckedChange={() => toggleSubPackage(subPackage, packageName)}
                                  />
                                  <Label className="text-sm font-medium text-brand-green cursor-pointer">
                                    {subPackage}
                                  </Label>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>
          ))}

          {/* Selected Summary */}
          {selectedPackages.length > 0 && (
            <div className="mt-6 p-6 bg-gradient-to-r from-brand-green/10 to-brand-gold/10 rounded-lg border border-brand-green/20">
              <h4 className="font-bold text-brand-green mb-4 text-lg">แพ็กเกจที่เลือก ({selectedPackages.length} รายการ):</h4>
              <div className="space-y-2">
                {selectedPackages.map((packageName) => (
                  <div key={packageName} className="bg-white p-3 rounded-lg shadow-sm">
                    <span className="font-medium text-brand-green">{packageName}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Continue Button */}
          <div className="pt-6 border-t border-brand-green/20">
            <Button 
              onClick={handleContinue}
              disabled={selectedPackages.length === 0}
              className="brand-green text-white hover:opacity-90 w-full h-12 text-lg font-medium shadow-lg disabled:opacity-50"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              ดำเนินการต่อ - เลือกแผนความคุ้มครอง
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PackageSelector;
