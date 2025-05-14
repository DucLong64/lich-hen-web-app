
import { useState } from 'react';
import { format, parse } from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { CalendarPlus, Clock } from 'lucide-react';
import { ServiceType } from '@/types/ServiceType';
import { EmployeeType } from '@/types/EmployeeType';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { createAppointment, AppointmentCreationRequest } from '@/api/apiService';
import { useToast } from '@/hooks/use-toast';

// Simulate already booked slots
const bookedSlots: Record<string, string[]> = {
  '2025-05-16': ['09:00', '14:00'],
  '2025-05-17': ['08:00', '11:00', '13:00'],
  '2025-05-18': ['10:00', '15:00'],
};

// Generate hours options
const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));

// Generate minutes options
const minutes = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));

export const AppointmentCalendar: React.FC<{
  selectedService: ServiceType | null;
  selectedEmployee: EmployeeType | null;
  onAppointmentConfirm: (date: Date, time: string) => void;
}> = ({ selectedService, selectedEmployee, onAppointmentConfirm }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [customHour, setCustomHour] = useState('09');
  const [customMinute, setCustomMinute] = useState('00');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  if (!selectedService) {
    return (
      <div className="text-center p-8">
        <CalendarPlus className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">Vui lòng chọn dịch vụ</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Bạn cần chọn dịch vụ để xem lịch hẹn có sẵn.
        </p>
      </div>
    );
  }

  const formattedDate = date ? format(date, 'yyyy-MM-dd') : '';
  const unavailableTimes = bookedSlots[formattedDate] || [];
  
  const handleCustomTimeChange = (hour: string, minute: string) => {
    setCustomHour(hour);
    setCustomMinute(minute);
  };

  const handleConfirm = async () => {
    if (date) {
      const timeString = `${customHour}:${customMinute}`;

      if (timeString) {
        setIsSubmitting(true);
        
        try {
          // Parse duration from string like "30 phút" to get the number
          const durationMatch = selectedService.duration.match(/\d+/);
          const duringTime = durationMatch ? parseInt(durationMatch[0], 10) : 30;
          
          // Create ISO datetime string for the API
          const [hours, minutes] = timeString.split(':');
          const appointmentDate = new Date(date);
          appointmentDate.setHours(parseInt(hours, 10));
          appointmentDate.setMinutes(parseInt(minutes, 10));
          
          // Format data for API request
          const appointmentData: AppointmentCreationRequest = {
            serviceId: parseInt(selectedService.id, 10),
            startTime: appointmentDate.toISOString(),
            duringTime: duringTime,
            employeeId: selectedEmployee ? parseInt(selectedEmployee.id, 10) : null,
            notes: notes.trim()
          };
          
          // Send data to API
          const success = await createAppointment(appointmentData);
          
          if (success) {
            onAppointmentConfirm(appointmentDate, timeString);
          } else {
            toast({
              title: "Đặt lịch thất bại",
              description: "Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại sau.",
              variant: "destructive"
            });
          }
        } catch (error) {
          console.error('Error submitting appointment:', error);
          toast({
            title: "Đặt lịch thất bại",
            description: "Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại sau.",
            variant: "destructive"
          });
        } finally {
          setIsSubmitting(false);
        }
      }
    }
  };

  const isCustomTimeBooked = () => {
    const customTimeString = `${customHour}:${customMinute}`;
    return unavailableTimes.includes(customTimeString);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Chọn ngày và giờ</CardTitle>
          <CardDescription>
            Đặt lịch cho dịch vụ: {selectedService.name}
            {selectedEmployee && ` với ${selectedEmployee.name}`}
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
            {date && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hour">Giờ</Label>
                    <Select 
                      value={customHour} 
                      onValueChange={value => handleCustomTimeChange(value, customMinute)}
                    >
                      <SelectTrigger id="hour">
                        <SelectValue placeholder="Chọn giờ" />
                      </SelectTrigger>
                      <SelectContent>
                        {hours.map(hour => (
                          <SelectItem key={hour} value={hour}>
                            {hour}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="minute">Phút</Label>
                    <Select 
                      value={customMinute} 
                      onValueChange={value => handleCustomTimeChange(customHour, value)}
                    >
                      <SelectTrigger id="minute">
                        <SelectValue placeholder="Chọn phút" />
                      </SelectTrigger>
                      <SelectContent>
                        {minutes.map(minute => (
                          <SelectItem key={minute} value={minute}>
                            {minute}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {isCustomTimeBooked() && (
                  <div className="text-red-500 text-sm">
                    Thời gian này đã được đặt. Vui lòng chọn thời gian khác.
                  </div>
                )}
              </div>
            )}

            {!date && (
              <div className="text-muted-foreground text-sm">
                Vui lòng chọn ngày trước
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Ghi chú</Label>
            <Input
              id="notes"
              placeholder="Nhập ghi chú về lịch hẹn (nếu có)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleConfirm} 
            className="w-full"
            disabled={
              !date || isCustomTimeBooked() || isSubmitting
            }
          >
            {isSubmitting ? "Đang xác nhận..." : "Xác nhận lịch hẹn"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AppointmentCalendar;
