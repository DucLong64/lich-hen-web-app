
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import BookingFlow from "@/components/booking/BookingFlow";
import CustomerProfile from "@/components/dashboard/CustomerProfile";
import AppointmentHistory from "@/components/dashboard/AppointmentHistory";
import EmployeeSchedule from "@/components/management/EmployeeSchedule";
import FeedbackForm from "@/components/feedback/FeedbackForm";
import EmailNotification from "@/components/notifications/EmailNotification";

const TabsContainer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('booking');
  const [updateAppointmentId, setUpdateAppointmentId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    const updateId = params.get('updateAppointment');
    
    if (tab) {
      setActiveTab(tab);
    }
    
    if (updateId) {
      setUpdateAppointmentId(updateId);
      toast({
        title: "Cập nhật lịch hẹn",
        description: `Đang cập nhật lịch hẹn #${updateId}`,
      });
    }
  }, [location, toast]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Preserve updateAppointment parameter if present when switching tabs
    const params = new URLSearchParams(location.search);
    const updateId = params.get('updateAppointment');
    
    if (updateId && value === 'booking') {
      navigate(`/?tab=${value}&updateAppointment=${updateId}`);
    } else {
      navigate(`/?tab=${value}`);
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
        <TabsTrigger value="booking">Đặt lịch</TabsTrigger>
        <TabsTrigger value="manage">Quản lý lịch hẹn</TabsTrigger>
        <TabsTrigger value="employee">Quản lý nhân viên</TabsTrigger>
        <TabsTrigger value="feedback">Đánh giá & Thông báo</TabsTrigger>
      </TabsList>
      
      <TabsContent value="booking">
        <BookingFlow updateAppointmentId={updateAppointmentId} />
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
  );
};

export default TabsContainer;
