
import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { CalendarPlus, Clock } from 'lucide-react';
import { EmployeeType } from './EmployeeSelector';

interface ServiceType {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: string;
  category: string;
}

// Simulate already booked slots
const bookedSlots: Record<string, string[]> = {
  '2025-05-16': ['09:00', '14:00'],
  '2025-05-17': ['08:00', '11:00', '13:00'],
  '2025-05-18': ['10:00', '15:00'],
};

export const AppointmentCalendar: React.FC<{
  selectedService: ServiceType | null;
  selectedEmployee: EmployeeType | null;
  onAppointmentConfirm: (date: Date, time: string) => void;
}> = ({ selectedService, selectedEmployee, onAppointmentConfirm }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');

  if (!selectedService || !selectedEmployee) {
    return (
      <div className="text-center p-8">
        <CalendarPlus className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">Vui lòng chọn dịch vụ và nhân viên</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Bạn cần chọn dịch vụ và nhân viên để xem lịch hẹn có sẵn.
        </p>
      </div>
    );
  }

  const formattedDate = date ? format(date, 'yyyy-MM-dd') : '';
  const unavailableTimes = bookedSlots[formattedDate] || [];
  
  // Use the employee's availability instead of fixed time slots
  const timeSlots = selectedEmployee.availability;
  
  const availableTimeSlots = timeSlots.filter(time => !unavailableTimes.includes(time));

  const handleConfirm = () => {
    if (date && selectedTime) {
      const [hours, minutes] = selectedTime.split(':');
      const appointmentDate = new Date(date);
      appointmentDate.setHours(parseInt(hours, 10));
      appointmentDate.setMinutes(parseInt(minutes, 10));
      
      onAppointmentConfirm(appointmentDate, selectedTime);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Chọn ngày và giờ</CardTitle>
          <CardDescription>
            Đặt lịch cho dịch vụ: {selectedService.name} với {selectedEmployee.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="mb-2 text-sm font-medium">Chọn ngày:</h3>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={{ before: new Date() }}
              className="rounded-md border pointer-events-auto"
            />
          </div>
          
          <div>
            <h3 className="mb-2 text-sm font-medium">Chọn giờ:</h3>
            {date ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {availableTimeSlots.length > 0 ? (
                  availableTimeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      size="sm"
                      className="flex items-center justify-center"
                      onClick={() => setSelectedTime(time)}
                    >
                      <Clock className="mr-1 h-3 w-3" />
                      {time}
                    </Button>
                  ))
                ) : (
                  <div className="col-span-full text-center text-muted-foreground p-2">
                    Nhân viên không có lịch trống trong ngày này
                  </div>
                )}
              </div>
            ) : (
              <div className="text-muted-foreground text-sm">
                Vui lòng chọn ngày trước
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleConfirm} 
            className="w-full"
            disabled={!date || !selectedTime}
          >
            Xác nhận lịch hẹn
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AppointmentCalendar;
