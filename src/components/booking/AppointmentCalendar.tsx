
import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { CalendarPlus, Clock } from 'lucide-react';
import { ServiceType } from '@/types/ServiceType';
import { EmployeeType } from '@/types/EmployeeType';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Simulate already booked slots
const bookedSlots: Record<string, string[]> = {
  '2025-05-16': ['09:00', '14:00'],
  '2025-05-17': ['08:00', '11:00', '13:00'],
  '2025-05-18': ['10:00', '15:00'],
};

// Default available time slots when no employee is selected
const defaultTimeSlots = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

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
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [timeSelectionMode, setTimeSelectionMode] = useState<'preset' | 'custom'>('preset');
  const [customHour, setCustomHour] = useState('09');
  const [customMinute, setCustomMinute] = useState('00');

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
  
  // Use the employee's availability or default time slots
  const timeSlots = selectedEmployee ? selectedEmployee.availability : defaultTimeSlots;
  
  const availableTimeSlots = timeSlots.filter(time => !unavailableTimes.includes(time));

  const handleCustomTimeChange = (hour: string, minute: string) => {
    setCustomHour(hour);
    setCustomMinute(minute);
    setSelectedTime(`${hour}:${minute}`);
  };

  const handleConfirm = () => {
    if (date) {
      let timeString = selectedTime;
      if (timeSelectionMode === 'custom') {
        timeString = `${customHour}:${customMinute}`;
      }

      if (timeString) {
        const [hours, minutes] = timeString.split(':');
        const appointmentDate = new Date(date);
        appointmentDate.setHours(parseInt(hours, 10));
        appointmentDate.setMinutes(parseInt(minutes, 10));
        
        onAppointmentConfirm(appointmentDate, timeString);
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
              <Tabs value={timeSelectionMode} onValueChange={(v) => setTimeSelectionMode(v as 'preset' | 'custom')}>
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="preset">Giờ có sẵn</TabsTrigger>
                  <TabsTrigger value="custom">Tùy chọn</TabsTrigger>
                </TabsList>
                
                <TabsContent value="preset">
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {availableTimeSlots.length > 0 ? (
                      availableTimeSlots.map((time) => (
                        <Button
                          key={time}
                          variant={selectedTime === time && timeSelectionMode === 'preset' ? "default" : "outline"}
                          size="sm"
                          className="flex items-center justify-center"
                          onClick={() => {
                            setSelectedTime(time);
                            setTimeSelectionMode('preset');
                          }}
                        >
                          <Clock className="mr-1 h-3 w-3" />
                          {time}
                        </Button>
                      ))
                    ) : (
                      <div className="col-span-full text-center text-muted-foreground p-2">
                        Không có lịch trống trong ngày này
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="custom">
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
                </TabsContent>
              </Tabs>
            )}

            {!date && (
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
            disabled={
              !date || 
              (timeSelectionMode === 'preset' && !selectedTime) || 
              (timeSelectionMode === 'custom' && isCustomTimeBooked())
            }
          >
            Xác nhận lịch hẹn
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AppointmentCalendar;
