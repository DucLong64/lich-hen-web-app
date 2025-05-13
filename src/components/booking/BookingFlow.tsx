
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft } from "lucide-react";
import ServiceSelector from "@/components/booking/ServiceSelector";
import EmployeeSelector from "@/components/booking/EmployeeSelector";
import AppointmentCalendar from "@/components/booking/AppointmentCalendar";
import { ServiceType } from '@/types/ServiceType';
import { EmployeeType } from '@/types/EmployeeType';

interface BookingFlowProps {
  updateAppointmentId?: string | null;
}

const BookingFlow: React.FC<BookingFlowProps> = ({ updateAppointmentId }) => {
  const { toast } = useToast();
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeType | null>(null);
  const [appointmentConfirmed, setAppointmentConfirmed] = useState(false);
  const [bookingStep, setBookingStep] = useState<'service' | 'employee' | 'time'>('service');

  const handleServiceSelect = (service: ServiceType) => {
    setSelectedService(service);
    setSelectedEmployee(null);
    setAppointmentConfirmed(false);
    setBookingStep('employee');
    toast({
      title: "Dịch vụ đã chọn",
      description: `Bạn đã chọn dịch vụ: ${service.name}`,
    });
  };

  const handleEmployeeSelect = (employee: EmployeeType | null) => {
    setSelectedEmployee(employee);
    setBookingStep('time');
    if (employee) {
      toast({
        title: "Nhân viên đã chọn",
        description: `Bạn đã chọn nhân viên: ${employee.name}`,
      });
    } else {
      toast({
        title: "Tiếp tục đặt lịch",
        description: "Bạn đã bỏ qua bước chọn nhân viên",
      });
    }
  };

  const handleSkipEmployeeSelection = () => {
    setSelectedEmployee(null);
    setBookingStep('time');
    toast({
      title: "Tiếp tục đặt lịch",
      description: "Bạn đã bỏ qua bước chọn nhân viên",
    });
  };

  const handleAppointmentConfirm = (date: Date, time: string) => {
    setAppointmentConfirmed(true);
    toast({
      title: "Đặt lịch thành công",
      description: selectedEmployee 
        ? `Lịch hẹn của bạn với ${selectedEmployee.name} đã được xác nhận vào lúc ${time} ngày ${date.toLocaleDateString()}`
        : `Lịch hẹn của bạn đã được xác nhận vào lúc ${time} ngày ${date.toLocaleDateString()}`,
    });
  };

  const handleReset = () => {
    setSelectedService(null);
    setSelectedEmployee(null);
    setAppointmentConfirmed(false);
    setBookingStep('service');
  };

  const handleBack = () => {
    if (bookingStep === 'employee') {
      setBookingStep('service');
    } else if (bookingStep === 'time') {
      setBookingStep('employee');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Quy trình đặt lịch</h2>
        
        <div className="flex items-center mb-6">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${bookingStep === 'service' ? 'bg-primary text-white' : 'bg-gray-200'}`}>1</div>
          <div className="h-1 w-10 bg-gray-200 mx-1"></div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${bookingStep === 'employee' ? 'bg-primary text-white' : 'bg-gray-200'}`}>2</div>
          <div className="h-1 w-10 bg-gray-200 mx-1"></div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${bookingStep === 'time' ? 'bg-primary text-white' : 'bg-gray-200'}`}>3</div>
          <div className="ml-3 text-sm text-muted-foreground">
            {bookingStep === 'service' && 'Chọn dịch vụ'}
            {bookingStep === 'employee' && 'Chọn nhân viên (tùy chọn)'}
            {bookingStep === 'time' && 'Chọn thời gian'}
          </div>
        </div>
        
        {bookingStep !== 'service' && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleBack} 
            className="mb-4 flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Quay lại
          </Button>
        )}
        
        {bookingStep === 'service' && (
          <ServiceSelector onServiceSelect={handleServiceSelect} />
        )}
        
        {bookingStep === 'employee' && (
          <>
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <h3 className="font-medium">Dịch vụ đã chọn: {selectedService?.name}</h3>
              <p className="text-sm text-muted-foreground">{selectedService?.description}</p>
              <div className="mt-2 flex justify-between text-sm">
                <span>Thời gian: {selectedService?.duration}</span>
                <span className="font-medium">{selectedService?.price}</span>
              </div>
            </div>
            <div className="mb-4">
              <Button 
                variant="secondary" 
                onClick={handleSkipEmployeeSelection}
                className="w-full"
              >
                Bỏ qua chọn nhân viên
              </Button>
            </div>
            <EmployeeSelector 
              selectedService={selectedService} 
              onEmployeeSelect={handleEmployeeSelect} 
            />
          </>
        )}
        
        {bookingStep === 'time' && (
          <>
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <h3 className="font-medium">Thông tin đã chọn</h3>
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Dịch vụ:</p>
                  <p>{selectedService?.name}</p>
                </div>
                {selectedEmployee && (
                  <div>
                    <p className="text-muted-foreground">Nhân viên:</p>
                    <p>{selectedEmployee.name}</p>
                  </div>
                )}
              </div>
            </div>
            <AppointmentCalendar 
              selectedService={selectedService}
              selectedEmployee={selectedEmployee}
              onAppointmentConfirm={handleAppointmentConfirm}
            />
          </>
        )}
        
        {appointmentConfirmed && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <h3 className="text-lg font-medium text-green-800">Đặt lịch thành công!</h3>
            <p className="mt-2 text-green-700">
              Thông tin xác nhận đã được gửi đến email của bạn. Cảm ơn bạn đã đặt lịch.
            </p>
            <div className="mt-4">
              <Button onClick={handleReset}>
                Đặt lịch mới
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <div className={bookingStep !== 'service' ? 'hidden md:block' : ''}>
        {bookingStep === 'service' && (
          <div className="bg-gray-100 rounded-lg p-6 h-full">
            <h2 className="text-2xl font-semibold mb-4">Hướng dẫn đặt lịch</h2>
            <ol className="space-y-4 list-decimal list-inside">
              <li className="p-3 bg-white rounded-md shadow-sm">
                <span className="font-medium">Bước 1:</span> Chọn dịch vụ bạn muốn đặt lịch
              </li>
              <li className="p-3 bg-white rounded-md shadow-sm">
                <span className="font-medium">Bước 2:</span> Chọn nhân viên phù hợp với nhu cầu (tùy chọn)
              </li>
              <li className="p-3 bg-white rounded-md shadow-sm">
                <span className="font-medium">Bước 3:</span> Chọn ngày và giờ phù hợp với lịch trình của bạn
              </li>
              <li className="p-3 bg-white rounded-md shadow-sm">
                <span className="font-medium">Bước 4:</span> Xác nhận thông tin và hoàn tất đặt lịch
              </li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingFlow;
