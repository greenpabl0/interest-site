import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Save, Package, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SelectedPackage {
  id: string;
  name: string;
  category: string;
  units: number;
  subPackages?: string[];
}

interface SelectiveFormProps {
  onPackagesSelected?: (packages: SelectedPackage[]) => void;
}

const SelectiveForm: React.FC<SelectiveFormProps> = ({ onPackagesSelected }) => {
  const [selectedPackages, setSelectedPackages] = useState<SelectedPackage[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedSubPackages, setExpandedSubPackages] = useState<string[]>([]);
  const { toast } = useToast();

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

  const togglePackage = (packageName: string, categoryId: string) => {
    const packageId = `${categoryId}-${packageName}`;
    const existing = selectedPackages.find(p => p.id === packageId);
    
    if (existing) {
      setSelectedPackages(selectedPackages.filter(p => p.id !== packageId));
      // Remove from expanded sub packages if exists
      setExpandedSubPackages(expandedSubPackages.filter(id => id !== packageId));
    } else {
      const newPackage: SelectedPackage = {
        id: packageId,
        name: packageName,
        category: categoryId,
        units: 1,
        subPackages: subPackages[packageName] ? [] : undefined
      };
      setSelectedPackages([...selectedPackages, newPackage]);
      
      // Auto expand if has sub packages
      if (subPackages[packageName]) {
        setExpandedSubPackages([...expandedSubPackages, packageId]);
      }
    }
  };

  const toggleSubPackage = (subPackageName: string, parentPackageId: string) => {
    setSelectedPackages(selectedPackages.map(pkg => {
      if (pkg.id === parentPackageId) {
        const currentSubs = pkg.subPackages || [];
        const hasSubPackage = currentSubs.includes(subPackageName);
        
        return {
          ...pkg,
          subPackages: hasSubPackage 
            ? currentSubs.filter(sub => sub !== subPackageName)
            : [...currentSubs, subPackageName]
        };
      }
      return pkg;
    }));
  };

  const updateUnits = (packageId: string, units: number) => {
    if (units < 1) return;
    
    setSelectedPackages(selectedPackages.map(pkg => 
      pkg.id === packageId ? { ...pkg, units } : pkg
    ));
  };

  const resetSelection = () => {
    setSelectedPackages([]);
    setExpandedCategories([]);
    setExpandedSubPackages([]);
    
    if (onPackagesSelected) {
      onPackagesSelected([]);
    }
    
    toast({
      title: "รีเซ็ตสำเร็จ",
      description: "ล้างการเลือกแพ็กเกจทั้งหมดแล้ว",
    });
  };

  const handleSave = () => {
    if (selectedPackages.filter(pkg => pkg.units > 0).length === 0) {
      toast({
        title: "ไม่พบข้อมูล",
        description: "กรุณาเลือกแพ็กเกจอย่างน้อย 1 รายการ",
        variant: "destructive",
      });
      return;
    }

    console.log('Selected Packages:', selectedPackages);
    
    if (onPackagesSelected) {
      onPackagesSelected(selectedPackages.filter(pkg => pkg.units > 0));
    }
    
    toast({
      title: "บันทึกสำเร็จ",
      description: `บันทึกแพ็กเกจแล้ว ${selectedPackages.filter(pkg => pkg.units > 0).length} รายการ`,
    });
  };

  const isPackageSelected = (packageName: string, categoryId: string) => {
    return selectedPackages.some(p => p.id === `${categoryId}-${packageName}`);
  };

  const getSelectedPackage = (packageName: string, categoryId: string) => {
    return selectedPackages.find(p => p.id === `${categoryId}-${packageName}`);
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-brand-green mb-2">
          เลือกแพ็กเกจประกันภัย
        </h3>
        <p className="text-gray-600 text-sm">
          เลือกหมวดหมู่และแพ็กเกจที่ต้องการ พร้อมระบุจำนวนหน่วย
        </p>
      </div>

      <Card className="shadow-lg border-0">
        <CardHeader className="brand-green text-white py-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Package className="w-4 h-4" />
            เลือกหมวดหมู่สัญญา
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 space-y-3">
          
          {Object.values(categories).map((category) => (
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
                    <div className={`w-4 h-4 rounded border-2 ${
                      selectedPackages.some(p => p.category === category.id)
                        ? 'bg-brand-green border-brand-green'
                        : 'border-gray-300'
                    }`}>
                      {selectedPackages.some(p => p.category === category.id) && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                      )}
                    </div>
                    <span className="font-medium text-brand-green">{category.name}</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 transition-transform ${
                    expandedCategories.includes(category.id) ? 'rotate-180' : ''
                  }`} />
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="space-y-3 mt-3 pl-4">
                {category.packages.map((packageName) => (
                  <div key={packageName} className="space-y-3">
                    {/* Main Package */}
                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <Checkbox
                            checked={isPackageSelected(packageName, category.id)}
                            onCheckedChange={() => togglePackage(packageName, category.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <Label className="font-medium text-gray-800 cursor-pointer">
                              {packageName}
                            </Label>
                            
                            {isPackageSelected(packageName, category.id) && (
                              <div className="mt-3 flex items-center gap-3">
                                <Label className="text-sm text-gray-600">จำนวนหน่วย:</Label>
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-8 h-8 p-0"
                                    onClick={() => {
                                      const pkg = getSelectedPackage(packageName, category.id);
                                      if (pkg) updateUnits(pkg.id, pkg.units - 1);
                                    }}
                                  >
                                    -
                                  </Button>
                                  <span className="w-12 text-center font-medium">
                                    {getSelectedPackage(packageName, category.id)?.units || 1}
                                  </span>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-8 h-8 p-0"
                                    onClick={() => {
                                      const pkg = getSelectedPackage(packageName, category.id);
                                      if (pkg) updateUnits(pkg.id, pkg.units + 1);
                                    }}
                                  >
                                    +
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sub Packages */}
                    {subPackages[packageName] && isPackageSelected(packageName, category.id) && (
                      <div className="ml-8 space-y-2">
                        <Label className="text-sm font-medium text-brand-gold">
                          ตัวเลือกเพิ่มเติม:
                        </Label>
                        {subPackages[packageName].map((subPackage) => {
                          const parentPkg = getSelectedPackage(packageName, category.id);
                          const isSubSelected = parentPkg?.subPackages?.includes(subPackage) || false;
                          
                          return (
                            <div key={subPackage} className="bg-brand-gold/10 p-3 rounded-lg">
                              <div className="flex items-center gap-3">
                                <Checkbox
                                  checked={isSubSelected}
                                  onCheckedChange={() => {
                                    if (parentPkg) {
                                      toggleSubPackage(subPackage, parentPkg.id);
                                    }
                                  }}
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
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))}

          {/* Selected Summary */}
          {selectedPackages.filter(pkg => pkg.units > 0).length > 0 && (
            <div className="mt-4 p-3 bg-brand-green/5 rounded-lg border border-brand-green/20">
              <h4 className="font-semibold text-brand-green mb-2 text-sm">แพ็กเกจที่เลือก:</h4>
              <div className="space-y-1">
                {selectedPackages.filter(pkg => pkg.units > 0).map((pkg) => (
                  <div key={pkg.id} className="flex justify-between items-center text-xs">
                    <span className="font-medium">{pkg.name}</span>
                    <span className="text-brand-gold">
                      {pkg.units} หน่วย
                      {pkg.subPackages && pkg.subPackages.length > 0 && (
                        <span className="ml-1 text-xs text-gray-500">
                          (+{pkg.subPackages.length})
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-3 border-t space-y-2">
            <Button 
              onClick={handleSave}
              className="brand-green text-white hover:opacity-90 w-full h-10 text-sm"
            >
              <Save className="w-4 h-4 mr-2" />
              บันทึกการเลือก
            </Button>
            
            <Button 
              onClick={resetSelection}
              variant="outline"
              className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white w-full h-10 text-sm"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              รีเซ็ตการเลือก
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SelectiveForm;
