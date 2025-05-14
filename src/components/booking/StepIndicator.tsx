
import React from 'react';

interface StepIndicatorProps {
  currentStep: 'service' | 'employee' | 'time';
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="flex items-center mb-6">
      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep === 'service' ? 'bg-primary text-white' : 'bg-gray-200'}`}>1</div>
      <div className="h-1 w-10 bg-gray-200 mx-1"></div>
      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep === 'employee' ? 'bg-primary text-white' : 'bg-gray-200'}`}>2</div>
      <div className="h-1 w-10 bg-gray-200 mx-1"></div>
      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep === 'time' ? 'bg-primary text-white' : 'bg-gray-200'}`}>3</div>
      <div className="ml-3 text-sm text-muted-foreground">
        {currentStep === 'service' && 'Chọn dịch vụ'}
        {currentStep === 'employee' && 'Chọn nhân viên (tùy chọn)'}
        {currentStep === 'time' && 'Chọn thời gian'}
      </div>
    </div>
  );
};

export default StepIndicator;
