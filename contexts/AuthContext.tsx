// contexts/AuthContext.tsx
'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { authAPI, usersAPI } from '@/lib/api'
import { User, UpdateUserData, ChangePasswordData } from '@/lib/types'
import { toast } from '@/lib/toast-helper'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (data: SignupData) => Promise<void>
  logout: () => void
  updateProfile: (data: UpdateUserData) => Promise<void>
  changePassword: (data: ChangePasswordData) => Promise<void>
  deleteAccount: () => Promise<void>
  refreshUser: () => Promise<void>
  isAuthenticated: boolean
}

interface SignupData {
  name: string
  email: string
  password: string
  passwordConfirm: string
  phone?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token')

      if (token) {
        if (!Cookies.get('token')) {
          Cookies.set('token', token, { expires: 7 })
        }

        // ✅ استخدم usersAPI.getMe بدل authAPI.getLoggedUser
        const userData = await usersAPI.getMe()
        setUser(userData)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      Cookies.remove('token')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password })

      const res = response as any
      const token = res.token
      const userData = res.data

      if (token) {
        localStorage.setItem('token', token)
        Cookies.set('token', token, { expires: 7, path: '/' })
      }

      setUser(userData)

      toast.success('تم تسجيل الدخول بنجاح! 🎉')

      router.push('/')
      router.refresh()
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'فشل تسجيل الدخول'
      toast.error(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const signup = async (data: SignupData) => {
    try {
      const response = await authAPI.signup(data)

      const res = response as any
      const token = res.token
      const userData = res.data

      if (token) {
        localStorage.setItem('token', token)
        Cookies.set('token', token, { expires: 7, path: '/' })
      }

      setUser(userData)

      toast.success('تم إنشاء الحساب بنجاح! 🎉')

      router.push('/')
      router.refresh()
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'فشل إنشاء الحساب'
      toast.error(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const logout = () => {
    try {
      authAPI.logout()
    } catch (e) {
      console.error(e)
    }

    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    Cookies.remove('token', { path: '/' })

    toast.success('تم تسجيل الخروج بنجاح 👋')

    router.push('/login')
    router.refresh()
  }

  // ✅ Update Profile Function
  const updateProfile = async (data: UpdateUserData) => {
    try {
      const updatedUser = await usersAPI.updateMe(data)
      setUser(updatedUser)
      toast.success('تم تحديث البيانات بنجاح! ✅')
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'فشل تحديث البيانات'
      toast.error(errorMessage)
      throw new Error(errorMessage)
    }
  }

  // ✅ Change Password Function
  const changePassword = async (data: ChangePasswordData) => {
    try {
      const response = await usersAPI.changeMyPassword(data)
      setUser(response.data)
      toast.success('تم تغيير كلمة المرور بنجاح! 🔒')
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'فشل تغيير كلمة المرور'
      toast.error(errorMessage)
      throw new Error(errorMessage)
    }
  }

  // ✅ Delete Account Function
  const deleteAccount = async () => {
    try {
      await usersAPI.deleteMe()

      setUser(null)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      Cookies.remove('token', { path: '/' })

      toast.success('تم حذف الحساب بنجاح')

      router.push('/')
      router.refresh()
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'فشل حذف الحساب'
      toast.error(errorMessage)
      throw new Error(errorMessage)
    }
  }

  // ✅ Refresh User Function
  const refreshUser = async () => {
    try {
      const userData = await usersAPI.getMe()
      setUser(userData)
    } catch (error) {
      console.error('Failed to refresh user:', error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        updateProfile,
        changePassword,
        deleteAccount,
        refreshUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
