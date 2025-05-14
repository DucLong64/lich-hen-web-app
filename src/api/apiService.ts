
import { EmployeeType } from '@/types/EmployeeType';


export interface AvailableEmployeeInfoDTO {
  employeeId: number;
  name: string;
}

export interface AppointmentCreationRequest {
  customerId: number | null;
  serviceId: number;
  serviceName: string;
  employeeId: number | null;
  time: string; // ISO datetime string
  notes: string;
}

export interface AppointmentResponse {
  customerId: number;
  appointmentId: number;
  serviceId: number;
  serviceName: string;
  employeeId: number;
  employeeName: string;
  time: string; // ISO datetime string
  status: string; // PENDING, CONFIRMED, etc.
  notes: string;
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL = 'http://localhost:9090/api';

// Hàm lấy danh sách nhân viên khả dụng theo serviceId và thời gian
export async function fetchAvailableEmployees(serviceId: number, timeISO: string): Promise<AvailableEmployeeInfoDTO[]> {
  const url = `${API_BASE_URL}/availability/${serviceId}?time=${encodeURIComponent(timeISO)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch available employees: ${response.statusText}`);
  }
  const data = await response.json();
  return data as AvailableEmployeeInfoDTO[];
}

// Hàm tạo lịch hẹn
export async function createAppointment(requestData: AppointmentCreationRequest): Promise<AppointmentResponse> {
  const url = `${API_BASE_URL}/appointment`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestData)
  });

  if (response.status === 409) {
    throw new Error('Lịch hẹn bị trùng');
  }
  if (!response.ok) {
    throw new Error(`Failed to create appointment: ${response.statusText}`);
  }

  const data = await response.json();
  return data as AppointmentResponse;
}