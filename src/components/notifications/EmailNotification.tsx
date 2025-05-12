
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const EmailNotification = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông báo và xác nhận</CardTitle>
        <CardDescription>
          Xem trước và quản lý thông báo gửi đến khách hàng
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="confirm">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="confirm">Xác nhận đặt lịch</TabsTrigger>
            <TabsTrigger value="reminder">Nhắc nhở</TabsTrigger>
            <TabsTrigger value="invoice">Hóa đơn</TabsTrigger>
          </TabsList>
          
          <TabsContent value="confirm" className="space-y-4">
            <div className="mt-4 p-4 border rounded-md">
              <div className="text-center mb-4">
                <h2 className="text-lg font-semibold text-primary">Xác nhận đặt lịch hẹn</h2>
              </div>
              
              <p className="mb-3">Kính gửi [Tên khách hàng],</p>
              
              <p className="mb-3">Cảm ơn bạn đã đặt lịch hẹn với chúng tôi. Dưới đây là thông tin chi tiết về lịch hẹn của bạn:</p>
              
              <div className="bg-accent p-3 rounded-md mb-3">
                <p><strong>Dịch vụ:</strong> [Tên dịch vụ]</p>
                <p><strong>Ngày:</strong> [Ngày]</p>
                <p><strong>Giờ:</strong> [Giờ]</p>
                <p><strong>Nhân viên:</strong> [Tên nhân viên]</p>
                <p><strong>Địa chỉ:</strong> [Địa chỉ cơ sở]</p>
              </div>
              
              <p className="mb-3">Vui lòng đến trước 10 phút để hoàn thành thủ tục.</p>
              
              <div className="text-center my-4">
                <Button className="mx-2">Xác nhận</Button>
                <Button variant="outline" className="mx-2">Đổi lịch</Button>
              </div>
              
              <p className="text-sm text-muted-foreground mt-4">
                Nếu bạn cần hỗ trợ hoặc muốn thay đổi lịch hẹn, vui lòng liên hệ với chúng tôi qua số điện thoại 0901234567.
              </p>
              
              <p className="mt-4">Trân trọng,<br />Đội ngũ AppointEase</p>
            </div>
          </TabsContent>
          
          <TabsContent value="reminder" className="space-y-4">
            <div className="mt-4 p-4 border rounded-md">
              <div className="text-center mb-4">
                <h2 className="text-lg font-semibold text-primary">Nhắc nhở lịch hẹn</h2>
              </div>
              
              <p className="mb-3">Kính gửi [Tên khách hàng],</p>
              
              <p className="mb-3">Đây là lời nhắc nhở về lịch hẹn sắp tới của bạn:</p>
              
              <div className="bg-accent p-3 rounded-md mb-3">
                <p><strong>Dịch vụ:</strong> [Tên dịch vụ]</p>
                <p><strong>Ngày:</strong> [Ngày] (Ngày mai)</p>
                <p><strong>Giờ:</strong> [Giờ]</p>
              </div>
              
              <p className="mb-3">Chúng tôi đang mong chờ được phục vụ bạn.</p>
              
              <div className="text-center my-4">
                <Button variant="outline" className="mx-2">Hủy lịch</Button>
                <Button className="mx-2">Xác nhận tham dự</Button>
              </div>
              
              <p className="text-sm text-muted-foreground mt-4">
                Nếu bạn không thể đến theo lịch hẹn, vui lòng thông báo cho chúng tôi ít nhất 4 giờ trước giờ hẹn.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="invoice" className="space-y-4">
            <div className="mt-4 p-4 border rounded-md">
              <div className="text-center mb-4">
                <h2 className="text-lg font-semibold text-primary">Hóa đơn dịch vụ</h2>
              </div>
              
              <p className="mb-3">Kính gửi [Tên khách hàng],</p>
              
              <p className="mb-3">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Dưới đây là hóa đơn chi tiết:</p>
              
              <div className="bg-accent p-3 rounded-md mb-3">
                <p><strong>Số hóa đơn:</strong> INV-2025-0123</p>
                <p><strong>Ngày:</strong> [Ngày]</p>
                <p><strong>Dịch vụ:</strong> [Tên dịch vụ]</p>
                <p><strong>Giá:</strong> [Giá dịch vụ]</p>
                <p><strong>Thuế (10%):</strong> [Số tiền thuế]</p>
                <p><strong>Tổng cộng:</strong> [Tổng số tiền]</p>
                <p><strong>Trạng thái:</strong> <span className="text-green-600 font-medium">Đã thanh toán</span></p>
              </div>
              
              <div className="text-center my-4">
                <Button className="mx-2">Tải hóa đơn PDF</Button>
              </div>
              
              <p className="mb-3">Chúng tôi rất mong được phục vụ bạn lần sau.</p>
              
              <p className="mt-4">Trân trọng,<br />Đội ngũ AppointEase</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button>Tùy chỉnh mẫu thông báo</Button>
      </CardFooter>
    </Card>
  );
};

export default EmailNotification;
