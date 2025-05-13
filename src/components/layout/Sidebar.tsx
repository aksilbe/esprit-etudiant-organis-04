
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Calendar, CheckSquare, LayoutDashboard, Settings, Clock } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { Link, useLocation } from 'react-router-dom';

export const Sidebar: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const currentPath = location.pathname;
  
  const navigation = [
    {
      name: t('app.dashboard'),
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: t('app.tasks'),
      path: "/tasks",
      icon: CheckSquare,
    },
    {
      name: t('app.calendar'),
      path: "/calendar",
      icon: Calendar,
    },
    {
      name: t('app.pomodoro'),
      path: "/pomodoro",
      icon: Clock,
    },
    {
      name: t('app.settings'),
      path: "/settings",
      icon: Settings,
    },
  ];
  
  return (
    <aside
      id="app-sidebar"
      className="hidden md:flex flex-col w-64 bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 backdrop-blur-sm border-r border-slate-200/50 dark:border-slate-700/50 shadow-lg"
    >
      <div className="p-6 flex justify-center items-center border-b border-slate-200/50 dark:border-slate-700/50">
        <Link to="/dashboard" className="inline-block transition-transform hover:scale-105">
          <Logo />
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto p-3">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={cn(
              'flex items-center gap-3 px-3 py-3 rounded-lg my-1.5 font-medium w-full transition-all duration-200',
              currentPath === item.path
                ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg'
                : 'hover:bg-white/50 hover:text-slate-800 text-slate-600 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};
