import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Calculator, RotateCcw, Package, Shield, Search, Save, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import QuoteResult from './QuoteResult';
import { isPackageEligible, filterEligiblePackages } from '@/utils/packageFilters';

interface CalculatorData {
  gender: string;
  currentAge: string;
  coverageAge: string;
  paymentFrequency: string;
  plans: string[];
  packages: string[];
}

interface SelectedPackage {
  id: string;
  name: string;
  category: string;
  subPackages?: string[];
  selectedPlans: {
    planId: string;
    planName: string;
    coverage: string;
    units: number;
    monthlyPremium: number;
    annualPremium: number;
  }[];
}

interface StepData {
  selectedPackage: string;
  selectedPlan: string;
  searchResults: any;
  savedData: any;
}

const InsuranceCalculator = () => {
  const [formData, setFormData] = useState<CalculatorData>({
    gender: '',
    currentAge: '',
    coverageAge: '',
    paymentFrequency: 'annual',
    plans: [],
    packages: []
  });
  
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [stepData, setStepData] = useState<StepData>({
    selectedPackage: '',
    selectedPlan: '',
    searchResults: null,
    savedData: null
  });

  const [showResult, setShowResult] = useState(false);
  const [calculatedPremium, setCalculatedPremium] = useState<{
    monthly: number;
    quarterly: number;
    semiAnnual: number;
    annual: number;
  } | null>(null);

  const { toast } = useToast();

  // Available packages and plans data
  const allPackages = [
    'AIA Health Happy Kids',
    'AIA H&S (new standard)',
    'AIA H&S Extra (new standard)',
    'AIA Health Saver',
    'AIA Health Happy',
    'AIA Infinite Care (new standard)',
    'HB',
    'AIA HB Extra',
    'AIA Health Cancer',
    'AIA Care for Cancer',
    'AIA CI Plus',
    'AIA CI Top Up',
    'Lady Care & Lady Care Plus',
    'AIA TPD',
    'AIA Multi-Pay CI',
    'AIA Total Care',
    'Accident Coverage'
  ];

  const plansByPackage: Record<string, string[]> = {
    'AIA Health Happy Kids': ['Basic Plan', 'Premium Plan', 'Deluxe Plan'],
    'AIA H&S (new standard)': ['Standard Plan', 'Enhanced Plan'],
    'AIA H&S Extra (new standard)': ['Extra Plan A', 'Extra Plan B'],
    'AIA Health Saver': ['Saver Basic', 'Saver Plus'],
    'AIA Health Happy': ['Happy Basic', 'Happy Premium'],
    'AIA Infinite Care (new standard)': ['Infinite Basic', 'Infinite Premium'],
    'HB': ['HB Standard', 'HB Plus'],
    'AIA HB Extra': ['HB Extra A', 'HB Extra B'],
    'AIA Health Cancer': ['Cancer Basic', 'Cancer Premium'],
    'AIA Care for Cancer': ['Care Basic', 'Care Plus'],
    'AIA CI Plus': ['CI Basic', 'CI Premium'],
    'AIA CI Top Up': ['Top Up A', 'Top Up B'],
    'Lady Care & Lady Care Plus': ['Lady Basic', 'Lady Premium'],
    'AIA TPD': ['TPD Standard', 'TPD Plus'],
    'AIA Multi-Pay CI': ['Multi A', 'Multi B'],
    'AIA Total Care': ['Total Basic', 'Total Premium'],
    'Accident Coverage': ['Accident Basic', 'Accident Plus']
  };

  const getEligiblePackages = () => {
    if (!formData.currentAge || !formData.gender) return [];
    return filterEligiblePackages(
      allPackages,
      parseInt(formData.currentAge),
      formData.gender as 'male' | 'female'
    );
  };

  // Step 1: Package Selection
  const handlePackageSelection = () => {
    if (!formData.gender || !formData.currentAge) {
      toast({
        title: "ข้อมูลไม่ครบ",
        description: "กรุณากรอกข้อมูลส่วนตัวก่อนเลือกแพ็กเกจ",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep(1);
  };

  const selectPackage = (packageName: string) => {
    setStepData({ ...stepData, selectedPackage: packageName, selectedPlan: '' });
    setCurrentStep(2);
    toast({
      title: "เลือกแพ็กเกจสำเร็จ",
      description: `เลือก ${packageName} แล้ว`,
    });
  };

  // Step 2: Plan Selection
  const selectPlan = (planName: string) => {
    setStepData({ ...stepData, selectedPlan: planName });
    setCurrentStep(3);
    toast({
      title: "เลือกแผนสำเร็จ",
      description: `เลือก ${planName} แล้ว`,
    });
  };

  // Step 3: Search/Calculate
  const handleSearch = () => {
    if (!stepData.selectedPackage || !stepData.selectedPlan) {
      toast({
        title: "ข้อมูลไม่ครบ",
        description: "กรุณาเลือกแพ็กเกจและแผนก่อนค้นหา",
        variant: "destructive",
      });
      return;
    }

    // Mock calculation
    const mockPremium = {
      monthly: Math.floor(Math.random() * 5000) + 1000,
      quarterly: 0,
      semiAnnual: 0,
      annual: 0
    };
    mockPremium.quarterly = Math.round(mockPremium.monthly * 3 * 1.02);
    mockPremium.semiAnnual = Math.round(mockPremium.monthly * 6 * 1.01);
    mockPremium.annual = mockPremium.monthly * 12;

    setStepData({ ...stepData, searchResults: mockPremium });
    setCalculatedPremium(mockPremium);
    setCurrentStep(4);
    
    toast({
      title: "ค้นหาสำเร็จ",
      description: "พบเบี้ยประกันที่เหมาะสม",
    });
  };

  // Step 4: Save
  const handleSave = () => {
    setFormData({
      ...formData,
      packages: [stepData.selectedPackage],
      plans: [stepData.selectedPlan]
    });
    
    setStepData({ ...stepData, savedData: true });
    setShowResult(true);
    
    toast({
      title: "บันทึกสำเร็จ",
      description: "บันทึกข้อมูลประกันเรียบร้อย",
    });
  };

  const resetForm = () => {
    setFormData({
      gender: '',
      currentAge: '',
      coverageAge: '',
      paymentFrequency: 'annual', // Reset to annual
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

  const goBackStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        const eligiblePackages = getEligiblePackages();
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-brand-green">เลือกแพ็กเกจประกัน</h4>
              <Button variant="outline" size="sm" onClick={goBackStep}>
                ย้อนกลับ
              </Button>
            </div>
            <div className="grid gap-3 max-h-60 overflow-y-auto">
              {eligiblePackages.map((pkg) => (
                <Button
                  key={pkg}
                  variant="outline"
                  className="h-auto p-4 text-left justify-start"
                  onClick={() => selectPackage(pkg)}
                >
                  <Package className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="text-sm">{pkg}</span>
                </Button>
              ))}
            </div>
          </div>
        );

      case 2:
        const availablePlans = plansByPackage[stepData.selectedPackage] || [];
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-brand-green">เลือกแผนความคุ้มครอง</h4>
              <Button variant="outline" size="sm" onClick={goBackStep}>
                ย้อนกลับ
              </Button>
            </div>
            <p className="text-sm text-gray-600">แพ็กเกจที่เลือก: {stepData.selectedPackage}</p>
            <div className="grid gap-3">
              {availablePlans.map((plan) => (
                <Button
                  key={plan}
                  variant="outline"
                  className="h-auto p-4 text-left justify-start"
                  onClick={() => selectPlan(plan)}
                >
                  <Shield className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="text-sm">{plan}</span>
                </Button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-brand-green">ค้นหาเบี้ยประกัน</h4>
              <Button variant="outline" size="sm" onClick={goBackStep}>
                ย้อนกลับ
              </Button>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p className="text-sm"><strong>แพ็กเกจ:</strong> {stepData.selectedPackage}</p>
              <p className="text-sm"><strong>แผน:</strong> {stepData.selectedPlan}</p>
              <p className="text-sm"><strong>อายุ:</strong> {formData.currentAge} ปี</p>
              <p className="text-sm"><strong>เพศ:</strong> {formData.gender === 'male' ? 'ชาย' : 'หญิง'}</p>
            </div>
            <Button 
              onClick={handleSearch}
              className="brand-green text-white w-full"
            >
              <Search className="w-4 h-4 mr-2" />
              ค้นหาเบี้ยประกัน
            </Button>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-brand-green">ผลลัพธ์การค้นหา</h4>
              <Button variant="outline" size="sm" onClick={goBackStep}>
                ย้อนกลับ
              </Button>
            </div>
            {stepData.searchResults && (
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg space-y-2">
                <h5 className="font-semibold text-green-800">เบี้ยประกันที่คำนวณได้</h5>
                <p className="text-sm text-green-700">รายเดือน: ฿{stepData.searchResults.monthly.toLocaleString()}</p>
                <p className="text-sm text-green-700">รายปี: ฿{stepData.searchResults.annual.toLocaleString()}</p>
              </div>
            )}
            <Button 
              onClick={handleSave}
              className="brand-green text-white w-full"
              disabled={stepData.savedData}
            >
              {stepData.savedData ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  บันทึกแล้ว
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  บันทึกข้อมูล
                </>
              )}
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

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

        <div className="max-w-2xl mx-auto space-y-6">
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
                
                <div className="grid grid-cols-1 gap-4">
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

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="currentAge" className="text-sm">อายุปัจจุบัน (ปี) *</Label>
                      <Input
                        id="currentAge"
                        type="number"
                        min="1"
                        max="99"
                        value={formData.currentAge}
                        onChange={(e) => setFormData({...formData, currentAge: e.target.value})}
                        placeholder="กรอกอายุปัจจุบัน"
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="coverageAge" className="text-sm">ความคุ้มครองจนถึงอายุ (ปี) *</Label>
                      <Input
                        id="coverageAge"
                        type="number"
                        min={formData.currentAge || "1"}
                        max="99"
                        value={formData.coverageAge}
                        onChange={(e) => setFormData({...formData, coverageAge: e.target.value})}
                        placeholder="กรอกอายุสิ้นสุดความคุ้มครอง"
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentFrequency" className="text-sm">ความถี่ในการจ่าย</Label>
                    <Select value={formData.paymentFrequency} onValueChange={(value) => setFormData({...formData, paymentFrequency: value})}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="เลือกวิธีการจ่าย" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="annual">รายปี</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* 4-Step Process */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-brand-green border-b pb-2">
                  เลือกประกันภัย (4 ขั้นตอน)
                </h3>
                
                {/* Progress Indicator */}
                <div className="flex items-center justify-between mb-4">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        currentStep >= step ? 'bg-brand-green text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {step}
                      </div>
                      {step < 4 && (
                        <div className={`w-12 h-1 ${
                          currentStep > step ? 'bg-brand-green' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>

                {/* Step Buttons */}
                {currentStep === 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Button 
                      onClick={handlePackageSelection}
                      variant="outline" 
                      className="h-16 flex-col gap-1 border-brand-green text-brand-green hover:bg-brand-green hover:text-white"
                    >
                      <Package className="w-5 h-5" />
                      <span className="text-xs">เลือกแพ็กเกจ</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-16 flex-col gap-1" 
                      disabled
                    >
                      <Shield className="w-5 h-5" />
                      <span className="text-xs">เลือกแผน</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-16 flex-col gap-1" 
                      disabled
                    >
                      <Search className="w-5 h-5" />
                      <span className="text-xs">ค้นหา</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-16 flex-col gap-1" 
                      disabled
                    >
                      <Save className="w-5 h-5" />
                      <span className="text-xs">บันทึก</span>
                    </Button>
                  </div>
                )}

                {/* Step Content */}
                {currentStep > 0 && (
                  <Card className="p-4">
                    {renderStepContent()}
                  </Card>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t">
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
              selectedPackages={[{
                id: '1',
                name: stepData.selectedPackage,
                coverage: 1000000,
                premium: calculatedPremium.monthly
              }]}
              selectedPlans={[]}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default InsuranceCalculator;
