import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import CourseCard from "@/components/CourseCard";
import { api } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Course {
  _id: string;
  title: string;
  courseCode: string;
  department: string;
  hours: number;
  professor: {
    _id: string;
    name: string;
    courses: string[];
  };
  lecture: Array<{
    _id: string;
    title: string;
    fileUrl: string;
    course: {
      _id: string;
      title: string;
      professor: {
        _id: string;
        name: string;
        courses: string[];
      };
    };
  }>;
  assignment: Array<{
    _id: string;
    title: string;
    fileUrl: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

const Home = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [totalCourses, setTotalCourses] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();
  const [selectedLectureId, setSelectedLectureId] = useState<string>("");
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoaded(false);
        
        // Use the configured api instance instead of axios directly
        const [coursesResponse, countResponse] = await Promise.all([
          api.get("/courses/professor"),
          api.get("/courses/professor/count")
        ]);
        
        setCourses(coursesResponse.data.data);
        setTotalCourses(countResponse.data.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast({
          title: "Error",
          description: "Failed to load courses. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoaded(true);
      }
    };

    fetchData();
  }, [toast]);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="mb-8 animate-slide-in">
          <h1 className="text-2xl font-bold text-dark-gray">Dashboard</h1>
          <p className="text-medium-gray">
            Welcome back! You are managing {totalCourses} courses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
          {courses.map((course, index) => (
            <div
              key={course._id}
              className={cn(
                "transform transition-all duration-500",
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
              style={{
                transitionDelay: `${index * 100}ms`,
              }}
            >
              <CourseCard
                id={course._id}
                title={course.title}
                totalHours={course.hours}
                imageUrl="https://i.pinimg.com/736x/04/1c/5d/041c5db7ddba929d535e1f419904addc.jpg"
                className="hover:scale-[1.02] transition-transform duration-300"
              />
            </div>
          ))}
        </div>

        {!isLoaded && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Home;
