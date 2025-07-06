import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, User, Calendar, DollarSign, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import QuoteResult from './QuoteResult';
import TwoStepSelectiveForm from './TwoStepSelectiveForm';

const InsuranceCalculator = () => {
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    occupation: '',
    income: '',
    paymentFrequency: 'annual'
  });
  
  const [showResults, setShowResults] = useState(false);
  const [showSelectiveForm, setShowSelectiveForm] = useState(false);
  const [quote, setQuote] = useState(null);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateQuote = () => {
    if (!formData.age || !formData.gender || !formData.occupation || !formData.income) {
      toast({
        title: "ข้อมูลไม่ครบถ้วน",
        description: "กรุณากรอกข้อมูลให้ครบทุกช่อง",
        variant: "destructive",
      });
      return;
    }

    const age = parseInt(formData.age);
    const income = parseInt(formData.income);
    
    if (age < 1 || age > 80) {
      toast({
        title: "อายุไม่ถูกต้อง",
        description: "กรุณากรอกอายุระหว่าง 1-80 ปี",
        variant: "destructive",
      });
      return;
    }

    if (income < 10000) {
      toast({
        title: "รายได้ไม่ถูกต้อง",
        description: "กรุณากรอกรายได้ขั้นต่ำ 10,000 บาท",
        variant: "destructive",
      });
      return;
    }

    // Calculate base premium based on age and income
    const basePremium = Math.round(income * 0.05 * (age > 40 ? 1.5 : 1.2));
    const ageFactor = age < 30 ? 0.8 : age < 50 ? 1.0 : 1.3;
    const genderFactor = formData.gender === 'male' ? 1.1 : 1.0;
    
    const calculatedQuote = {
      ...formData,
      basePremium,
      recommendedCoverage: income * 12 * 5, // 5 years of income
      monthlyPremium: Math.round(basePremium * ageFactor * genderFactor),
      annualPremium: Math.round(basePremium * ageFactor * genderFactor * 11), // 11 months discount
    };

    setQuote(calculatedQuote);
    setShowResults(true);
    
    toast({
      title: "คำนวณสำเร็จ",
      description: "ได้ผลการคำนวณเบี้ยประกันแล้ว",
    });
  };

  const resetForm = () => {
    setFormData({
      age: '',
      gender: '',
      occupation: '',
      income: '',
      paymentFrequency: 'annual'
    });
    setShowResults(false);
    setShowSelectiveForm(false);
    setQuote(null);
  };

  const handleSelectiveForm = () => {
    if (!formData.age || !formData.gender) {
      toast({
        title: "ข้อมูลไม่ครบถ้วน",
        description: "กรุณากรอกอายุและเพศก่อนเลือกแพ็กเกจ",
        variant: "destructive",
      });
      return;
    }
    setShowSelectiveForm(true);
  };

  const handleFinalSelection = (packages: any[]) => {
    console.log('Final selected packages:', packages);
    toast({
      title: "บันทึกสำเร็จ",
      description: `เลือกแพ็กเกจและแผนเรียบร้อยแล้ว ${packages.length} แพ็กเกจ`,
    });
  };

  if (showSelectiveForm) {
    return (
      <div className="container mx-auto px-4 py-12">
        <TwoStepSelectiveForm
          userAge={parseInt(formData.age) || 25}
          userGender={formData.gender}
          onFinalSelection={handleFinalSelection}
        />
        <div className="mt-6 text-center">
          <Button
            onClick={() => setShowSelectiveForm(false)}
            variant="outline"
            className="border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white"
          >
            กลับไปหน้าคำนวณ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-white to-brand-green/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-brand-green mb-4">
            คำนวณเบี้ยประกันภัย
          </h2>
          <p className="text-xl text-brand-gold max-w-2xl mx-auto">
            คำนวณเบี้ยประกันที่เหมาะสมกับตรอนตัวคุณ ง่าย ๆ ใน 3 ขั้นตอน
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl border border-brand-green/20">
            <CardHeader className="bg-gradient-to-r from-brand-green to-brand-green/80 text-white">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Calculator className="w-6 h-6" />
                กรอกข้อมูลส่วนตัว
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="age" className="flex items-center gap-2 text-brand-green font-medium">
                    <Calendar className="w-4 h-4" />
                    อายุ (ปี)
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="ระบุอายุ"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    className="border-brand-green/30 focus:border-brand-green"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender" className="flex items-center gap-2 text-brand-green font-medium">
                    <User className="w-4 h-4" />
                    เพศ
                  </Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                    <SelectTrigger className="border-brand-green/30 focus:border-brand-green">
                      <SelectValue placeholder="เลือกเพศ" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-brand-green/20 shadow-lg z-50">
                      <SelectItem value="male">ชาย</SelectItem>
                      <SelectItem value="female">หญิง</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="occupation" className="flex items-center gap-2 text-brand-green font-medium">
                  <User className="w-4 h-4" />
                  อาชีพ
                </Label>
                <Select value={formData.occupation} onValueChange={(value) => handleInputChange('occupation', value)}>
                  <SelectTrigger className="border-brand-green/30 focus:border-brand-green">
                    <SelectValue placeholder="เลือกอาชีพ" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-brand-green/20 shadow-lg z-50">
                    <SelectItem value="employee">พนักงานบริษัท</SelectItem>
                    <SelectItem value="government">ข้าราชการ</SelectItem>
                    <SelectItem value="business">ประกอบธุรกิจส่วนตัว</SelectItem>
                    <SelectItem value="freelance">อาชีพอิสระ</SelectItem>
                    <SelectItem value="student">นักเรียน/นักศึกษา</SelectItem>
                    <SelectItem value="other">อื่น ๆ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="income" className="flex items-center gap-2 text-brand-green font-medium">
                  <DollarSign className="w-4 h-4" />
                  รายได้ต่อเดือน (บาท)
                </Label>
                <Input
                  id="income"
                  type="number"
                  placeholder="ระบุรายได้ต่อเดือน"
                  value={formData.income}
                  onChange={(e) => handleInputChange('income', e.target.value)}
                  className="border-brand-green/30 focus:border-brand-green"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentFrequency" className="flex items-center gap-2 text-brand-green font-medium">
                  <Calendar className="w-4 h-4" />
                  ความถี่ในการจ่าย
                </Label>
                <Select value={formData.paymentFrequency} onValueChange={(value) => handleInputChange('paymentFrequency', value)}>
                  <SelectTrigger className="border-brand-green/30 focus:border-brand-green">
                    <SelectValue placeholder="เลือกความถี่ในการจ่าย" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-brand-green/20 shadow-lg z-50">
                    <SelectItem value="annual">รายปี</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button 
                  onClick={calculateQuote}
                  className="flex-1 bg-brand-green hover:bg-brand-green/90 text-white font-medium py-3 text-lg shadow-lg"
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  คำนวณเบี้ยประกัน
                </Button>
                
                <Button 
                  onClick={handleSelectiveForm}
                  className="flex-1 bg-brand-gold hover:bg-brand-gold/90 text-white font-medium py-3 text-lg shadow-lg"
                >
                  <Package className="w-5 h-5 mr-2" />
                  เลือกแพ็กเกจ
                </Button>
              </div>

              {(showResults || quote) && (
                <div className="pt-6">
                  <Button 
                    onClick={resetForm}
                    variant="outline"
                    className="w-full border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white"
                  >
                    รีเซ็ตข้อมูล
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {showResults && quote && (
            <div className="mt-8">
              <QuoteResult 
                formData={{
                  gender: quote.gender,
                  currentAge: quote.age,
                  coverageAge: "80", // Default coverage age
                  paymentFrequency: quote.paymentFrequency,
                  plans: [],
                  packages: []
                }}
                premium={{
                  monthly: quote.monthlyPremium,
                  quarterly: Math.round(quote.monthlyPremium * 3 * 0.98), // Small discount
                  semiAnnual: Math.round(quote.monthlyPremium * 6 * 0.96), // More discount
                  annual: quote.annualPremium
                }}
                selectedPackages={[]}
                selectedPlans={[{
                  id: "basic",
                  name: "แผนพื้นฐาน",
                  description: "ความคุ้มครองพื้นฐานสำหรับการประกันชีวิต",
                  basePremium: quote.annualPremium
                }]}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default InsuranceCalculator;
