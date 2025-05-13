
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useData } from '@/contexts/DataContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isToday, isSameMonth, isSameDay, parseISO } from 'date-fns';
import { fr, enUS, es } from 'date-fns/locale';
import { EventForm } from '@/components/calendar/EventForm';
import { cn } from '@/lib/utils';

const CalendarPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { state } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  
  const localeMap = {
    fr: fr,
    en: enUS,
    es: es,
  };
  
  const currentLocale = localeMap[language as keyof typeof localeMap] || enUS;
  
  // Generate calendar days
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { locale: currentLocale });
  const calendarEnd = endOfWeek(monthEnd, { locale: currentLocale });
  
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });
  
  const weekdays = Array.from({ length: 7 }).map((_, i) => {
    const day = (i + (currentLocale.options?.weekStartsOn || 0)) % 7;
    return format(new Date(2023, 1, day + 1), 'EEEEEE', { locale: currentLocale });
  });
  
  const goToToday = () => setCurrentDate(new Date());
  const goToPreviousMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const goToNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  
  const hasEventOnDay = (date: Date) => {
    return state.events.some(event => isSameDay(parseISO(event.date), date));
  };
  
  const eventsOnDay = (date: Date) => {
    return state.events.filter(event => isSameDay(parseISO(event.date), date));
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">{t('calendar.today')}</h1>
        <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t('calendar.addEvent')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('calendar.addEvent')}</DialogTitle>
            </DialogHeader>
            <EventForm onClose={() => setIsAddEventOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="month" className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <TabsList>
            <TabsTrigger value="month">{t('calendar.month')}</TabsTrigger>
            <TabsTrigger value="week" disabled>{t('calendar.week')}</TabsTrigger>
            <TabsTrigger value="day" disabled>{t('calendar.day')}</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
              &#8592;
            </Button>
            <Button variant="outline" onClick={goToToday}>
              {t('calendar.today')}
            </Button>
            <Button variant="outline" size="sm" onClick={goToNextMonth}>
              &#8594;
            </Button>
          </div>
        </div>
        
        <div className="text-center text-lg font-medium mb-4">
          {format(currentDate, 'MMMM yyyy', { locale: currentLocale })}
        </div>
        
        <TabsContent value="month" className="mt-0">
          <Card className="p-4">
            <div className="grid grid-cols-7 gap-1">
              {weekdays.map((day, i) => (
                <div key={i} className="text-center text-sm font-medium py-1">
                  {day}
                </div>
              ))}
              
              {calendarDays.map((day, i) => (
                <div
                  key={i}
                  className={cn(
                    "min-h-16 p-1 border rounded-md",
                    !isSameMonth(day, currentDate) && "opacity-40",
                  )}
                >
                  <div className="flex flex-col h-full">
                    <div 
                      className={cn(
                        "calendar-day inline-flex h-6 w-6 items-center justify-center text-sm",
                        isToday(day) && "today"
                      )}
                    >
                      {format(day, 'd')}
                    </div>
                    <div className="flex-1 overflow-auto mt-1">
                      {eventsOnDay(day).slice(0, 2).map(event => (
                        <div 
                          key={event.id}
                          className="text-xs p-1 mb-1 rounded truncate"
                          style={{ 
                            backgroundColor: event.color || '#3B82F6',
                            color: 'white'
                          }}
                        >
                          {event.title}
                        </div>
                      ))}
                      {eventsOnDay(day).length > 2 && (
                        <div className="text-xs text-muted-foreground px-1">
                          +{eventsOnDay(day).length - 2} {t('common.more')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CalendarPage;
