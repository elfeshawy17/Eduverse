import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import React from "react"; // Add React import for CSSProperties

interface CourseCardProps {
  id: string;
  title: string;
  totalHours: number;
  imageUrl: string;
  className?: string;
  style?: React.CSSProperties; // Add style prop
}

const CourseCard = ({ id, title, totalHours, imageUrl, className, style }: CourseCardProps) => {
  const navigate = useNavigate();

  const handleViewCourse = () => {
    navigate(`/eduverse/professor/courses/${id}`);
  };

  return (
    <Card 
      className={cn("w-full h-full flex flex-col overflow-hidden card-shadow animate-slide-in", className)} 
      style={style}
    >
      <div className="h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover" 
        />
      </div>
      <CardContent className="pt-6 flex-grow">
        <h3 className="text-xl font-bold mb-2 text-dark-gray line-clamp-2">{title}</h3>
        <p className="text-medium-gray">Total Hours: {totalHours}</p>
      </CardContent>
      <CardFooter className="pb-6 mt-auto">
        <Button 
          onClick={handleViewCourse} 
          className="w-full bg-primary text-white btn-hover"
        >
          View
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
