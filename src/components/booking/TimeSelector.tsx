
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Generate hours options
const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));

// Generate minutes options
const minutes = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));

interface TimeSelectorProps {
  customHour: string;
  customMinute: string;
  onTimeChange: (hour: string, minute: string) => void;
  isTimeBooked: boolean;
}

const TimeSelector: React.FC<TimeSelectorProps> = ({
  customHour,
  customMinute,
  onTimeChange,
  isTimeBooked
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="hour">Giờ</Label>
          <Select 
            value={customHour} 
            onValueChange={value => onTimeChange(value, customMinute)}
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
            onValueChange={value => onTimeChange(customHour, value)}
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
      
      {isTimeBooked && (
        <div className="text-red-500 text-sm">
          Thời gian này đã được đặt. Vui lòng chọn thời gian khác.
        </div>
      )}
    </div>
  );
};

export default TimeSelector;
