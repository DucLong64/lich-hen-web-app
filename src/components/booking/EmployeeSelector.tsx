
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { ServiceType } from '@/types/ServiceType';
import { EmployeeType } from '@/types/EmployeeType';
import { fetchEmployees } from '@/api/apiService';
import { Skeleton } from '@/components/ui/skeleton';

export const EmployeeSelector: React.FC<{
  selectedService: ServiceType | null;
  onEmployeeSelect: (employee: EmployeeType | null) => void;
}> = ({ selectedService, onEmployeeSelect }) => {
  const [employees, setEmployees] = useState<EmployeeType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getEmployees = async () => {
      if (!selectedService) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const fetchedEmployees = await fetchEmployees(selectedService.id);
        setEmployees(fetchedEmployees);
      } catch (err) {
        setError('Không thể tải danh sách nhân viên. Vui lòng thử lại sau.');
        console.error('Error fetching employees:', err);
      } finally {
        setLoading(false);
      }
    };

    getEmployees();
  }, [selectedService]);

  if (!selectedService) {
    return null;
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Đang tải danh sách nhân viên...</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <Skeleton className="h-3 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Chọn nhân viên phục vụ (tùy chọn)</h3>
        <div className="text-center p-4 border rounded-md bg-red-50 text-red-800">
          <p>{error}</p>
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={() => {
              if (selectedService) {
                fetchEmployees(selectedService.id)
                  .then(setEmployees)
                  .catch(err => console.error('Error refetching employees:', err));
              }
            }}
          >
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Chọn nhân viên phục vụ (tùy chọn)</h3>
      
      {employees.length === 0 ? (
        <div className="text-center p-4 border rounded-md bg-muted/20">
          <p>Không có nhân viên phù hợp với dịch vụ này</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {employees.map((employee) => (
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
