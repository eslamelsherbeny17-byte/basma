'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';

interface Admin {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'superadmin';
  avatar?: string;
}

interface AdminAuthContextType {
  admin: Admin | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Setup axios interceptor for admin token
  useEffect(() => {
    const token = Cookies.get('adminToken');
    if (token) {
      axios.defaults.headers.common['X-Admin-Token'] = token;
    }
  }, [admin]);

  const checkAuth = async () => {
    const token = Cookies.get('adminToken');
    
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get('/api/admin/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setAdmin(response.data.admin);
    } catch (error) {
      console.error('Admin auth check failed:', error);
      Cookies.remove('adminToken');
      setAdmin(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('/api/admin/login', {
        email,
        password,
      });

      const { token, admin: adminData } = response.data;

      // Set token in cookies (7 days)
      Cookies.set('adminToken', token, { expires: 7 });
      
      // Set axios default header
      axios.defaults.headers.common['X-Admin-Token'] = token;
      
      setAdmin(adminData);

      toast({
        title: 'تم تسجيل الدخول بنجاح',
        description: `مرحباً ${adminData.name}`,
      });

      router.push('/admin/dashboard');
    } catch (error: any) {
      console.error('Admin login error:', error);
      toast({
        title: 'خطأ في تسجيل الدخول',
        description: error.response?.data?.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove('adminToken');
    delete axios.defaults.headers.common['X-Admin-Token'];
    setAdmin(null);
    router.push('/admin/login');
    
    toast({
      title: 'تم تسجيل الخروج',
      description: 'نراك قريباً',
    });
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isLoading,
        isAuthenticated: !!admin,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
}
