
import React, { useState } from 'react';
import PackageSelector from './PackageSelector';
import PlanSelector from './PlanSelector';

interface SelectedPackage {
  packageName: string;
  selectedPlans: {
    planId: string;
    planName: string;
    coverage: string;
    units: number;
    monthlyPremium: number;
    annualPremium: number;
  }[];
}

interface TwoStepSelectiveFormProps {
  userAge?: number;
  userGender?: string;
  onFinalSelection?: (packages: SelectedPackage[]) => void;
}

const TwoStepSelectiveForm: React.FC<TwoStepSelectiveFormProps> = ({
  userAge = 25,
  userGender = 'male',
  onFinalSelection
}) => {
  const [currentStep, setCurrentStep] = useState<'packages' | 'plans'>('packages');
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);

  const handlePackagesSelected = (packages: string[]) => {
    setSelectedPackages(packages);
    setCurrentStep('plans');
  };

  const handleBackToPackages = () => {
    setCurrentStep('packages');
  };

  const handlePlansSelected = (packages: SelectedPackage[]) => {
    if (onFinalSelection) {
      onFinalSelection(packages);
    }
  };

  return (
    <div>
      {currentStep === 'packages' && (
        <PackageSelector
          userAge={userAge}
          userGender={userGender}
          onPackagesSelected={handlePackagesSelected}
        />
      )}
      
      {currentStep === 'plans' && (
        <PlanSelector
          selectedPackages={selectedPackages}
          userAge={userAge}
          userGender={userGender}
          onBack={handleBackToPackages}
          onPlansSelected={handlePlansSelected}
        />
      )}
    </div>
  );
};

export default TwoStepSelectiveForm;
