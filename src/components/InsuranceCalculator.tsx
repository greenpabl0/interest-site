
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import QuoteResult from './QuoteResult';

interface CalculatorData {
  gender: string;
  currentAge: string;
  coverageAge: string;
  paymentFrequency: string;
  plans: string[];
  packages: string[];
}

const InsuranceCalculator = () => {
  const [formData, setFormData] = useState<CalculatorData>({
    gender: '',
    currentAge: '',
    coverageAge: '',
    paymentFrequency: '',
    plans: [],
    packages: []
  });
  
  const [showResult, setShowResult] = useState(false);
  const [calculatedPremium, setCalculatedPremium] = useState<{
    monthly: number;
    quarterly: number;
    semiAnnual: number;
    annual: number;
  } | null>(null);

  const { toast } = useToast();

  const insurancePlans = [
    { id: 'comprehensive', name: 'แผนครอบคลุม', description: 'ความคุ้มครองรอบด้าน', basePremium: 18000 },
    { id: 'critical-illness', name: 'แผนโรคร้ายแรง', description: 'เฉพาะโรคร้ายแรง 35 โรค', basePremium: 15000 },
    { id: 'accident', name: 'แผนอุบัติเหตุ', description: 'ความคุ้มครองจากอุบัติเหตุ', basePremium: 8000 },
    { id: 'health', name: 'แผนสุขภาพ', description: 'ค่ารักษาพยาบาล', basePremium: 10000 },
    { id: 'health-basic', name: 'แผนสุขภาพ Basic', description: 'ค่ารักษาพยาบาลพื้นฐาน', basePremium: 7000 },
    { id: 'health-plus', name: 'แผนสุขภาพ Plus', description: 'ค่ารักษาพยาบาลขั้นสูง', basePremium: 13000 }
  ];

  const availablePackages = {
    'comprehensive': [
      { id: 'comp-basic', name: 'แพ็กเกจพื้นฐาน', coverage: 500000, premium: 12000 },
      { id: 'comp-premium', name: 'แพ็กเกจพรีเมียม', coverage: 1000000, premium: 18000 },
      { id: 'comp-platinum', name: 'แพ็กเกจแพลทินัม', coverage: 2000000, premium: 25000 }
    ],
    'critical-illness': [
      { id: 'ci-standard', name: 'แพ็กเกจมาตรฐาน', coverage: 800000, premium: 15000 },
      { id: 'ci-enhanced', name: 'แพ็กเกจเสริม', coverage: 1500000, premium: 22000 }
    ],
    'accident': [
      { id: 'acc-basic', name: 'แพ็กเกจพื้นฐาน', coverage: 300000, premium: 8000 },
      { id: 'acc-plus', name: 'แพ็กเกจพลัส', coverage: 600000, premium: 12000 }
    ],
    'health': [
      { id: 'health-basic', name: 'แพ็กเกจพื้นฐาน', coverage: 400000, premium: 10000 },
      { id: 'health-premium', name: 'แพ็กเกจพรีเมียม', coverage: 800000, premium: 16000 }
    ],
    'health-basic': [
      { id: 'hb-starter', name: 'แพ็กเกจเริ่มต้น', coverage: 200000, premium: 5000 },
      { id: 'hb-standard', name: 'แพ็กเกจมาตรฐาน', coverage: 350000, premium: 8000 }
    ],
    'health-plus': [
      { id: 'hp-advanced', name: 'แพ็กเกจขั้นสูง', coverage: 600000, premium: 14000 },
      { id: 'hp-premium', name: 'แพ็กเกจพรีเมียม', coverage: 1000000, premium: 20000 }
    ]
  };

  const calculatePremium = () => {
    if (!formData.gender || !formData.currentAge || !formData.coverageAge || formData.plans.length === 0) {
      toast({
        title: "ข้อมูลไม่ครบถ้วน",
        description: "กรุณากรอกข้อมูลและเลือกแผนประกันอย่างน้อย 1 แผน",
        variant: "destructive",
      });
      return;
    }

    // Calculate premium based on selected plans
    let totalBasePremium = 0;
    formData.plans.forEach(planId => {
      const plan = insurancePlans.find(p => p.id === planId);
      if (plan) {
        totalBasePremium += plan.basePremium;
      }
    });

    // Add package premiums
    const allPackages = Object.values(availablePackages).flat();
    formData.packages.forEach(packageId => {
      const pkg = allPackages.find(p => p.id === packageId);
      if (pkg) {
        totalBasePremium += pkg.premium;
      }
    });
    
    const ageMultiplier = parseInt(formData.currentAge) > 40 ? 1.3 : 1.0;
    const genderMultiplier = formData.gender === 'male' ? 1.1 : 1.0;
    
    const annualPremium = Math.round(totalBasePremium * ageMultiplier * genderMultiplier);
    
    setCalculatedPremium({
      annual: annualPremium,
      semiAnnual: Math.round(annualPremium / 2 * 1.02),
      quarterly: Math.round(annualPremium / 4 * 1.05),
      monthly: Math.round(annualPremium / 12 * 1.08)
    });
    
    setShowResult(true);
    
    toast({
      title: "คำนวณเบี้ยประกันสำเร็จ",
      description: "ผลลัพธ์แสดงด้านล่าง",
    });
  };

  const resetForm = () => {
    setFormData({
      gender: '',
      currentAge: '',
      coverageAge: '',
      paymentFrequency: '',
      plans: [],
      packages: []
    });
    setShowResult(false);
    setCalculatedPremium(null);
    
    toast({
      title: "รีเซ็ตฟอร์มเรียบร้อย",
      description: "สามารถกรอกข้อมูลใหม่ได้",
    });
  };

  const togglePlan = (planId: string) => {
    const currentPlans = [...formData.plans];
    const index = currentPlans.indexOf(planId);
    
    if (index > -1) {
      currentPlans.splice(index, 1);
      // Remove packages related to this plan
      const relatedPackages = availablePackages[planId as keyof typeof availablePackages] || [];
      const relatedPackageIds = relatedPackages.map(pkg => pkg.id);
      const filteredPackages = formData.packages.filter(pkgId => !relatedPackageIds.includes(pkgId));
      setFormData({...formData, plans: currentPlans, packages: filteredPackages});
    } else {
      currentPlans.push(planId);
      setFormData({...formData, plans: currentPlans});
    }
  };

  const togglePackage = (packageId: string) => {
    const currentPackages = [...formData.packages];
    const index = currentPackages.indexOf(packageId);
    
    if (index > -1) {
      currentPackages.splice(index, 1);
    } else {
      currentPackages.push(packageId);
    }
    
    setFormData({...formData, packages: currentPackages});
  };

  // Get all packages for selected plans
  const getAvailablePackages = () => {
    let packages: any[] = [];
    formData.plans.forEach(planId => {
      const planPackages = availablePackages[planId as keyof typeof availablePackages] || [];
      packages = [...packages, ...planPackages];
    });
    return packages;
  };

  const selectedPlanPackages = getAvailablePackages();

  return (
    <section id="calculator" className="py-8 bg-gray-50">
      <div className="container mx-auto px-3">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-green mb-3">
            เครื่องคำนวณเบี้ยประกัน
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            คำนวณเบี้ยประกันที่เหมาะสมกับคุณ ง่ายๆ ในไม่กี่ขั้นตอน
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg border-0">
            <CardHeader className="brand-green text-white py-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calculator className="w-5 h-5" />
                กรอกข้อมูลเพื่อคำนวณเบี้ยประกัน
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-6">
              
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-brand-green border-b pb-2">
                  ข้อมูลส่วนตัว
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-sm">เพศ *</Label>
                    <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="เลือกเพศ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">ชาย</SelectItem>
                        <SelectItem value="female">หญิง</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentAge" className="text-sm">อายุปัจจุบัน *</Label>
                    <Select value={formData.currentAge} onValueChange={(value) => setFormData({...formData, currentAge: value})}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="เลือกอายุ" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({length: 45}, (_, i) => i + 20).map((age) => (
                          <SelectItem key={age} value={age.toString()}>{age} ปี</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coverageAge" className="text-sm">ความคุ้มครองจนถึงอายุ *</Label>
                  <Select value={formData.coverageAge} onValueChange={(value) => setFormData({...formData, coverageAge: value})}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="เลือกอายุสิ้นสุด" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="60">60 ปี</SelectItem>
                      <SelectItem value="65">65 ปี</SelectItem>
                      <SelectItem value="70">70 ปี</SelectItem>
                      <SelectItem value="75">75 ปี</SelectItem>
                      <SelectItem value="80">80 ปี</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentFrequency" className="text-sm">ความถี่ในการจ่าย</Label>
                  <Select value={formData.paymentFrequency} onValueChange={(value) => setFormData({...formData, paymentFrequency: value})}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="เลือกวิธีการจ่าย" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">รายเดือน</SelectItem>
                      <SelectItem value="quarterly">รายไตรมาส</SelectItem>
                      <SelectItem value="semiannual">รายครึ่งปี</SelectItem>
                      <SelectItem value="annual">รายปี</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Insurance Plans - Multiple Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-brand-green border-b pb-2">
                  แผนประกัน (เลือกได้หลายแผน) *
                </h3>
                
                <div className="grid grid-cols-1 gap-3">
                  {insurancePlans.map((plan) => (
                    <div 
                      key={plan.id} 
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.plans.includes(plan.id) 
                          ? 'border-brand-green bg-brand-green/5' 
                          : 'border-gray-200 hover:border-brand-green/50'
                      }`}
                      onClick={() => togglePlan(plan.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-brand-green">{plan.name}</div>
                          <div className="text-sm text-gray-600 mt-1">{plan.description}</div>
                          <div className="text-sm text-brand-gold font-medium mt-2">
                            เบี้ยเริ่มต้น: {plan.basePremium.toLocaleString()} บาท/ปี
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          formData.plans.includes(plan.id) 
                            ? 'bg-brand-green border-brand-green' 
                            : 'border-gray-300'
                        }`}>
                          {formData.plans.includes(plan.id) && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Packages */}
              {selectedPlanPackages.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-brand-green border-b pb-2">
                    แพ็กเกจเสริม (เลือกได้หลายรายการ)
                  </h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {selectedPlanPackages.map((pkg) => (
                      <div 
                        key={pkg.id} 
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          formData.packages.includes(pkg.id) 
                            ? 'border-brand-gold bg-brand-gold/5' 
                            : 'border-gray-200 hover:border-brand-gold/50'
                        }`}
                        onClick={() => togglePackage(pkg.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-brand-green">{pkg.name}</div>
                            <div className="text-sm text-gray-600">
                              ความคุ้มครอง: {pkg.coverage.toLocaleString()} บาท
                            </div>
                            <div className="text-sm text-brand-gold font-medium">
                              +{pkg.premium.toLocaleString()} บาท/ปี
                            </div>
                          </div>
                          <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                            formData.packages.includes(pkg.id) 
                              ? 'bg-brand-gold border-brand-gold' 
                              : 'border-gray-300'
                          }`}>
                            {formData.packages.includes(pkg.id) && (
                              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t">
                <Button 
                  onClick={calculatePremium}
                  className="brand-green text-white hover:opacity-90 w-full h-12 text-lg"
                  size="lg"
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  คำนวณเบี้ยประกัน
                </Button>
                
                <Button 
                  onClick={resetForm}
                  variant="outline"
                  className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white w-full h-12"
                  size="lg"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  รีเซ็ตฟอร์ม
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {showResult && calculatedPremium && (
            <QuoteResult 
              formData={formData}
              premium={calculatedPremium}
              selectedPackages={selectedPlanPackages.filter(pkg => formData.packages.includes(pkg.id))}
              selectedPlans={insurancePlans.filter(plan => formData.plans.includes(plan.id))}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default InsuranceCalculator;
