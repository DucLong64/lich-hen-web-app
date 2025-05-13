
import React from 'react';
import TabsContainer from "@/components/layout/TabsContainer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Hệ thống đặt lịch hẹn trực tuyến
          </h1>
          
          <TabsContainer />
        </div>
      </main>
    </div>
  );
};

export default Index;
