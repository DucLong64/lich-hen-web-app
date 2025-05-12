
import React from 'react';
import Navbar from "@/components/layout/Navbar";
import TabsContainer from "@/components/layout/TabsContainer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Hệ thống đặt lịch hẹn trực tuyến
          </h1>
          
          <TabsContainer />
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
