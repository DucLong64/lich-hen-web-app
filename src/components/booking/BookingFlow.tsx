
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft } from "lucide-react";
import ServiceSelector from "@/components/booking/ServiceSelector";
import EmployeeSelector from "@/components/booking/EmployeeSelector";
import AppointmentCalendar from "@/components/booking/AppointmentCalendar";
import StepIndicator from "@/components/booking/StepIndicator";
import BookingGuide from "@/components/booking/BookingGuide";
import ServiceSummary from "@/components/booking/ServiceSummary";
import BookingConfirmation from "@/components/booking/BookingConfirmation";
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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        
        <StepIndicator currentStep={bookingStep} />
        
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
            <ServiceSummary 
              selectedService={selectedService} 
              selectedEmployee={null} 
              step="employee" 
            />
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
            <ServiceSummary 
              selectedService={selectedService} 
              selectedEmployee={selectedEmployee} 
              step="time" 
            />
            <AppointmentCalendar 
              selectedService={selectedService}
              selectedEmployee={selectedEmployee}
              onAppointmentConfirm={handleAppointmentConfirm}
            />
          </>
        )}
        
        {appointmentConfirmed && (
          <BookingConfirmation onReset={handleReset} />
        )}
      </div>
      
      <div className={bookingStep !== 'service' ? 'hidden md:block' : ''}>
        {bookingStep === 'service' && <BookingGuide />}
      </div>
    </div>
  );
};

export default BookingFlow;
