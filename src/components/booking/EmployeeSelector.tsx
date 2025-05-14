
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { ServiceType } from '@/types/ServiceType';
import { EmployeeType } from '@/types/EmployeeType';

export const EmployeeSelector: React.FC<{
  selectedService: ServiceType | null;
  selectedDate: Date | null;
  selectedTimeSlot: string | null;
  onEmployeeSelect: (employee: EmployeeType | null) => void;
}> = ({ selectedService, selectedDate, selectedTimeSlot, onEmployeeSelect }) => {
  const [employees, setEmployees] = useState<EmployeeType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getEmployees = async () => {
      if (!selectedService || !selectedDate || !selectedTimeSlot) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Convert selectedDate and selectedTimeSlot to the format expected by API
        // Format the date and time for the API query if needed
        // For now, we're just using the serviceId to fetch employees
        const url = `http://localhost:9090/api/employees/${selectedService.id}`;
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Map the response to our EmployeeType format
        const mappedEmployees = data.map((employee: any) => ({
          id: employee.id.toString(),
          name: employee.fullName,
          position: employee.title,
          availability: [], // We don't have this from the API
          avatar: `https://i.pravatar.cc/150?img=${employee.id}`, // Generate a random avatar
          specialties: [employee.expertise]
        }));
        
        setEmployees(mappedEmployees);
      } catch (err) {
        setError('Không thể tải danh sách nhân viên. Vui lòng thử lại sau.');
        console.error('Error fetching employees:', err);
      } finally {
        setLoading(false);
      }
    };

    getEmployees();
  }, [selectedService, selectedDate, selectedTimeSlot]);

  if (!selectedService || !selectedDate || !selectedTimeSlot) {
    return (
      <div className="text-center p-4 border rounded-md bg-muted/20">
        <p>Vui lòng chọn dịch vụ và thời gian trước</p>
      </div>
    );
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
        <h3 className="text-lg font-medium">Chọn nhân viên phục vụ</h3>
        <div className="text-center p-4 border rounded-md bg-red-50 text-red-800">
          <p>{error}</p>
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={() => {
              if (selectedService) {
                setLoading(true);
                fetch(`http://localhost:9090/api/employees/${selectedService.id}`)
                  .then(response => {
                    if (!response.ok) throw new Error('Network response was not ok');
                    return response.json();
                  })
                  .then(data => {
                    const mappedEmployees = data.map((employee: any) => ({
                      id: employee.id.toString(),
                      name: employee.fullName,
                      position: employee.title,
                      availability: [],
                      avatar: `https://i.pravatar.cc/150?img=${employee.id}`,
                      specialties: [employee.expertise]
                    }));
                    setEmployees(mappedEmployees);
                    setError(null);
                  })
                  .catch(err => {
                    console.error('Error refetching employees:', err);
                    setError('Không thể tải danh sách nhân viên. Vui lòng thử lại sau.');
                  })
                  .finally(() => {
                    setLoading(false);
                  });
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
      <h3 className="text-lg font-medium">Chọn nhân viên phục vụ</h3>
      
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
