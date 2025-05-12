
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface Employee {
  id: string;
  name: string;
  role: string;
  services: string[];
  schedule: Record<string, string[]>;
}

const employees: Employee[] = [
  {
    id: 'e1',
    name: 'BS. Nguyễn Văn B',
    role: 'Bác sĩ',
    services: ['Tư vấn sức khỏe', 'Kiểm tra sức khỏe tổng quát'],
    schedule: {
      '2025-05-16': ['08:00', '09:00', '10:00', '14:00'],
      '2025-05-17': ['08:00', '13:00', '14:00'],
      '2025-05-18': ['09:00', '10:00', '11:00'],
    }
  },
  {
    id: 'e2',
    name: 'BS. Trần Thị C',
    role: 'Bác sĩ chuyên khoa',
    services: ['Kiểm tra sức khỏe tổng quát'],
    schedule: {
      '2025-05-16': ['13:00', '14:00', '15:00'],
      '2025-05-17': ['09:00', '10:00', '11:00'],
      '2025-05-18': ['13:00', '14:00', '15:00'],
    }
  },
  {
    id: 'e3',
    name: 'Lê Thị D',
    role: 'Chuyên viên massage',
    services: ['Massage trị liệu'],
    schedule: {
      '2025-05-16': ['10:00', '11:00', '16:00', '17:00'],
      '2025-05-17': ['14:00', '15:00', '16:00'],
      '2025-05-18': ['08:00', '09:00', '16:00', '17:00'],
    }
  },
  {
    id: 'e4',
    name: 'Phạm Văn E',
    role: 'Chuyên gia tài chính',
    services: ['Tư vấn tài chính'],
    schedule: {
      '2025-05-16': ['09:00', '10:00', '14:00', '15:00'],
      '2025-05-17': ['10:00', '11:00', '13:00', '14:00'],
      '2025-05-19': ['14:00', '15:00', '16:00'],
    }
  },
];

export const EmployeeSchedule = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState<string>(employees[0].id);
  
  const employee = employees.find(emp => emp.id === selectedEmployee);
  const formattedDate = date ? format(date, 'yyyy-MM-dd') : '';
  const availableSlots = employee?.schedule[formattedDate] || [];
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quản lý lịch nhân viên</CardTitle>
          <CardDescription>
            Xem và sắp xếp lịch trình làm việc của nhân viên
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Chọn nhân viên:</label>
                <Select
                  value={selectedEmployee}
                  onValueChange={setSelectedEmployee}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn nhân viên" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.name} - {emp.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1">
                <label className="text-sm font-medium">Thông tin nhân viên:</label>
                {employee && (
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-medium text-lg">{employee.name}</h3>
                      <p className="text-sm text-muted-foreground">{employee.role}</p>
                      
                      <div className="mt-3">
                        <p className="text-sm font-medium">Dịch vụ:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {employee.services.map((service) => (
                            <Badge key={service} variant="outline">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
            
            <div className="md:w-1/2 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Xem lịch làm việc:</label>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border pointer-events-auto"
                />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Lịch làm việc ngày {formattedDate}:</h3>
            {availableSlots.length > 0 ? (
              <Tabs defaultValue="available" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="available">Lịch làm việc</TabsTrigger>
                  <TabsTrigger value="appointments">Lịch hẹn</TabsTrigger>
                </TabsList>
                <TabsContent value="available">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2">
                    {availableSlots.map((time) => (
                      <div
                        key={time}
                        className="bg-primary/10 text-primary rounded-md p-2 text-center hover:bg-primary/20 transition-colors cursor-pointer"
                      >
                        {time}
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="appointments">
                  <div className="text-center p-4 text-sm text-muted-foreground">
                    Hiện chưa có lịch hẹn nào vào ngày này
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center p-4 text-sm text-muted-foreground">
                Nhân viên không có lịch làm việc vào ngày này
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button>Thêm lịch làm việc</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EmployeeSchedule;
