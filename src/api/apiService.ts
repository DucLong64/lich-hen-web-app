
import { EmployeeType } from '@/types/EmployeeType';

// API base URL
const API_BASE_URL = 'http://localhost:9090/api';

// Interface for the employee data returned from the API
export interface EmployeeDTO {
  id: number;
  fullName: string;
  title: string;
  expertise: string;
}

// Interface for appointment creation request
export interface AppointmentCreationRequest {
  serviceId: number;
  startTime: string; // ISO string format
  duringTime: number;
  employeeId: number | null;
  notes: string;
}

// Convert EmployeeDTO from API to our EmployeeType format
const convertToEmployeeType = (employee: EmployeeDTO): EmployeeType => {
  return {
    id: employee.id.toString(),
    name: employee.fullName,
    position: employee.title,
    availability: [], // We don't have availability from the API
    avatar: `https://i.pravatar.cc/150?img=${employee.id}`, // Generate a random avatar
    specialties: [employee.expertise]
  };
};

// Fetch employees based on service ID
export const fetchEmployees = async (serviceId: string): Promise<EmployeeType[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/employees/${serviceId}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching employees: ${response.statusText}`);
    }
    
    const data: EmployeeDTO[] = await response.json();
    return data.map(convertToEmployeeType);
  } catch (error) {
    console.error('Error fetching employees:', error);
    return [];
  }
};

// Create a new appointment
export const createAppointment = async (appointmentData: AppointmentCreationRequest): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/appointment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData),
    });
    
    if (!response.ok) {
      throw new Error(`Error creating appointment: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error creating appointment:', error);
    return false;
  }
};
