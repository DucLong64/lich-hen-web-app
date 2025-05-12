
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Phone, Mail, Settings } from 'lucide-react';

export const CustomerProfile = () => {
  const [profileData, setProfileData] = useState({
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '0901234567',
    address: 'Quận 1, TP. Hồ Chí Minh',
    birthdate: '01/01/1990',
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save profile data to backend (simulated)
    setIsEditing(false);
  };

  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="profile">Thông tin cá nhân</TabsTrigger>
        <TabsTrigger value="settings">Cài đặt thông báo</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle>Hồ sơ cá nhân</CardTitle>
            <CardDescription>
              Xem và cập nhật thông tin cá nhân của bạn
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="flex justify-center mb-4">
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-12 w-12 text-primary" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Họ và tên</Label>
                  <div className="flex">
                    <User className="mr-2 h-4 w-4 opacity-50 my-auto" />
                    <Input
                      id="name"
                      name="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex">
                    <Mail className="mr-2 h-4 w-4 opacity-50 my-auto" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <div className="flex">
                    <Phone className="mr-2 h-4 w-4 opacity-50 my-auto" />
                    <Input
                      id="phone"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="birthdate">Ngày sinh</Label>
                  <Input
                    id="birthdate"
                    name="birthdate"
                    value={profileData.birthdate}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Địa chỉ</Label>
                  <Input
                    id="address"
                    name="address"
                    value={profileData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              {isEditing ? (
                <>
                  <Button variant="outline" type="button" onClick={() => setIsEditing(false)}>
                    Hủy
                  </Button>
                  <Button type="submit">Lưu thay đổi</Button>
                </>
              ) : (
                <Button type="button" onClick={() => setIsEditing(true)}>
                  Chỉnh sửa thông tin
                </Button>
              )}
            </CardFooter>
          </form>
        </Card>
      </TabsContent>
      <TabsContent value="settings">
        <Card>
          <CardHeader>
            <CardTitle>Cài đặt thông báo</CardTitle>
            <CardDescription>
              Tùy chỉnh cách bạn nhận thông báo từ hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Thông báo qua email</h4>
                  <p className="text-sm text-muted-foreground">Nhận thông báo xác nhận lịch hẹn qua email</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">Bật</Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Thông báo qua SMS</h4>
                  <p className="text-sm text-muted-foreground">Nhận tin nhắn nhắc nhở trước lịch hẹn</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">Bật</Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Hóa đơn điện tử</h4>
                  <p className="text-sm text-muted-foreground">Nhận hóa đơn điện tử sau khi dịch vụ hoàn thành</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">Bật</Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Lưu cài đặt</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default CustomerProfile;
