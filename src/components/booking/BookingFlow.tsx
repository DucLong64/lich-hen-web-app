import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft } from "lucide-react";
import ServiceSelector from "@/components/booking/ServiceSelector";
import EmployeeSelector from "@/components/booking/EmployeeSelector";
import TimeSlots from "@/components/booking/TimeSlots";
import StepIndicator from "@/components/booking/StepIndicator";
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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [appointmentConfirmed, setAppointmentConfirmed] = useState(false);
  const [bookingStep, setBookingStep] = useState<'service' | 'time' | 'employee' | 'confirm'>('service');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Danh sách nhân viên khả dụng lấy từ backend
  const [availableEmployees, setAvailableEmployees] = useState<EmployeeType[]>([]);

  // Khi bước chọn nhân viên active và có đủ dữ liệu, gọi API lấy nhân viên khả dụng
  useEffect(() => {
    if (bookingStep === 'employee' && selectedService && selectedDate && selectedTimeSlot) {
      const appointmentDate = new Date(selectedDate);
      const [hours, minutes] = selectedTimeSlot.split(':').map(Number);
      appointmentDate.setHours(hours, minutes, 0, 0);

      fetch(`http://localhost:9090/api/availability/${selectedService.id}?time=${appointmentDate.toISOString()}`)
        .then(response => {
          if (!response.ok) throw new Error('Không thể tải danh sách nhân viên');
          return response.json();
        })
        .then((data: { employeeId: number; name: string }[]) => {
          const mappedEmployees = data.map(emp => ({
            id: emp.employeeId.toString(),
            name: emp.name,
            position: '',
            avatar: '',
            specialties: [],
          }));
          setAvailableEmployees(mappedEmployees);
        })
        .catch(err => {
          console.error(err);
          setAvailableEmployees([]);
          toast({
            title: "Lỗi tải nhân viên",
            description: "Không thể tải danh sách nhân viên. Vui lòng thử lại sau.",
            variant: "destructive"
          });
        });
    } else {
      setAvailableEmployees([]);
    }
  }, [bookingStep, selectedService, selectedDate, selectedTimeSlot, toast]);

  const handleServiceSelect = (service: ServiceType) => {
    setSelectedService(service);
    setSelectedEmployee(null);
    setSelectedDate(null);
    setSelectedTimeSlot(null);
    setAppointmentConfirmed(false);
    setBookingStep('time');
    toast({
      title: "Dịch vụ đã chọn",
      description: `Bạn đã chọn dịch vụ: ${service.name}`,
    });
  };

  const handleTimeSelect = (date: Date, timeSlot: string) => {
    setSelectedDate(date);
    setSelectedTimeSlot(timeSlot);
    setBookingStep('employee');
    setSelectedEmployee(null);
    toast({
      title: "Thời gian đã chọn",
      description: `Bạn đã chọn lịch hẹn vào lúc ${timeSlot} ngày ${date.toLocaleDateString()}`,
    });
  };

  const handleEmployeeSelect = (employee: EmployeeType | null) => {
    setSelectedEmployee(employee);
    setBookingStep('confirm');
    if (employee) {
      toast({
        title: "Nhân viên đã chọn",
        description: `Bạn đã chọn nhân viên: ${employee.name}`,
      });
    } else {
      toast({
        title: "Tự động chọn nhân viên",
        description: "Hệ thống sẽ tự động chọn nhân viên phù hợp cho bạn",
      });
    }
  };

  // Người dùng không chọn nhân viên => random 1 nhân viên trong danh sách có sẵn
  const handleSkipEmployeeSelection = () => {
    if (availableEmployees.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableEmployees.length);
      setSelectedEmployee(availableEmployees[randomIndex]);
    } else {
      setSelectedEmployee(null);
    }
    setBookingStep('confirm');
    toast({
      title: "Tự động chọn nhân viên",
      description: "Hệ thống đã tự động chọn nhân viên phù hợp cho bạn",
    });
  };

  const handleAppointmentConfirm = () => {
    if (!selectedService || !selectedDate || !selectedTimeSlot) {
      return;
    }
    setIsSubmitting(true);

    const appointmentDate = new Date(selectedDate);
    const [hours, minutes] = selectedTimeSlot.split(':').map(Number);
    appointmentDate.setHours(hours, minutes, 0, 0);

    const appointmentData = {
      customerId: null,  // Nếu bạn có user đăng nhập, truyền vào ID thực tế
      serviceId: parseInt(selectedService.id, 10),
      serviceName: selectedService.name,
      employeeId: selectedEmployee ? parseInt(selectedEmployee.id, 10) : null,
      time: appointmentDate.toISOString(),
      notes: notes.trim(),
    };

    fetch('http://localhost:9090/api/appointment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointmentData),
    })
      .then(response => {
        if (response.status === 409) {
          throw new Error('Lịch hẹn bị trùng');
        }
        if (!response.ok) {
          throw new Error(`Lỗi ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then(() => {
        setAppointmentConfirmed(true);
        toast({
          title: "Đặt lịch thành công",
          description: selectedEmployee
            ? `Lịch hẹn của bạn với ${selectedEmployee.name} đã được xác nhận vào lúc ${selectedTimeSlot} ngày ${appointmentDate.toLocaleDateString()}`
            : `Lịch hẹn của bạn đã được xác nhận vào lúc ${selectedTimeSlot} ngày ${appointmentDate.toLocaleDateString()}`,
        });
      })
      .catch(error => {
        toast({
          title: "Đặt lịch thất bại",
          description: error.message || "Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại sau.",
          variant: "destructive"
        });
      })
      .finally(() => setIsSubmitting(false));
  };

  const handleReset = () => {
    setSelectedService(null);
    setSelectedEmployee(null);
    setSelectedDate(null);
    setSelectedTimeSlot(null);
    setNotes('');
    setAppointmentConfirmed(false);
    setBookingStep('service');
  };

  const handleBack = () => {
    if (bookingStep === 'time') setBookingStep('service');
    else if (bookingStep === 'employee') setBookingStep('time');
    else if (bookingStep === 'confirm') setBookingStep('employee');
  };

  const handleNotesChange = (value: string) => {
    setNotes(value);
  };

  return (
    <div className="max-w-3xl mx-auto">
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
        <div className="space-y-6">
          <ServiceSelector onServiceSelect={handleServiceSelect} />
        </div>
      )}

      {bookingStep === 'time' && (
        <div className="space-y-6">
          <ServiceSummary
            selectedService={selectedService}
            selectedEmployee={null}
            step="time"
          />
          <TimeSlots
            selectedService={selectedService}
            onTimeSelect={handleTimeSelect}
          />
        </div>
      )}

      {bookingStep === 'employee' && (
        <div className="space-y-6">
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
              Tự động chọn nhân viên
            </Button>
          </div>
          <EmployeeSelector
            employees={availableEmployees}
            onEmployeeSelect={handleEmployeeSelect}
          />
        </div>
      )}

      {bookingStep === 'confirm' && (
        <div className="space-y-6">
          <div className="bg-muted p-4 rounded-md">
            <h3 className="text-lg font-medium mb-3">Xác nhận thông tin đặt lịch</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Dịch vụ:</span> {selectedService?.name}</p>
              <p><span className="font-medium">Thời gian:</span> {selectedTimeSlot} - {selectedDate?.toLocaleDateString()}</p>
              <p><span className="font-medium">Nhân viên:</span> {selectedEmployee?.name || 'Hệ thống sẽ tự động chọn'}</p>
              <div className="mt-4">
                <label htmlFor="notes" className="block text-sm font-medium mb-1">Ghi chú:</label>
                <textarea
                  id="notes"
                  className="w-full p-2 border rounded-md"
                  value={notes}
                  onChange={(e) => handleNotesChange(e.target.value)}
                  placeholder="Nhập ghi chú về lịch hẹn (nếu có)"
                />
              </div>
            </div>
            <div className="mt-4">
              <Button
                onClick={handleAppointmentConfirm}
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang xác nhận..." : "Hoàn tất đặt lịch"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {appointmentConfirmed && (
        <BookingConfirmation onReset={handleReset} />
      )}
    </div>
  );
};

export default BookingFlow;
