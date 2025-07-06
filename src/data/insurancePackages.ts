
// Insurance package data with plans and pricing
export interface InsurancePlan {
  id: string;
  name: string;
  coverage: string;
  monthlyPremium: {
    male: { [age: string]: number };
    female: { [age: string]: number };
  };
  description: string;
}

export interface InsurancePackage {
  id: string;
  name: string;
  category: string;
  description: string;
  plans: InsurancePlan[];
  minAge: number;
  maxAge: number;
  allowedGenders: ('male' | 'female')[];
}

export const insurancePackages: InsurancePackage[] = [
  {
    id: 'health-happy-kids',
    name: 'AIA Health Happy Kids',
    category: 'สุขภาพเด็ก',
    description: 'ประกันสุขภาพสำหรับเด็ก อายุ 0-17 ปี',
    minAge: 0,
    maxAge: 17,
    allowedGenders: ['male', 'female'],
    plans: [
      {
        id: 'hhk-basic',
        name: 'แผนพื้นฐาน',
        coverage: '500,000',
        monthlyPremium: {
          male: { '0-10': 800, '11-17': 900 },
          female: { '0-10': 750, '11-17': 850 }
        },
        description: 'ความคุ้มครองพื้นฐาน 500,000 บาท'
      },
      {
        id: 'hhk-premium',
        name: 'แผนพรีเมียม',
        coverage: '1,000,000',
        monthlyPremium: {
          male: { '0-10': 1200, '11-17': 1350 },
          female: { '0-10': 1150, '11-17': 1300 }
        },
        description: 'ความคุ้มครองพรีเมียม 1,000,000 บาท'
      }
    ]
  },
  {
    id: 'health-saver',
    name: 'AIA Health Saver',
    category: 'สุขภาพผู้ใหญ่',
    description: 'ประกันสุขภาพผู้ใหญ่ อายุ 18-70 ปี',
    minAge: 18,
    maxAge: 70,
    allowedGenders: ['male', 'female'],
    plans: [
      {
        id: 'hs-standard',
        name: 'แผนมาตรฐาน',
        coverage: '1,000,000',
        monthlyPremium: {
          male: { '18-30': 1500, '31-50': 2200, '51-70': 3500 },
          female: { '18-30': 1350, '31-50': 2000, '51-70': 3200 }
        },
        description: 'ความคุ้มครองมาตรฐาน 1,000,000 บาท'
      },
      {
        id: 'hs-premium',
        name: 'แผนพรีเมียม',
        coverage: '2,000,000',
        monthlyPremium: {
          male: { '18-30': 2500, '31-50': 3500, '51-70': 5000 },
          female: { '18-30': 2300, '31-50': 3200, '51-70': 4500 }
        },
        description: 'ความคุ้มครองพรีเมียม 2,000,000 บาท'
      }
    ]
  },
  {
    id: 'lady-care',
    name: 'Lady Care & Lady Care Plus',
    category: 'สุขภาพผู้หญิง',
    description: 'ประกันสำหรับผู้หญิงเท่านั้น อายุ 18-65 ปี',
    minAge: 18,
    maxAge: 65,
    allowedGenders: ['female'],
    plans: [
      {
        id: 'lc-basic',
        name: 'Lady Care',
        coverage: '800,000',
        monthlyPremium: {
          male: {},
          female: { '18-30': 1200, '31-50': 1800, '51-65': 2800 }
        },
        description: 'ความคุ้มครองพิเศษสำหรับผู้หญิง 800,000 บาท'
      },
      {
        id: 'lc-plus',
        name: 'Lady Care Plus',
        coverage: '1,500,000',
        monthlyPremium: {
          male: {},
          female: { '18-30': 2000, '31-50': 2800, '51-65': 4200 }
        },
        description: 'ความคุ้มครองพิเศษสำหรับผู้หญิง 1,500,000 บาท'
      }
    ]
  },
  {
    id: 'health-cancer',
    name: 'AIA Health Cancer',
    category: 'โรคมะเร็ง',
    description: 'ประกันโรคมะเร็ง อายุ 18-70 ปี',
    minAge: 18,
    maxAge: 70,
    allowedGenders: ['male', 'female'],
    plans: [
      {
        id: 'hc-basic',
        name: 'แผนพื้นฐาน',
        coverage: '1,000,000',
        monthlyPremium: {
          male: { '18-30': 800, '31-50': 1500, '51-70': 2800 },
          female: { '18-30': 900, '31-50': 1700, '51-70': 3200 }
        },
        description: 'ความคุ้มครองโรคมะเร็ง 1,000,000 บาท'
      },
      {
        id: 'hc-premium',
        name: 'แผนพรีเมียม',
        coverage: '2,000,000',
        monthlyPremium: {
          male: { '18-30': 1400, '31-50': 2500, '51-70': 4500 },
          female: { '18-30': 1600, '31-50': 2800, '51-70': 5000 }
        },
        description: 'ความคุ้มครองโรคมะเร็ง 2,000,000 บาท'
      }
    ]
  },
  {
    id: 'accident-coverage',
    name: 'Accident Coverage',
    category: 'อุบัติเหตุ',
    description: 'ประกันอุบัติเหตุ อายุ 1-75 ปี',
    minAge: 1,
    maxAge: 75,
    allowedGenders: ['male', 'female'],
    plans: [
      {
        id: 'ac-basic',
        name: 'แผนพื้นฐาน',
        coverage: '500,000',
        monthlyPremium: {
          male: { '1-30': 300, '31-60': 450, '61-75': 600 },
          female: { '1-30': 280, '31-60': 420, '61-75': 550 }
        },
        description: 'ความคุ้มครองอุบัติเหตุ 500,000 บาท'
      },
      {
        id: 'ac-premium',
        name: 'แผนพรีเมียม',
        coverage: '1,000,000',
        monthlyPremium: {
          male: { '1-30': 500, '31-60': 750, '61-75': 1000 },
          female: { '1-30': 470, '31-60': 700, '61-75': 950 }
        },
        description: 'ความคุ้มครองอุบัติเหตุ 1,000,000 บาท'
      }
    ]
  }
];
