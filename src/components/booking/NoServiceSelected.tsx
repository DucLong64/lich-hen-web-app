
import React from 'react';
import { CalendarPlus } from 'lucide-react';

const NoServiceSelected: React.FC = () => {
  return (
    <div className="text-center p-8">
      <CalendarPlus className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-medium">Vui lòng chọn dịch vụ</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Bạn cần chọn dịch vụ để xem lịch hẹn có sẵn.
      </p>
    </div>
  );
};

export default NoServiceSelected;
