import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { ServiceType } from '@/types/ServiceType';

// Sample services data
const services: ServiceType[] = [
  {
    id: '1',
    name: 'Tư vấn sức khỏe',
    description: 'Tư vấn với bác sĩ chuyên khoa về tình trạng sức khỏe của bạn',
    duration: '30 phút',
    price: '300.000 VNĐ',
    category: 'health'
  },
  {
    id: '2',
    name: 'Kiểm tra sức khỏe tổng quát',
    description: 'Kiểm tra sức khỏe toàn diện bao gồm các chỉ số quan trọng',
    duration: '60 phút',
    price: '500.000 VNĐ',
    category: 'health'
  },
  {
    id: '3',
    name: 'Tư vấn tài chính',
    description: 'Tư vấn với chuyên gia tài chính về kế hoạch đầu tư',
    duration: '45 phút',
    price: '400.000 VNĐ',
    category: 'finance'
  },
  {
    id: '4',
    name: 'Tư vấn pháp lý',
    description: 'Tư vấn với luật sư về các vấn đề pháp lý',
    duration: '45 phút',
    price: '450.000 VNĐ',
    category: 'legal'
  },
  {
    id: '5',
    name: 'Massage trị liệu',
    description: 'Liệu pháp massage giúp thư giãn và phục hồi cơ thể',
    duration: '60 phút',
    price: '350.000 VNĐ',
    category: 'spa'
  },
  {
    id: '6',
    name: 'Chăm sóc da mặt',
    description: 'Dịch vụ chăm sóc da mặt chuyên nghiệp',
    duration: '45 phút',
    price: '400.000 VNĐ',
    category: 'spa'
  }
];

type CategoryFilterType = 'all' | 'health' | 'finance' | 'legal' | 'spa';

export const ServiceSelector: React.FC<{
  onServiceSelect: (service: ServiceType) => void;
}> = ({ onServiceSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilterType>('all');
  
  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(service => service.category === selectedCategory);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 items-center justify-start">
        <Button 
          variant={selectedCategory === 'all' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => setSelectedCategory('all')}
        >
          Tất cả
        </Button>
        <Button 
          variant={selectedCategory === 'health' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => setSelectedCategory('health')}
        >
          Sức khỏe
        </Button>
        <Button 
          variant={selectedCategory === 'finance' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => setSelectedCategory('finance')}
        >
          Tài chính
        </Button>
        <Button 
          variant={selectedCategory === 'legal' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => setSelectedCategory('legal')}
        >
          Pháp lý
        </Button>
        <Button 
          variant={selectedCategory === 'spa' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => setSelectedCategory('spa')}
        >
          Spa & Làm đẹp
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <Card key={service.id} className="hover-scale overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle>{service.name}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-1 h-4 w-4" />
                <span>{service.duration}</span>
              </div>
              <div className="mt-2 text-base font-semibold">{service.price}</div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => onServiceSelect(service)} className="w-full">
                Chọn dịch vụ
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServiceSelector;
