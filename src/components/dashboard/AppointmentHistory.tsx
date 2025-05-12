
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, X, CheckCheck, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";

interface Appointment {
  id: string;
  service: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'canceled';
  provider: string;
  price: string;
}

const appointments: Appointment[] = [
  {
    id: 'ap1',
    service: 'Tư vấn sức khỏe',
    date: '16/05/2025',
    time: '09:00',
    status: 'upcoming',
    provider: 'BS. Nguyễn Văn B',
    price: '300.000 VNĐ',
  },
  {
    id: 'ap2',
    service: 'Kiểm tra sức khỏe tổng quát',
    date: '10/05/2025',
    time: '14:00',
    status: 'completed',
    provider: 'BS. Trần Thị C',
    price: '500.000 VNĐ',
  },
  {
    id: 'ap3',
    service: 'Massage trị liệu',
    date: '05/05/2025',
    time: '15:30',
    status: 'canceled',
    provider: 'Lê Thị D',
    price: '350.000 VNĐ',
  },
  {
    id: 'ap4',
    service: 'Tư vấn tài chính',
    date: '01/05/2025',
    time: '10:00',
    status: 'completed',
    provider: 'Phạm Văn E',
    price: '400.000 VNĐ',
  },
];

export const AppointmentHistory = () => {
  const [appointmentList, setAppointmentList] = useState<Appointment[]>(appointments);
  const navigate = useNavigate();
  
  const cancelAppointment = (id: string) => {
    setAppointmentList(prev => 
      prev.map(app => app.id === id ? { ...app, status: 'canceled' } : app)
    );
    toast.success("Lịch hẹn đã được hủy thành công");
  };

  const updateAppointment = (id: string) => {
    // In a real app, we would redirect to the booking page with the appointment details
    // For now, we'll simulate this by navigating to the booking tab on the main page
    navigate('/?tab=booking&updateAppointment=' + id);
    toast.success("Chuyển đến trang cập nhật lịch hẹn");
  };

  const upcomingAppointments = appointmentList.filter(app => app.status === 'upcoming');
  const completedAppointments = appointmentList.filter(app => app.status === 'completed');
  const canceledAppointments = appointmentList.filter(app => app.status === 'canceled');

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{appointment.service}</h3>
            <div className="flex items-center mt-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{appointment.date}</span>
              <Clock className="h-4 w-4 mx-1 ml-3" />
              <span>{appointment.time}</span>
            </div>
            <div className="mt-2 text-sm">
              <span className="font-semibold">Nhân viên:</span> {appointment.provider}
            </div>
            <div className="mt-1 font-medium">
              {appointment.price}
            </div>
          </div>
          <div>
            {appointment.status === 'upcoming' ? (
              <Badge className="bg-blue-500">Sắp tới</Badge>
            ) : appointment.status === 'completed' ? (
              <Badge className="bg-green-500">Đã hoàn thành</Badge>
            ) : (
              <Badge variant="destructive">Đã hủy</Badge>
            )}
          </div>
        </div>
        
        {appointment.status === 'upcoming' && (
          <div className="mt-4 flex justify-end space-x-2">
            <Button variant="outline" size="sm" onClick={() => updateAppointment(appointment.id)}>
              <Edit className="h-4 w-4 mr-1" />
              Cập nhật lịch
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <X className="h-4 w-4 mr-1" />
                  Hủy lịch
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Xác nhận hủy lịch hẹn</DialogTitle>
                  <DialogDescription>
                    Bạn có chắc chắn muốn hủy lịch hẹn "{appointment.service}" vào lúc {appointment.time} ngày {appointment.date}?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" size="sm">Đóng</Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => cancelAppointment(appointment.id)}
                  >
                    Xác nhận hủy
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
        
        {appointment.status === 'completed' && (
          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm">
              Để lại đánh giá
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Tabs defaultValue="upcoming" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="upcoming">
          Sắp tới
          {upcomingAppointments.length > 0 && (
            <Badge variant="outline" className="ml-2">
              {upcomingAppointments.length}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="completed">Đã hoàn thành</TabsTrigger>
        <TabsTrigger value="canceled">Đã hủy</TabsTrigger>
      </TabsList>
      
      <TabsContent value="upcoming">
        {upcomingAppointments.length > 0 ? (
          upcomingAppointments.map(app => (
            <AppointmentCard key={app.id} appointment={app} />
          ))
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Không có lịch hẹn sắp tới</CardTitle>
              <CardDescription>
                Bạn chưa có lịch hẹn nào được đặt trong thời gian tới.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button>Đặt lịch ngay</Button>
            </CardContent>
          </Card>
        )}
      </TabsContent>
      
      <TabsContent value="completed">
        {completedAppointments.length > 0 ? (
          completedAppointments.map(app => (
            <AppointmentCard key={app.id} appointment={app} />
          ))
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Không có lịch sử lịch hẹn</CardTitle>
              <CardDescription>
                Bạn chưa có lịch hẹn nào đã hoàn thành.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </TabsContent>
      
      <TabsContent value="canceled">
        {canceledAppointments.length > 0 ? (
          canceledAppointments.map(app => (
            <AppointmentCard key={app.id} appointment={app} />
          ))
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Không có lịch hẹn bị hủy</CardTitle>
              <CardDescription>
                Bạn chưa có lịch hẹn nào bị hủy.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default AppointmentHistory;
