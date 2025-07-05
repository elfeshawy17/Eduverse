import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import LectureItem from "@/components/course/LectureItem";
import AssignmentItem from "@/components/course/AssignmentItem";
import { 
  getCourseLectures, 
  getCourseDetails 
} from "@/utils/api";
import { BackendDetailedCourse, Lecture, Assignment } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Book, GraduationCap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const CoursePage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courseDetails, setCourseDetails] = useState<BackendDetailedCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("lectures");

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) return;
      
      setLoading(true);
      try {
        const [details, lecturesData] = await Promise.all([
          getCourseDetails(courseId),
          getCourseLectures(courseId, 1, 5)
        ]);
        
        setCourseDetails(details);
        setLectures(lecturesData);
        setAssignments(details.assignment.map(a => ({
          id: a._id,
          title: a.title,
          dueDate: a.duedate,
          fileUrl: a.fileUrl,
          status: undefined // or map if you have status
        })));
      } catch (error) {
        console.error("Failed to fetch course data:", error);
      } finally {
        setLoading(false);
        setTimeout(() => setContentVisible(true), 100);
      }
    };
    
    fetchCourseData();
  }, [courseId]);

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <Header />
      <main className="p-6 max-w-6xl mx-auto">
        {/* Back button and course details */}
        <div className={cn(
          "mb-8 transition-all duration-500 transform",
          contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <Link to="/">
            <Button 
              variant="ghost" 
              className="pl-0 mb-3 hover:translate-x-1 transition-transform"
            >
              <ArrowLeft size={18} className="mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="bg-white rounded-lg shadow-md p-6 mt-2">
            {loading || !courseDetails ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold mb-2 text-primary">{courseDetails.title}</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-text-secondary">
                  <div><span className="font-semibold">Course Code:</span> {courseDetails.courseCode}</div>
                  <div><span className="font-semibold">Hours:</span> {courseDetails.hours}</div>
                  <div><span className="font-semibold">Department:</span> {courseDetails.department}</div>
                  <div><span className="font-semibold">Professor:</span> {courseDetails.professor.name}</div>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Course content tabs */}
        <div
          className={cn(
            "transition-all duration-700 transform delay-100",
            contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <Tabs 
            defaultValue="lectures" 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="w-full"
          >
            <TabsList className="mb-6 bg-white p-1 shadow-sm">
              <TabsTrigger 
                value="lectures" 
                className="flex items-center data-[state=active]:bg-primary data-[state=active]:text-white"
                onClick={() => setActiveTab("lectures")}
              >
                <Book size={16} className="mr-2" />
                Lectures
              </TabsTrigger>
              <TabsTrigger 
                value="assignments" 
                className="flex items-center data-[state=active]:bg-primary data-[state=active]:text-white"
                onClick={() => setActiveTab("assignments")}
              >
                <FileText size={16} className="mr-2" />
                Assignments
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="lectures" className="space-y-4">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-accent/50 px-6 py-3 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-medium text-primary flex items-center">
                    <Book size={18} className="mr-2" />
                    Available Lectures
                  </h3>
                  {!loading && lectures.length > 0 && (
                    <span className="text-sm px-2 py-0.5 bg-primary/10 rounded-full text-primary">
                      {lectures.length} lectures
                    </span>
                  )}
                </div>
                
                {loading ? (
                  <div>
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="flex items-center justify-between py-4 px-6 border-b animate-pulse">
                        <div className="flex items-start">
                          <Skeleton className="w-10 h-10 rounded-lg mr-4" />
                          <div>
                            <Skeleton className="h-5 w-48 mb-2" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                        <Skeleton className="h-9 w-28" />
                      </div>
                    ))}
                  </div>
                ) : lectures.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {lectures.map((lecture, index) => (
                      <div key={lecture.id} 
                        className={cn(
                          "transition-all transform", 
                          activeTab === "lectures" && "animate-fade-in",
                          {
                            "delay-100": index === 0,
                            "delay-200": index === 1,
                            "delay-300": index === 2,
                            "delay-400": index >= 3,
                          }
                        )}
                      >
                        <LectureItem lecture={lecture} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <FileText size={40} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-text-secondary">No lectures available for this course yet.</p>
                    <p className="text-sm text-text-secondary mt-1">Check back later for updates.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="assignments" className="space-y-4">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-accent/50 px-6 py-3 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-medium text-primary flex items-center">
                    <FileText size={18} className="mr-2" />
                    Course Assignments
                  </h3>
                  {!loading && assignments.length > 0 && (
                    <span className="text-sm px-2 py-0.5 bg-primary/10 rounded-full text-primary">
                      {assignments.length} assignments
                    </span>
                  )}
                </div>
                
                {loading ? (
                  <div>
                    {Array.from({ length: 2 }).map((_, index) => (
                      <div key={index} className="flex items-center justify-between py-4 px-6 border-b animate-pulse">
                        <div className="flex items-start">
                          <Skeleton className="w-10 h-10 rounded-lg mr-4" />
                          <div>
                            <Skeleton className="h-5 w-64 mb-2" />
                            <Skeleton className="h-3 w-32 mb-2" />
                            <Skeleton className="h-5 w-20" />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Skeleton className="h-9 w-28" />
                          <Skeleton className="h-9 w-24" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : assignments.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {assignments.map((assignment, index) => (
                      <div key={assignment.id} 
                        className={cn(
                          "transition-all transform", 
                          activeTab === "assignments" && "animate-fade-in",
                          {
                            "delay-100": index === 0,
                            "delay-200": index === 1,
                            "delay-300": index >= 2,
                          }
                        )}
                      >
                        <AssignmentItem assignment={assignment} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <FileText size={40} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-text-secondary">No assignments available for this course yet.</p>
                    <p className="text-sm text-text-secondary mt-1">Check back later for updates.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default CoursePage;
