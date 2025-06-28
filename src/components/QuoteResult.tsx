
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QuoteResultProps {
  formData: {
    gender: string;
    currentAge: string;
    coverageAge: string;
    paymentFrequency: string;
    plan: string;
    packages: string[];
  };
  premium: {
    monthly: number;
    quarterly: number;
    semiAnnual: number;
    annual: number;
  };
  selectedPackages: Array<{
    id: string;
    name: string;
    coverage: number;
    premium: number;
  }>;
}

const QuoteResult: React.FC<QuoteResultProps> = ({ formData, premium, selectedPackages }) => {
  const { toast } = useToast();

  const planNames = {
    'comprehensive': 'แผนครอบคลุม',
    'critical-illness': 'แผนโรคร้ายแรง',
    'accident': 'แผนอุบัติเหตุ',
    'health': 'แผนสุขภาพ'
  };

  const genderText = formData.gender === 'male' ? 'ชาย' : 'หญิง';
  const planName = planNames[formData.plan as keyof typeof planNames] || formData.plan;

  const generatePDF = () => {
    // In a real application, this would generate an actual PDF
    toast({
      title: "กำลังสร้าง PDF",
      description: "ใบเสนอราคาจะถูกดาวน์โหลดในไม่ช้า",
    });
    
    // Simulate PDF generation
    setTimeout(() => {
      toast({
        title: "ดาวน์โหลดสำเร็จ",
        description: "ใบเสนอราคาถูกบันทึกแล้ว",
      });
    }, 2000);
  };

  const shareQuote = () => {
    if (navigator.share) {
      navigator.share({
        title: 'ใบเสนอราคาประกันภัย',
        text: `เบี้ยประกัน ${planName} จำนวน ${premium.annual.toLocaleString()} บาทต่อปี`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "คัดลอกลิงก์แล้ว",
        description: "สามารถแชร์ลิงก์นี้ได้",
      });
    }
  };

  return (
    <Card className="mt-8 shadow-lg border-0">
      <CardHeader className="brand-gold text-brand-green">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-6 h-6" />
          ใบเสนอราคาเบี้ยประกัน
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        {/* Company Logo Area */}
        <div className="text-center mb-8 pb-6 border-b">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-16 h-16 brand-green rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">I</span>
            </div>
            <div className="text-left">
              <h3 className="text-2xl font-bold text-brand-green">ประกันภัยออนไลน์</h3>
              <p className="text-brand-gold">Insurance Calculator Co., Ltd.</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            วันที่ออกใบเสนอราคา: {new Date().toLocaleDateString('th-TH')}
          </p>
        </div>

        {/* Customer Information */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h4 className="font-semibold text-brand-green mb-4 border-b pb-2">
              ข้อมูลผู้เอาประกัน
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">เพศ:</span>
                <span className="font-medium">{genderText}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">อายุปัจจุบัน:</span>
                <span className="font-medium">{formData.currentAge} ปี</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ความคุ้มครองจนถึงอายุ:</span>
                <span className="font-medium">{formData.coverageAge} ปี</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-brand-green mb-4 border-b pb-2">
              แผนประกันที่เลือก
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">แผน:</span>
                <span className="font-medium">{planName}</span>
              </div>
              {selectedPackages.length > 0 && (
                <div>
                  <span className="text-gray-600">แพ็กเกจเสริม:</span>
                  <div className="mt-1 space-y-1">
                    {selectedPackages.map((pkg) => (
                      <div key={pkg.id} className="text-xs bg-gray-50 p-2 rounded">
                        <div className="font-medium">{pkg.name}</div>
                        <div className="text-gray-600">
                          ความคุ้มครอง: {pkg.coverage.toLocaleString()} บาท
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Premium Breakdown */}
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h4 className="font-semibold text-brand-green mb-4 text-center">
            เบี้ยประกันรวม
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-brand-green">
                ฿{premium.annual.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">ต่อปี</div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-brand-green">
                ฿{premium.semiAnnual.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">ต่อครึ่งปี</div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-brand-green">
                ฿{premium.quarterly.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">ต่อไตรมาส</div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-brand-green">
                ฿{premium.monthly.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">ต่อเดือน</div>
            </div>
          </div>

          <div className="text-center mt-4 p-4 brand-gold rounded-lg">
            <div className="text-lg font-semibold text-brand-green">
              เบี้ยประกันต่อวัน: ฿{Math.round(premium.annual / 365).toLocaleString()}
            </div>
            <div className="text-sm text-brand-green/80">
              (คำนวณจากเบี้ยประกันรายปี ÷ 365 วัน)
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={generatePDF}
            className="brand-green text-white hover:opacity-90 flex-1"
            size="lg"
          >
            <Download className="w-5 h-5 mr-2" />
            ดาวน์โหลด PDF
          </Button>
          
          <Button 
            onClick={shareQuote}
            variant="outline"
            className="border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white flex-1"
            size="lg"
          >
            แชร์ใบเสนอราคา
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t text-center text-xs text-gray-500">
          <p>
            ใบเสนอราคานี้มีผลใช้บังคับเป็นเวลา 30 วัน นับจากวันที่ออกใบเสนอราคา
          </p>
          <p>
            สอบถามข้อมูลเพิ่มเติม โทร. 02-xxx-xxxx หรือ info@insurance.co.th
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuoteResult;
