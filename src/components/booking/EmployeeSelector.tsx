
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { ServiceType } from '@/types/ServiceType';
import { EmployeeType } from '@/types/EmployeeType';

// Sample employees data
const employees: EmployeeType[] = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    position: 'Chuyên viên tư vấn sức khỏe',
    availability: ['08:00', '09:00', '10:00', '14:00', '15:00'],
    avatar: 'https://i.pravatar.cc/150?img=1',
    specialties: ['Tư vấn sức khỏe', 'Kiểm tra sức khỏe tổng quát']
  },
  {
    id: '2',
    name: 'Trần Thị B',
    position: 'Chuyên viên tư vấn tài chính',
    availability: ['09:00', '11:00', '13:00', '16:00'],
    avatar: 'https://i.pravatar.cc/150?img=2',
    specialties: ['Tư vấn tài chính']
  },
  {
    id: '3',
    name: 'Lê Văn C',
    position: 'Luật sư tư vấn',
    availability: ['08:00', '10:00', '13:00', '14:00', '17:00'],
    avatar: 'https://i.pravatar.cc/150?img=3',
    specialties: ['Tư vấn pháp lý']
  },
  {
    id: '4',
    name: 'Phạm Thị D',
    position: 'Kỹ thuật viên spa',
    availability: ['09:00', '11:00', '14:00', '15:00', '16:00'],
    avatar: 'https://i.pravatar.cc/150?img=4',
    specialties: ['Massage trị liệu', 'Chăm sóc da mặt']
  }
];

export const EmployeeSelector: React.FC<{
  selectedService: ServiceType | null;
  onEmployeeSelect: (employee: EmployeeType | null) => void;
}> = ({ selectedService, onEmployeeSelect }) => {
  if (!selectedService) {
    return null;
  }

  // Filter employees based on their specialties matching the selected service
  const availableEmployees = employees.filter(employee => 
    employee.specialties.includes(selectedService.name)
  );

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Chọn nhân viên phục vụ (tùy chọn)</h3>
      
      {availableEmployees.length === 0 ? (
        <div className="text-center p-4 border rounded-md bg-muted/20">
          <p>Không có nhân viên phù hợp với dịch vụ này</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableEmployees.map((employee) => (
            <Card key={employee.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <img src={employee.avatar} alt={employee.name} />
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{employee.name}</CardTitle>
                    <CardDescription>{employee.position}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-sm text-muted-foreground">
                  Chuyên môn: {employee.specialties.join(', ')}
                </p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => onEmployeeSelect(employee)} className="w-full">
                  Chọn
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeSelector;
