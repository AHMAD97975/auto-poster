import React, { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';

interface AuthFormProps {
  onLogin: (email: string) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
        alert("يرجى ملء جميع الحقول");
        return;
    }
    
    setIsLoading(true);
    // Simulate API call delay for better UX
    setTimeout(() => {
        setIsLoading(false);
        onLogin(email);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8" dir="rtl">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="h-12 w-12 bg-indigo-600 rounded-lg flex items-center justify-center mx-auto shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
            أو{' '}
            <button onClick={() => setIsLogin(!isLogin)} className="font-medium text-indigo-600 hover:text-indigo-500">
                {isLogin ? 'ابدأ تجربتك المجانية' : 'سجل دخولك لحسابك'}
            </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input 
                label="البريد الإلكتروني" 
                type="email" 
                autoComplete="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
            />

            <Input 
                label="كلمة المرور" 
                type="password" 
                autoComplete="current-password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
            />

            <div>
              <Button type="submit" className="w-full" isLoading={isLoading}>
                {isLogin ? 'دخول' : 'إنشاء حساب'}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-400">نظام محاكاة الدخول</span>
              </div>
            </div>
            <div className="mt-2 text-center text-xs text-gray-400">
                يمكنك استخدام أي بريد إلكتروني وكلمة مرور للتجربة
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};