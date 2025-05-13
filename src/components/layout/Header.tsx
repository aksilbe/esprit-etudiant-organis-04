
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

export const Header: React.FC = () => {
  const { t } = useLanguage();
  
  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    const sidebar = document.getElementById('app-sidebar');
    if (sidebar) {
      sidebar.classList.toggle('hidden');
    }
  };
  
  return (
    <header className="bg-background border-b p-4 flex items-center justify-between">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={toggleSidebar}
      >
        <Menu className="h-5 w-5" />
      </Button>
      <div className="ml-auto flex items-center space-x-4">
        <LanguageSwitcher />
      </div>
    </header>
  );
};
