
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import ServiceSelector from "@/components/booking/ServiceSelector";
import AppointmentCalendar from "@/components/booking/AppointmentCalendar";
import CustomerProfile from "@/components/dashboard/CustomerProfile";
import AppointmentHistory from "@/components/dashboard/AppointmentHistory";
import EmployeeSchedule from "@/components/management/EmployeeSchedule";
import EmailNotification from "@/components/notifications/EmailNotification";
import FeedbackForm from "@/components/feedback/FeedbackForm";

interface ServiceType {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: string;
  category: string;
}

const Index = () => {
  const { toast } = useToast();
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [appointmentConfirmed, setAppointmentConfirmed] = useState(false);

  const handleServiceSelect = (service: ServiceType) => {
    setSelectedService(service);
    setAppointmentConfirmed(false);
    toast({
      title: "Dịch vụ đã chọn",
      description: `Bạn đã chọn dịch vụ: ${service.name}`,
    });
  };

  const handleAppointmentConfirm = (date: Date, time: string) => {
    setAppointmentConfirmed(true);
    toast({
      title: "Đặt lịch thành công",
      description: `Lịch hẹn của bạn đã được xác nhận vào lúc ${time} ngày ${date.toLocaleDateString()}`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Hệ thống đặt lịch hẹn trực tuyến
          </h1>
          
          <Tabs defaultValue="booking" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
              <TabsTrigger value="booking">Đặt lịch</TabsTrigger>
              <TabsTrigger value="manage">Quản lý lịch hẹn</TabsTrigger>
              <TabsTrigger value="employee">Quản lý nhân viên</TabsTrigger>
              <TabsTrigger value="feedback">Đánh giá & Thông báo</TabsTrigger>
            </TabsList>
            
            <TabsContent value="booking">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Chọn dịch vụ</h2>
                  <ServiceSelector onServiceSelect={handleServiceSelect} />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Chọn thời gian</h2>
                  <AppointmentCalendar 
                    selectedService={selectedService}
                    onAppointmentConfirm={handleAppointmentConfirm}
                  />
                  
                  {appointmentConfirmed && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
                      <h3 className="text-lg font-medium text-green-800">Đặt lịch thành công!</h3>
                      <p className="mt-2 text-green-700">
                        Thông tin xác nhận đã được gửi đến email của bạn. Cảm ơn bạn đã đặt lịch.
                      </p>
                      <div className="mt-4">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedService(null);
                            setAppointmentConfirmed(false);
                          }}
                        >
                          Đặt lịch mới
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="manage">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Hồ sơ khách hàng</h2>
                  <CustomerProfile />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Lịch sử đặt lịch</h2>
                  <AppointmentHistory />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="employee">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Quản lý lịch nhân viên</h2>
                <EmployeeSchedule />
              </div>
            </TabsContent>
            
            <TabsContent value="feedback">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Đánh giá dịch vụ</h2>
                  <FeedbackForm />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Xem trước thông báo</h2>
                  <EmailNotification />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <footer className="bg-gray-100 py-6 mt-12">
        <div className="container">
          <div className="max-w-7xl mx-auto text-center text-gray-600">
            <p>© 2025 AppointEase. Hệ thống đặt lịch hẹn trực tuyến.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
