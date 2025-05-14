
import React from 'react';
import { ServiceType } from '@/types/ServiceType';
import { EmployeeType } from '@/types/EmployeeType';

interface ServiceSummaryProps {
  selectedService: ServiceType | null;
  selectedEmployee: EmployeeType | null;
  step: 'employee' | 'time';
}

const ServiceSummary: React.FC<ServiceSummaryProps> = ({ 
  selectedService, 
  selectedEmployee, 
  step
}) => {
  if (!selectedService) return null;
  
  return (
    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
      {step === 'employee' ? (
        <>
          <h3 className="font-medium">Dịch vụ đã chọn: {selectedService.name}</h3>
          <p className="text-sm text-muted-foreground">{selectedService.description}</p>
          <div className="mt-2 flex justify-between text-sm">
            <span>Thời gian: {selectedService.duration}</span>
            <span className="font-medium">{selectedService.price}</span>
          </div>
        </>
      ) : (
        <>
          <h3 className="font-medium">Thông tin đã chọn</h3>
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">Dịch vụ:</p>
              <p>{selectedService.name}</p>
            </div>
            {selectedEmployee && (
              <div>
                <p className="text-muted-foreground">Nhân viên:</p>
                <p>{selectedEmployee.name}</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ServiceSummary;
