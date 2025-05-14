
import React from 'react';

const BookingGuide: React.FC = () => {
  return (
    <div className="bg-gray-100 rounded-lg p-6 h-full">
      <h2 className="text-2xl font-semibold mb-4">Hướng dẫn đặt lịch</h2>
      <ol className="space-y-4 list-decimal list-inside">
        <li className="p-3 bg-white rounded-md shadow-sm">
          <span className="font-medium">Bước 1:</span> Chọn dịch vụ bạn muốn đặt lịch
        </li>
        <li className="p-3 bg-white rounded-md shadow-sm">
          <span className="font-medium">Bước 2:</span> Chọn nhân viên phù hợp với nhu cầu (tùy chọn)
        </li>
        <li className="p-3 bg-white rounded-md shadow-sm">
          <span className="font-medium">Bước 3:</span> Chọn ngày và giờ phù hợp với lịch trình của bạn
        </li>
        <li className="p-3 bg-white rounded-md shadow-sm">
          <span className="font-medium">Bước 4:</span> Xác nhận thông tin và hoàn tất đặt lịch
        </li>
      </ol>
    </div>
  );
};

export default BookingGuide;
