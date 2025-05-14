import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export interface EmployeeType {
  id: string;
  name: string;
  position?: string;
  avatar?: string;
  specialties?: string[];
}

interface EmployeeSelectorProps {
  employees: EmployeeType[];
  onEmployeeSelect: (employee: EmployeeType) => void;
}

const EmployeeSelector: React.FC<EmployeeSelectorProps> = ({ employees, onEmployeeSelect }) => {
  if (!employees || employees.length === 0) {
    return (
      <div className="text-center p-4 border rounded-md bg-muted/20">
        <p>Không có nhân viên phù hợp với dịch vụ này</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Chọn nhân viên phục vụ</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {employees.map(emp => (
          <Card key={emp.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div>{emp.name}</div>
            </CardHeader>
            <CardContent className="pb-3">
              {emp.position && <p className="text-sm text-muted-foreground">{emp.position}</p>}
            </CardContent>
            <CardFooter>
              <Button onClick={() => onEmployeeSelect(emp)} className="w-full">
                Chọn
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EmployeeSelector;
