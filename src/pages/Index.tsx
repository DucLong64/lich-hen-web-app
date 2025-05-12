
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import ServiceSelector from "@/components/booking/ServiceSelector";
import EmployeeSelector, { EmployeeType } from "@/components/booking/EmployeeSelector";
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
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeType | null>(null);
  const [appointmentConfirmed, setAppointmentConfirmed] = useState(false);
  const [bookingStep, setBookingStep] = useState<'service' | 'employee' | 'time'>('service');
  const [activeTab, setActiveTab] = useState('booking');

  // Parse the current URL to check for tab parameter and update appointment
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    const updateAppointmentId = params.get('updateAppointment');
    
    if (tab) {
      setActiveTab(tab);
    }
    
    if (updateAppointmentId) {
      // In a real app, fetch the appointment details and populate the form
      toast({
        title: "Cập nhật lịch hẹn",
        description: `Đang cập nhật lịch hẹn #${updateAppointmentId}`,
      });
      setBookingStep('service');
    }
  }, [location, toast]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/?tab=${value}`);
  };

  const handleServiceSelect = (service: ServiceType) => {
    setSelectedService(service);
    setSelectedEmployee(null);
    setAppointmentConfirmed(false);
    setBookingStep('employee');
    toast({
      title: "Dịch vụ đã chọn",
      description: `Bạn đã chọn dịch vụ: ${service.name}`,
    });
  };

  const handleEmployeeSelect = (employee: EmployeeType) => {
    setSelectedEmployee(employee);
    setBookingStep('time');
    toast({
      title: "Nhân viên đã chọn",
      description: `Bạn đã chọn nhân viên: ${employee.name}`,
    });
  };

  const handleAppointmentConfirm = (date: Date, time: string) => {
    setAppointmentConfirmed(true);
    toast({
      title: "Đặt lịch thành công",
      description: `Lịch hẹn của bạn với ${selectedEmployee?.name} đã được xác nhận vào lúc ${time} ngày ${date.toLocaleDateString()}`,
    });
  };

  const handleReset = () => {
    setSelectedService(null);
    setSelectedEmployee(null);
    setAppointmentConfirmed(false);
    setBookingStep('service');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Hệ thống đặt lịch hẹn trực tuyến
          </h1>
          
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
              <TabsTrigger value="booking">Đặt lịch</TabsTrigger>
              <TabsTrigger value="manage">Quản lý lịch hẹn</TabsTrigger>
              <TabsTrigger value="employee">Quản lý nhân viên</TabsTrigger>
              <TabsTrigger value="feedback">Đánh giá & Thông báo</TabsTrigger>
            </TabsList>
            
            <TabsContent value="booking">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Quy trình đặt lịch</h2>
                  
                  <div className="flex items-center mb-6">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${bookingStep === 'service' ? 'bg-primary text-white' : 'bg-gray-200'}`}>1</div>
                    <div className="h-1 w-10 bg-gray-200 mx-1"></div>
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${bookingStep === 'employee' ? 'bg-primary text-white' : 'bg-gray-200'}`}>2</div>
                    <div className="h-1 w-10 bg-gray-200 mx-1"></div>
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${bookingStep === 'time' ? 'bg-primary text-white' : 'bg-gray-200'}`}>3</div>
                    <div className="ml-3 text-sm text-muted-foreground">
                      {bookingStep === 'service' && 'Chọn dịch vụ'}
                      {bookingStep === 'employee' && 'Chọn nhân viên'}
                      {bookingStep === 'time' && 'Chọn thời gian'}
                    </div>
                  </div>
                  
                  {bookingStep === 'service' && (
                    <ServiceSelector onServiceSelect={handleServiceSelect} />
                  )}
                  
                  {bookingStep === 'employee' && (
                    <>
                      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                        <h3 className="font-medium">Dịch vụ đã chọn: {selectedService?.name}</h3>
                        <p className="text-sm text-muted-foreground">{selectedService?.description}</p>
                        <div className="mt-2 flex justify-between text-sm">
                          <span>Thời gian: {selectedService?.duration}</span>
                          <span className="font-medium">{selectedService?.price}</span>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setBookingStep('service')}
                          className="mt-2"
                        >
                          Chọn dịch vụ khác
                        </Button>
                      </div>
                      <EmployeeSelector 
                        selectedService={selectedService} 
                        onEmployeeSelect={handleEmployeeSelect} 
                      />
                    </>
                  )}
                  
                  {bookingStep === 'time' && selectedEmployee && (
                    <>
                      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                        <h3 className="font-medium">Thông tin đã chọn</h3>
                        <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Dịch vụ:</p>
                            <p>{selectedService?.name}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Nhân viên:</p>
                            <p>{selectedEmployee.name}</p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setBookingStep('employee')}
                          className="mt-2"
                        >
                          Chọn nhân viên khác
                        </Button>
                      </div>
                      <AppointmentCalendar 
                        selectedService={selectedService}
                        selectedEmployee={selectedEmployee}
                        onAppointmentConfirm={handleAppointmentConfirm}
                      />
                    </>
                  )}
                  
                  {appointmentConfirmed && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
                      <h3 className="text-lg font-medium text-green-800">Đặt lịch thành công!</h3>
                      <p className="mt-2 text-green-700">
                        Thông tin xác nhận đã được gửi đến email của bạn. Cảm ơn bạn đã đặt lịch.
                      </p>
                      <div className="mt-4">
                        <Button onClick={handleReset}>
                          Đặt lịch mới
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className={bookingStep !== 'service' ? 'hidden md:block' : ''}>
                  {bookingStep === 'service' && (
                    <div className="bg-gray-100 rounded-lg p-6 h-full">
                      <h2 className="text-2xl font-semibold mb-4">Hướng dẫn đặt lịch</h2>
                      <ol className="space-y-4 list-decimal list-inside">
                        <li className="p-3 bg-white rounded-md shadow-sm">
                          <span className="font-medium">Bước 1:</span> Chọn dịch vụ bạn muốn đặt lịch
                        </li>
                        <li className="p-3 bg-white rounded-md shadow-sm">
                          <span className="font-medium">Bước 2:</span> Chọn nhân viên phù hợp với nhu cầu của bạn
                        </li>
                        <li className="p-3 bg-white rounded-md shadow-sm">
                          <span className="font-medium">Bước 3:</span> Chọn ngày và giờ phù hợp với lịch trình của bạn
                        </li>
                        <li className="p-3 bg-white rounded-md shadow-sm">
                          <span className="font-medium">Bước 4:</span> Xác nhận thông tin và hoàn tất đặt lịch
                        </li>
                      </ol>
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
