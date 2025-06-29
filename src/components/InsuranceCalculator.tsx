import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import QuoteResult from './QuoteResult';
import SelectiveForm from './SelectiveForm';

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
  units: number;
  subPackages?: string[];
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
  
  const [selectedPackagesFromForm, setSelectedPackagesFromForm] = useState<SelectedPackage[]>([]);
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
    if (!formData.gender || !formData.currentAge || !formData.coverageAge || selectedPackagesFromForm.length === 0) {
      toast({
        title: "ข้อมูลไม่ครบถ้วน",
        description: "กรุณากรอกข้อมูลและเลือกแพ็กเกจประกันอย่างน้อย 1 รายการ",
        variant: "destructive",
      });
      return;
    }

    // Calculate premium based on selected packages from SelectiveForm
    let totalBasePremium = 0;
    selectedPackagesFromForm.forEach(pkg => {
      // Base premium calculation per package (you can adjust this logic)
      const basePremiumPerPackage = 8000; // Example base premium
      totalBasePremium += basePremiumPerPackage * pkg.units;
      
      // Add sub-packages premium if any
      if (pkg.subPackages && pkg.subPackages.length > 0) {
        totalBasePremium += pkg.subPackages.length * 3000; // Example sub-package premium
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
    setSelectedPackagesFromForm([]);
    setShowResult(false);
    setCalculatedPremium(null);
    
    toast({
      title: "รีเซ็ตฟอร์มเรียบร้อย",
      description: "สามารถกรอกข้อมูลใหม่ได้",
    });
  };

  const handlePackagesSelected = (packages: SelectedPackage[]) => {
    setSelectedPackagesFromForm(packages);
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
                        {Array.from({length: 99}, (_, i) => i + 1).map((age) => (
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
                      <SelectItem value="85">85 ปี</SelectItem>
                      <SelectItem value="90">90 ปี</SelectItem>
                      <SelectItem value="95">95 ปี</SelectItem>
                      <SelectItem value="99">99 ปี</SelectItem>
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

              {/* Package Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-brand-green border-b pb-2">
                  เลือกแพ็กเกจประกันภัย *
                </h3>
                <SelectiveForm onPackagesSelected={handlePackagesSelected} />
              </div>

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
              selectedPackages={selectedPackagesFromForm.map(pkg => ({
                id: pkg.id,
                name: pkg.name,
                coverage: 500000, // You can adjust this based on package
                premium: 8000 * pkg.units // You can adjust this calculation
              }))}
              selectedPlans={[]} // No longer using the old plans system
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default InsuranceCalculator;
