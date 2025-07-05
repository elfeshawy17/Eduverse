import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, DollarSign, Calendar } from 'lucide-react';
import axios, { AxiosError } from 'axios';
import { getValidatedToken } from '../../utils/auth';

interface PaymentConfig {
  _id?: string;
  hourRate: number;
  term: number;
  createdAt?: string;
  updatedAt?: string;
}

const PaymentConfigForm = () => {
  const [config, setConfig] = useState<PaymentConfig>({ hourRate: 0, term: 1 });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      setMessage(null);
      
      const token = getValidatedToken();
      if (!token) {
        setMessage({ type: 'error', text: 'Authentication token not found' });
        return;
      }

      const response = await axios.get('/api/paymentConfig', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success === 'SUCCESS' && response.data.data) {
        setConfig(response.data.data);
      } else if (response.data.success === 'SUCCESS' && !response.data.data) {
        // No config found, use defaults
        setConfig({ hourRate: 0, term: 1 });
        setMessage({ type: 'error', text: response.data.message || 'No payment configuration found. Please create one.' });
      }
    } catch (error) {
      console.error('Error loading config:', error);
      const axiosError = error as AxiosError;
      const errorMessage = axiosError.response?.data && typeof axiosError.response.data === 'object' && 'message' in axiosError.response.data 
        ? (axiosError.response.data as { message: string }).message 
        : 'Failed to load payment configuration';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    
    try {
      const token = getValidatedToken();
      if (!token) {
        setMessage({ type: 'error', text: 'Authentication token not found' });
        return;
      }

      const response = await axios.post('/api/paymentConfig', {
        hourRate: parseFloat(config.hourRate.toString()),
        term: parseInt(config.term.toString())
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success === 'SUCCESS') {
        setConfig(response.data.data);
        setMessage({ type: 'success', text: response.data.message || 'Configuration updated successfully!' });
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Failed to update configuration' });
      }
    } catch (error) {
      console.error('Error updating config:', error);
      const axiosError = error as AxiosError;
      const errorMessage = axiosError.response?.data && typeof axiosError.response.data === 'object' && 'message' in axiosError.response.data 
        ? (axiosError.response.data as { message: string }).message 
        : 'Error updating configuration';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Payment Configuration
          </CardTitle>
          <CardDescription>Manage payment settings and rates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading configuration...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Payment Configuration
        </CardTitle>
        <CardDescription>Manage payment settings and rates</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={updateConfig} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hourRate">Hour Rate ($)</Label>
              <Input
                id="hourRate"
                type="number"
                step="0.01"
                min="0"
                value={config.hourRate}
                onChange={(e) => setConfig({ ...config, hourRate: parseFloat(e.target.value) || 0 })}
                placeholder="Enter hourly rate"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="term">Current Term</Label>
              <Select
                value={config.term.toString()}
                onValueChange={(value) => setConfig({ ...config, term: parseInt(value) })}
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

          {message && (
            <Alert className={message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={saving} className="w-full">
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Calendar className="mr-2 h-4 w-4" />
                Update Configuration
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentConfigForm; 