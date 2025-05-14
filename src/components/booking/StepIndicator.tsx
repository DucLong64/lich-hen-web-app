
import React from 'react';

interface StepIndicatorProps {
  currentStep: 'service' | 'time' | 'employee' | 'confirm';
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 gap-2 sm:gap-4">
      <div className="flex items-center">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep === 'service' ? 'bg-primary text-white' : 'bg-gray-200'}`}>1</div>
        <div className="ml-2 text-sm">
          {currentStep === 'service' ? <span className="font-medium">Chọn dịch vụ</span> : "Chọn dịch vụ"}
        </div>
      </div>
      
      <div className="hidden sm:block h-1 w-5 bg-gray-200"></div>
      
      <div className="flex items-center">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep === 'time' ? 'bg-primary text-white' : 'bg-gray-200'}`}>2</div>
        <div className="ml-2 text-sm">
          {currentStep === 'time' ? <span className="font-medium">Chọn thời gian</span> : "Chọn thời gian"}
        </div>
      </div>
      
      <div className="hidden sm:block h-1 w-5 bg-gray-200"></div>
      
      <div className="flex items-center">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep === 'employee' ? 'bg-primary text-white' : 'bg-gray-200'}`}>3</div>
        <div className="ml-2 text-sm">
          {currentStep === 'employee' ? <span className="font-medium">Chọn nhân viên</span> : "Chọn nhân viên"}
        </div>
      </div>

      <div className="hidden sm:block h-1 w-5 bg-gray-200"></div>
      
      <div className="flex items-center">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep === 'confirm' ? 'bg-primary text-white' : 'bg-gray-200'}`}>4</div>
        <div className="ml-2 text-sm">
          {currentStep === 'confirm' ? <span className="font-medium">Xác nhận</span> : "Xác nhận"}
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;
