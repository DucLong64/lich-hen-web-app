
import React, { useState, useEffect } from 'react';
import { format, addMinutes, parse, isBefore } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ServiceType } from '@/types/ServiceType';
import NoServiceSelected from './NoServiceSelected';

interface TimeSlotsProps {
  selectedService: ServiceType | null;
  onTimeSelect: (date: Date, timeSlot: string) => void;
}

const TimeSlots: React.FC<TimeSlotsProps> = ({ selectedService, onTimeSelect }) => {
  const [date, setDate] = useState<Date>(new Date());
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Mock data for already booked slots
  const bookedSlots: Record<string, string[]> = {
    '2025-05-16': ['09:00', '14:00'],
    '2025-05-17': ['08:00', '11:00', '13:00'],
    '2025-05-18': ['10:00', '15:00'],
  };

  useEffect(() => {
    if (!selectedService) return;
    
    // Generate time slots based on service duration
    const slots: string[] = [];
    const durationMatch = selectedService.duration.match(/\d+/);
    const duration = durationMatch ? parseInt(durationMatch[0], 10) : 30;
    
    // Business hours from 8:00 to 18:00
    const startTime = new Date();
    startTime.setHours(8, 0, 0, 0);
    
    const endTime = new Date();
    endTime.setHours(18, 0, 0, 0);
    
    let currentTime = new Date(startTime);
    
    while (isBefore(currentTime, endTime)) {
      const timeString = format(currentTime, 'HH:mm');
      slots.push(timeString);
      currentTime = addMinutes(currentTime, duration);
    }
    
    setTimeSlots(slots);
    setSelectedSlot(null);
  }, [selectedService, date]);

  const isSlotBooked = (timeSlot: string) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    const unavailableTimes = bookedSlots[formattedDate] || [];
    return unavailableTimes.includes(timeSlot);
  };

  const handleTimeSlotClick = (timeSlot: string) => {
    if (isSlotBooked(timeSlot)) return;
    setSelectedSlot(timeSlot);
  };

  const handleConfirmTime = () => {
    if (selectedSlot) {
      onTimeSelect(date, selectedSlot);
    }
  };

  if (!selectedService) {
    return <NoServiceSelected />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Chọn ngày và khung giờ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="mb-2 text-sm font-medium">Chọn ngày:</h3>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              disabled={{ before: new Date() }}
              className="rounded-md border"
              locale={vi}
            />
          </div>
          
          <div>
            <h3 className="mb-2 text-sm font-medium">Chọn khung giờ:</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {timeSlots.map((slot) => {
                const isBooked = isSlotBooked(slot);
                return (
                  <Button
                    key={slot}
                    variant={selectedSlot === slot ? "default" : "outline"}
                    className={`py-2 ${isBooked ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isBooked}
                    onClick={() => handleTimeSlotClick(slot)}
                  >
                    {slot}
                  </Button>
                );
              })}
            </div>
            {timeSlots.length === 0 && (
              <div className="text-center p-4 text-muted-foreground">
                Không có khung giờ nào khả dụng
              </div>
            )}
          </div>
          
          <Button 
            onClick={handleConfirmTime} 
            className="w-full"
            disabled={!selectedSlot}
          >
            Xác nhận thời gian
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeSlots;
