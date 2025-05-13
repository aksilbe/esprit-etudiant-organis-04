
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Calendar, CheckSquare, LayoutDashboard, Settings, Clock } from 'lucide-react';
import { Logo } from '@/components/Logo';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
  const { t } = useLanguage();
  
  const navigation = [
    {
      name: t('app.dashboard'),
      id: "dashboard",
      icon: LayoutDashboard,
    },
    {
      name: t('app.tasks'),
      id: "tasks",
      icon: CheckSquare,
    },
    {
      name: t('app.calendar'),
      id: "calendar",
      icon: Calendar,
    },
    {
      name: t('app.pomodoro'),
      id: "pomodoro",
      icon: Clock,
    },
    {
      name: t('app.settings'),
      id: "settings",
      icon: Settings,
    },
  ];
  
  return (
    <aside
      id="app-sidebar"
      className="hidden md:flex flex-col w-64 bg-sidebar/90 backdrop-blur-sm border-r border-sidebar-border shadow-lg"
    >
      <div className="p-6 flex justify-center items-center border-b border-sidebar-border">
        <button 
          onClick={() => setCurrentPage("dashboard")} 
          className="inline-block transition-transform hover:scale-105"
        >
          <Logo />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto p-3">
        {navigation.map((item) => (
          <button
            key={item.name}
            onClick={() => setCurrentPage(item.id)}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg my-1.5 font-medium w-full transition-all duration-200',
              currentPage === item.id
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};
