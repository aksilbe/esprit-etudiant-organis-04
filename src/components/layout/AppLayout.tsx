
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="fixed left-0 top-0 h-full">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1 md:ml-64">
        <Header />
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
