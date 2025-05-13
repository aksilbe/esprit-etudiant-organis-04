
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Calendar, CheckSquare, LayoutDashboard, Settings, Clock } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();
  
  const navigation = [
    {
      name: t('app.dashboard'),
      href: '/',
      icon: LayoutDashboard,
    },
    {
      name: t('app.tasks'),
      href: '/tasks',
      icon: CheckSquare,
    },
    {
      name: t('app.calendar'),
      href: '/calendar',
      icon: Calendar,
    },
    {
      name: t('app.pomodoro'),
      href: '/pomodoro',
      icon: Clock,
    },
    {
      name: t('app.settings'),
      href: '/settings',
      icon: Settings,
    },
  ];
  
  return (
    <aside
      id="app-sidebar"
      className="hidden md:flex flex-col w-64 bg-sidebar border-r"
    >
      <div className="p-4">
        <h1 className="text-2xl font-bold text-primary">{t('app.title')}</h1>
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg my-1 font-medium',
              location.pathname === item.href
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
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
