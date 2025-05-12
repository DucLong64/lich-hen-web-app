
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";

interface FeedbackRating {
  service: number;
  staff: number;
  facility: number;
  overall: number;
}

export const FeedbackForm = () => {
  const { toast } = useToast();
  
  const [rating, setRating] = useState<FeedbackRating>({
    service: 0,
    staff: 0,
    facility: 0,
    overall: 0,
  });
  
  const [comment, setComment] = useState('');
  
  const handleRatingChange = (category: keyof FeedbackRating, value: number) => {
    setRating(prev => ({
      ...prev,
      [category]: value,
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating.overall === 0) {
      toast({
        title: "Đánh giá không hợp lệ",
        description: "Vui lòng đánh giá tổng thể trải nghiệm của bạn",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Cảm ơn bạn đã gửi đánh giá!",
      description: "Phản hồi của bạn rất quan trọng với chúng tôi.",
    });
    
    // Reset form
    setRating({
      service: 0,
      staff: 0,
      facility: 0,
      overall: 0,
    });
    setComment('');
  };
  
  const StarRating = ({ category, value }: { category: keyof FeedbackRating, value: number }) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingChange(category, star)}
            className={`w-8 h-8 ${
              star <= value ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        ))}
      </div>
    );
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Đánh giá dịch vụ</CardTitle>
        <CardDescription>
          Chia sẻ trải nghiệm của bạn về dịch vụ bạn đã sử dụng
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <label className="text-sm font-medium">Chất lượng dịch vụ</label>
                <StarRating category="service" value={rating.service} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <label className="text-sm font-medium">Thái độ nhân viên</label>
                <StarRating category="staff" value={rating.staff} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <label className="text-sm font-medium">Cơ sở vật chất</label>
                <StarRating category="facility" value={rating.facility} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <label className="text-sm font-medium">Đánh giá tổng thể</label>
                <StarRating category="overall" value={rating.overall} />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Nhận xét chi tiết</label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Chia sẻ trải nghiệm của bạn..."
                className="min-h-[120px]"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">Gửi đánh giá</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default FeedbackForm;
