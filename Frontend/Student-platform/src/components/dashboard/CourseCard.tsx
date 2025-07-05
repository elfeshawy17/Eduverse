import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Course } from "@/types";
import { User, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  // Default image if none provided
  const imageUrl = "https://i.pinimg.com/736x/04/1c/5d/041c5db7ddba929d535e1f419904addc.jpg";
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Link to={`/course/${course.id}`}>
      <Card 
        className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col transform hover:-translate-y-2 hover:border-primary/20 group bg-white hover:bg-gradient-to-b hover:from-white hover:to-blue-50/30"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="h-40 overflow-hidden relative">
          <img
            src={imageUrl}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Shimmer effect on hover */}
          <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          
          {/* Hover reveal badge */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 group-hover:animate-float">
            <div className="flex items-center gap-1 bg-primary/90 text-white px-2 py-1 rounded-full text-xs shadow-md">
              <BookOpen size={12} />
              <span>View Course</span>
            </div>
          </div>
        </div>
        <CardContent className="pt-6 pb-2 flex-1 flex flex-col justify-between transition-colors duration-300">
          <div>
            <h3 className="font-medium text-lg mb-2 text-text-primary transition-colors duration-200 group-hover:text-primary">{course.title}</h3>
            <div className="flex items-center text-sm text-text-secondary mb-1 transition-all duration-300 group-hover:translate-x-1">
              <User size={16} className="mr-2 group-hover:text-primary transition-colors duration-300" />
              <span>{course.professor}</span>
            </div>
            <div className="flex items-center text-xs text-text-secondary">
              <svg className="w-4 h-4 mr-1 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{course.totalHours ?? '-'} hours</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-2 pb-4 transition-colors duration-300">
          <div className={cn(
            "text-xs px-3 py-1.5 rounded-full transition-all duration-300 shadow-sm transform-gpu",
            isHovered ? 
              "bg-gradient-to-r from-primary via-blue-400 to-primary bg-[length:200%_100%] animate-shine text-white" : 
              "bg-accent text-primary"
          )}>
            Continue Learning
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default CourseCard;
