
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
  plan: string;
  packages: string[];
}

const InsuranceCalculator = () => {
  const [formData, setFormData] = useState<CalculatorData>({
    gender: '',
    currentAge: '',
    coverageAge: '',
    paymentFrequency: '',
    plan: '',
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
    { id: 'comprehensive', name: 'แผนครอบคลุม', description: 'ความคุ้มครองรอบด้าน' },
    { id: 'critical-illness', name: 'แผนโรคร้ายแรง', description: 'เฉพาะโรคร้ายแรง 35 โรค' },
    { id: 'accident', name: 'แผนอุบัติเหตุ', description: 'ความคุ้มครองจากอุบัติเหตุ' },
    { id: 'health', name: 'แผนสุขภาพ', description: 'ค่ารักษาพยาบาล' }
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
    ]
  };

  const calculatePremium = () => {
    if (!formData.gender || !formData.currentAge || !formData.coverageAge || !formData.plan) {
      toast({
        title: "ข้อมูลไม่ครบถ้วน",
        description: "กรุณากรอกข้อมูลให้ครบถ้วนก่อนคำนวณ",
        variant: "destructive",
      });
      return;
    }

    // Simple premium calculation (in real app, this would be more complex)
    const baseAmount = formData.plan === 'comprehensive' ? 18000 : 
                      formData.plan === 'critical-illness' ? 15000 :
                      formData.plan === 'accident' ? 8000 : 10000;
    
    const ageMultiplier = parseInt(formData.currentAge) > 40 ? 1.3 : 1.0;
    const genderMultiplier = formData.gender === 'male' ? 1.1 : 1.0;
    
    const annualPremium = Math.round(baseAmount * ageMultiplier * genderMultiplier);
    
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
      plan: '',
      packages: []
    });
    setShowResult(false);
    setCalculatedPremium(null);
    
    toast({
      title: "รีเซ็ตฟอร์มเรียบร้อย",
      description: "สามารถกรอกข้อมูลใหม่ได้",
    });
  };

  const selectedPlanPackages = formData.plan ? availablePackages[formData.plan as keyof typeof availablePackages] || [] : [];

  return (
    <section id="calculator" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-brand-green mb-4">
            เครื่องคำนวณเบี้ยประกัน
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            คำนวณเบี้ยประกันที่เหมาะสมกับคุณ ง่ายๆ ในไม่กี่ขั้นตอน
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg border-0">
            <CardHeader className="brand-green text-white">
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-6 h-6" />
                กรอกข้อมูลเพื่อคำนวณเบี้ยประกัน
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-brand-green border-b pb-2">
                    ข้อมูลส่วนตัว
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gender">เพศ *</Label>
                    <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกเพศ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">ชาย</SelectItem>
                        <SelectItem value="female">หญิง</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentAge">อายุปัจจุบัน *</Label>
                    <Select value={formData.currentAge} onValueChange={(value) => setFormData({...formData, currentAge: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกอายุ" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({length: 45}, (_, i) => i + 20).map((age) => (
                          <SelectItem key={age} value={age.toString()}>{age} ปี</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="coverageAge">ความคุ้มครองจนถึงอายุ *</Label>
                    <Select value={formData.coverageAge} onValueChange={(value) => setFormData({...formData, coverageAge: value})}>
                      <SelectTrigger>
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
                    <Label htmlFor="paymentFrequency">ความถี่ในการจ่าย</Label>
                    <Select value={formData.paymentFrequency} onValueChange={(value) => setFormData({...formData, paymentFrequency: value})}>
                      <SelectTrigger>
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

                {/* Insurance Plan */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-brand-green border-b pb-2">
                    แผนประกัน
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="plan">เลือกแผนประกัน *</Label>
                    <Select value={formData.plan} onValueChange={(value) => setFormData({...formData, plan: value, packages: []})}>
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกแผนประกัน" />
                      </SelectTrigger>
                      <SelectContent>
                        {insurancePlans.map((plan) => (
                          <SelectItem key={plan.id} value={plan.id}>
                            <div>
                              <div className="font-medium">{plan.name}</div>
                              <div className="text-sm text-gray-500">{plan.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.plan && selectedPlanPackages.length > 0 && (
                    <div className="space-y-3">
                      <Label>แพ็กเกจเสริม (เลือกได้หลายรายการ)</Label>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {selectedPlanPackages.map((pkg) => (
                          <div key={pkg.id} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                            <input
                              type="checkbox"
                              id={pkg.id}
                              className="w-4 h-4 text-brand-green"
                              checked={formData.packages.includes(pkg.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData({...formData, packages: [...formData.packages, pkg.id]});
                                } else {
                                  setFormData({...formData, packages: formData.packages.filter(p => p !== pkg.id)});
                                }
                              }}
                            />
                            <label htmlFor={pkg.id} className="flex-1 cursor-pointer">
                              <div className="font-medium">{pkg.name}</div>
                              <div className="text-sm text-gray-600">
                                ความคุ้มครอง: {pkg.coverage.toLocaleString()} บาท
                              </div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t">
                <Button 
                  onClick={calculatePremium}
                  className="brand-green text-white hover:opacity-90 flex-1"
                  size="lg"
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  คำนวณเบี้ยประกัน
                </Button>
                
                <Button 
                  onClick={resetForm}
                  variant="outline"
                  className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white flex-1 sm:flex-initial"
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
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default InsuranceCalculator;
