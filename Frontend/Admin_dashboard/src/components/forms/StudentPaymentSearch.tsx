import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, User, BookOpen, DollarSign, Calendar, CheckCircle, XCircle } from 'lucide-react';
import axios, { AxiosError } from 'axios';
import { getValidatedToken } from '../../utils/auth';

interface Student {
  _id: string;
  name: string;
  email: string;
  level: number;
}

interface Course {
  _id: string;
  title: string;
  hours: number;
}

interface PaymentRecord {
  _id: string;
  student: Student;
  orderId: string;
  level: number;
  term: number;
  courses: Course[];
  totalHours: number;
  hourRate: number;
  totalAmount: number;
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
}

const StudentPaymentSearch = () => {
  const [searchForm, setSearchForm] = useState({
    name: '',
    level: '',
    term: ''
  });
  const [searchResult, setSearchResult] = useState<PaymentRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setSearchResult(null);
    
    try {
      const token = getValidatedToken();
      if (!token) {
        setMessage({ type: 'error', text: 'Authentication token not found' });
        return;
      }

      const queryParams = new URLSearchParams({
        name: searchForm.name,
        level: searchForm.level,
        term: searchForm.term
      });
      
      const response = await axios.get(`/api/payment/admin/search?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.status === 'SUCCESS') {
        if (response.data.data) {
          setSearchResult(response.data.data);
        } else {
          setMessage({ type: 'error', text: response.data.message || 'No payment record found for this student.' });
        }
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Search failed' });
      }
    } catch (error) {
      console.error('Error searching for payment:', error);
      const axiosError = error as AxiosError;
      const errorMessage = axiosError.response?.data && typeof axiosError.response.data === 'object' && 'message' in axiosError.response.data 
        ? (axiosError.response.data as { message: string }).message 
        : 'Error searching for payment';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search Student Payment
        </CardTitle>
        <CardDescription>Find student payment records by name, level, and term</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="studentName">Student Name</Label>
              <Input
                id="studentName"
                type="text"
                value={searchForm.name}
                onChange={(e) => setSearchForm({ ...searchForm, name: e.target.value })}
                placeholder="Enter student name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Select
                value={searchForm.level}
                onValueChange={(value) => setSearchForm({ ...searchForm, level: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Level 0</SelectItem>
                  <SelectItem value="1">Level 1</SelectItem>
                  <SelectItem value="2">Level 2</SelectItem>
                  <SelectItem value="3">Level 3</SelectItem>
                  <SelectItem value="4">Level 4</SelectItem>
                  <SelectItem value="5">Level 5</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="term">Term</Label>
              <Select
                value={searchForm.term}
                onValueChange={(value) => setSearchForm({ ...searchForm, term: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Term 1</SelectItem>
                  <SelectItem value="2">Term 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Search Payment
              </>
            )}
          </Button>
        </form>

        {message && (
          <Alert className={message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
            <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}
        
        {searchResult && (
          <div className="mt-6 space-y-6">
            <div className="border rounded-lg p-6 bg-gray-50">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                Payment Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Student:</span>
                    <span>{searchResult.student.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Email:</span>
                    <span>{searchResult.student.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Level:</span>
                    <Badge variant="secondary">Level {searchResult.level}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Term:</span>
                    <Badge variant="outline">Term {searchResult.term}</Badge>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Total Hours:</span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {searchResult.totalHours}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Hour Rate:</span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {searchResult.hourRate}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Total Amount:</span>
                    <span className="flex items-center gap-1 font-semibold text-green-600">
                      <DollarSign className="h-4 w-4" />
                      {searchResult.totalAmount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Payment Status:</span>
                    <Badge variant={searchResult.isPaid ? "default" : "destructive"} className="flex items-center gap-1">
                      {searchResult.isPaid ? (
                        <>
                          <CheckCircle className="h-3 w-3" />
                          Paid
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3" />
                          Unpaid
                        </>
                      )}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Created: {formatDate(searchResult.createdAt)}</span>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Enrolled Courses
              </h4>
              <div className="space-y-3">
                {searchResult.courses.map(course => (
                  <div key={course._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{course.title}</span>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      {course.hours} hours
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentPaymentSearch; 