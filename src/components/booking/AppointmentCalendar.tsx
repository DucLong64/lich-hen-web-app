
import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ServiceType } from '@/types/ServiceType';
import { EmployeeType } from '@/types/EmployeeType';
import NoServiceSelected from './NoServiceSelected';
import TimeSelector from './TimeSelector';
import { isTimeSlotBooked, submitAppointment } from '@/utils/appointmentUtils';

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
    return <NoServiceSelected />;
  }

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
          const success = await submitAppointment(
            date, 
            timeString, 
            selectedService, 
            selectedEmployee, 
            notes
          );
          
          if (success) {
            onAppointmentConfirm(date, timeString);
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

  const isCustomTimeBooked = () => 
    isTimeSlotBooked(date, customHour, customMinute);

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
            {date ? (
              <TimeSelector
                customHour={customHour}
                customMinute={customMinute}
                onTimeChange={handleCustomTimeChange}
                isTimeBooked={isCustomTimeBooked()}
              />
            ) : (
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
