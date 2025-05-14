
import React from 'react';
import { Button } from "@/components/ui/button";

interface BookingConfirmationProps {
  onReset: () => void;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({ onReset }) => {
  return (
    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
      <h3 className="text-lg font-medium text-green-800">Đặt lịch thành công!</h3>
      <p className="mt-2 text-green-700">
        Thông tin xác nhận đã được gửi đến email của bạn. Cảm ơn bạn đã đặt lịch.
      </p>
      <div className="mt-4">
        <Button onClick={onReset}>
          Đặt lịch mới
        </Button>
      </div>
    </div>
  );
};

export default BookingConfirmation;
