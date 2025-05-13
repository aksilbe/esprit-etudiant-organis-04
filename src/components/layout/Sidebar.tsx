
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
      className="hidden md:flex flex-col w-64 bg-gradient-to-b from-slate-800 to-slate-900 backdrop-blur-sm border-r border-slate-700/50 shadow-xl"
    >
      <div className="p-6 flex justify-center items-center border-b border-slate-700/50">
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
              'flex items-center gap-3 px-3 py-3 rounded-lg my-1.5 font-medium w-full transition-all duration-200',
              currentPage === item.id
                ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg'
                : 'hover:bg-white/10 hover:text-white text-slate-300'
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
