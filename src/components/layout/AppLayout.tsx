
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

interface AppLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, currentPage, setCurrentPage }) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-background to-background/90">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-4 sm:p-6 overflow-auto animate-fade-in">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
