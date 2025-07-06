
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, ShoppingCart as CartIcon } from 'lucide-react';
import { insurancePackages } from '@/data/insurancePackages';

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

interface ShoppingCartProps {
  cartItems: CartItem[];
  onRemoveItem: (packageId: string, planId: string) => void;
  onUpdateUnits: (packageId: string, planId: string, units: number) => void;
  onSaveQuote: () => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({
  cartItems,
  onRemoveItem,
  onUpdateUnits,
  onSaveQuote
}) => {
  const totalMonthlyPremium = cartItems.reduce((sum, item) => sum + item.totalMonthly, 0);
  const totalAnnualPremium = totalMonthlyPremium * 12;

  if (cartItems.length === 0) {
    return (
      <Card className="border-dashed border-2 border-gray-300">
        <CardContent className="text-center py-8">
          <CartIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">ตะกร้าของคุณว่างเปล่า</p>
          <p className="text-sm text-gray-400">เลือกแพ็กเกจและแผนความคุ้มครองเพื่อเพิ่มในตะกร้า</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-l-4 border-l-brand-green">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-brand-green">
          <CartIcon className="w-5 h-5" />
          ตะกร้าประกันภัย ({cartItems.length} รายการ)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {cartItems.map((item, index) => (
          <div
            key={`${item.packageId}-${item.planId}`}
            className="p-4 rounded-lg border border-gray-200 bg-white"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">{item.packageName}</h4>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">{item.planName}</Badge>
                  <Badge variant="secondary" className="text-xs">{item.coverage} บาท</Badge>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">จำนวน:</span>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={item.units}
                      onChange={(e) => {
                        const newUnits = parseInt(e.target.value) || 1;
                        onUpdateUnits(item.packageId, item.planId, newUnits);
                      }}
                      className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-600">หน่วย</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {item.monthlyPremium.toLocaleString()} บาท/เดือน × {item.units}
                    </p>
                    <p className="font-bold text-brand-green">
                      {item.totalMonthly.toLocaleString()} บาท/เดือน
                    </p>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveItem(item.packageId, item.planId)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}

        <div className="border-t pt-4">
          <div className="bg-green-50 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-900">รวมเบี้ยประกันรายเดือน:</span>
              <span className="font-bold text-xl text-brand-green">
                {totalMonthlyPremium.toLocaleString()} บาท
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">รวมเบี้ยประกันรายปี:</span>
              <span className="font-semibold text-brand-green">
                {totalAnnualPremium.toLocaleString()} บาท
              </span>
            </div>
          </div>

          <Button
            onClick={onSaveQuote}
            className="w-full bg-brand-green text-white hover:bg-brand-green/90 h-12 text-lg"
            size="lg"
          >
            <CartIcon className="w-5 h-5 mr-2" />
            บันทึกใส่ตะกร้า
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShoppingCart;
