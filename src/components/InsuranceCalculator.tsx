
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Calculator, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import QuoteResult from './QuoteResult';
import TwoStepInsuranceSelector from './TwoStepInsuranceSelector';

interface CalculatorData {
  gender: string;
  currentAge: string;
  coverageAge: string;
  paymentFrequency: string;
  plans: string[];
  packages: string[];
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

const InsuranceCalculator = () => {
  const [formData, setFormData] = useState<CalculatorData>({
    gender: '',
    currentAge: '',
    coverageAge: '',
    paymentFrequency: 'annual',
    plans: [],
    packages: []
  });
  
  const [savedQuotes, setSavedQuotes] = useState<CartItem[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [calculatedPremium, setCalculatedPremium] = useState<{
    monthly: number;
    quarterly: number;
    semiAnnual: number;
    annual: number;
  } | null>(null);

  const { toast } = useToast();

  const handleQuoteSaved = (cartItems: CartItem[]) => {
    if (!formData.gender || !formData.currentAge || !formData.coverageAge) {
      toast({
        title: "ข้อมูลไม่ครบถ้วน",
        description: "กรุณากรอกข้อมูลส่วนตัวก่อนบันทึกใบเสนอราคา",
        variant: "destructive",
      });
      return;
    }

    setSavedQuotes(cartItems);
    
    // Calculate total premium
    const totalMonthlyPremium = cartItems.reduce((sum, item) => sum + item.totalMonthly, 0);
    const annualPremium = totalMonthlyPremium * 12;
    
    setCalculatedPremium({
      monthly: totalMonthlyPremium,
      quarterly: Math.round(annualPremium / 4 * 1.02),
      semiAnnual: Math.round(annualPremium / 2 * 1.01),
      annual: annualPremium
    });
    
    // Update formData
    setFormData({
      ...formData,
      packages: cartItems.map(item => item.packageName),
      plans: cartItems.map(item => item.planName)
    });
    
    setShowResult(true);
  };

  const resetForm = () => {
    setFormData({
      gender: '',
      currentAge: '',
      coverageAge: '',
      paymentFrequency: 'annual',
      plans: [],
      packages: []
    });
    setSavedQuotes([]);
    setShowResult(false);
    setCalculatedPremium(null);
    
    toast({
      title: "รีเซ็ตฟอร์มเรียบร้อย",
      description: "สามารถกรอกข้อมูลใหม่ได้",
    });
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

        <div className="max-w-4xl mx-auto space-y-6">
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

              {/* Package Selection */}
              {formData.gender && formData.currentAge && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-brand-green border-b pb-2">
                    เลือกแพ็กเกจและแผนประกันภัย
                  </h3>
                  <TwoStepInsuranceSelector
                    userAge={parseInt(formData.currentAge) || 25}
                    userGender={formData.gender as 'male' | 'female'}
                    onQuoteSaved={handleQuoteSaved}
                  />
                </div>
              )}

              {/* Reset Button */}
              <div className="pt-4 border-t">
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
          {showResult && calculatedPremium && savedQuotes.length > 0 && (
            <QuoteResult 
              formData={formData}
              premium={calculatedPremium}
              selectedPackages={savedQuotes.map(item => ({
                id: item.packageId,
                name: item.packageName,
                coverage: parseInt(item.coverage.replace(/,/g, '')),
                premium: item.totalMonthly
              }))}
              selectedPlans={[]}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default InsuranceCalculator;
