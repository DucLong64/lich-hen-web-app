
import { format } from 'date-fns';
import { AppointmentCreationRequest, createAppointment } from '@/api/apiService';
import { ServiceType } from '@/types/ServiceType';
import { EmployeeType } from '@/types/EmployeeType';

// Simulate already booked slots - in a real app, this would come from the API
export const bookedSlots: Record<string, string[]> = {
  '2025-05-16': ['09:00', '14:00'],
  '2025-05-17': ['08:00', '11:00', '13:00'],
  '2025-05-18': ['10:00', '15:00'],
};

export const isTimeSlotBooked = (
  date: Date | undefined, 
  hour: string, 
  minute: string
): boolean => {
  if (!date) return false;
  
  const formattedDate = format(date, 'yyyy-MM-dd');
  const timeString = `${hour}:${minute}`;
  const unavailableTimes = bookedSlots[formattedDate] || [];
  
  return unavailableTimes.includes(timeString);
};

export const submitAppointment = async (
  date: Date,
  timeString: string,
  selectedService: ServiceType,
  selectedEmployee: EmployeeType | null,
  notes: string
): Promise<boolean> => {
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
    return await createAppointment(appointmentData);
  } catch (error) {
    console.error('Error submitting appointment:', error);
    return false;
  }
};
