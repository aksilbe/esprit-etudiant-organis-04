import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useData } from '@/contexts/DataContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isToday, isSameMonth, isSameDay, parseISO, addDays, startOfDay, endOfDay } from 'date-fns';
import { fr, enUS, es } from 'date-fns/locale';
import { EventForm } from '@/components/calendar/EventForm';
import { cn } from '@/lib/utils';
import { Event } from '@/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const CalendarPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { state, updateEvent, deleteEvent } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [editEventId, setEditEventId] = useState<string | null>(null);
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  
  const localeMap = {
    fr: fr,
    en: enUS,
    es: es,
  };
  
  const currentLocale = localeMap[language as keyof typeof localeMap] || enUS;
  
  // Generate calendar days based on view mode
  const generateCalendarDays = () => {
    switch (viewMode) {
      case 'month': {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        const calendarStart = startOfWeek(monthStart, { locale: currentLocale, weekStartsOn: 1 });
        const calendarEnd = endOfWeek(monthEnd, { locale: currentLocale, weekStartsOn: 1 });
        
        return eachDayOfInterval({
          start: calendarStart,
          end: calendarEnd,
        });
      }
      case 'week': {
        const weekStart = startOfWeek(currentDate, { locale: currentLocale, weekStartsOn: 1 });
        const weekEnd = endOfWeek(currentDate, { locale: currentLocale, weekStartsOn: 1 });
        
        return eachDayOfInterval({
          start: weekStart,
          end: weekEnd,
        });
      }
      case 'day': {
        return [currentDate];
      }
      default:
        return [];
    }
  };
  
  const calendarDays = generateCalendarDays();
  
  const weekdays = Array.from({ length: 7 }).map((_, i) => {
    const day = (i + 1) % 7; // Start with Monday (1)
    return format(new Date(2023, 1, day + 1), viewMode === 'day' ? 'EEEE' : 'EEEEEE', { locale: currentLocale });
  });
  
  const goToToday = () => setCurrentDate(new Date());
  const goToPrevious = () => {
    switch (viewMode) {
      case 'month':
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
        break;
      case 'week':
        setCurrentDate(addDays(currentDate, -7));
        break;
      case 'day':
        setCurrentDate(addDays(currentDate, -1));
        break;
    }
  };
  
  const goToNext = () => {
    switch (viewMode) {
      case 'month':
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
        break;
      case 'week':
        setCurrentDate(addDays(currentDate, 7));
        break;
      case 'day':
        setCurrentDate(addDays(currentDate, 1));
        break;
    }
  };
  
  const eventsOnDay = (date: Date) => {
    return state.events.filter(event => isSameDay(parseISO(event.date), date));
  };
  
  const handleDayClick = (day: Date) => {
    setSelectedDay(day);
  };
  
  const handleCloseEventDetails = () => {
    setSelectedDay(null);
    setEditEventId(null);
  };
  
  const handleEditEvent = (eventId: string) => {
    setEditEventId(eventId);
  };
  
  const handleDeleteConfirmation = (eventId: string) => {
    setDeleteEventId(eventId);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDeleteEvent = () => {
    if (deleteEventId) {
      deleteEvent(deleteEventId);
      setIsDeleteDialogOpen(false);
      setDeleteEventId(null);
    }
  };

  const getViewTitle = () => {
    switch (viewMode) {
      case 'month':
        return format(currentDate, 'MMMM yyyy', { locale: currentLocale });
      case 'week':
        const weekStart = startOfWeek(currentDate, { locale: currentLocale, weekStartsOn: 1 });
        const weekEnd = endOfWeek(currentDate, { locale: currentLocale, weekStartsOn: 1 });
        return `${format(weekStart, 'd MMM', { locale: currentLocale })} - ${format(weekEnd, 'd MMM yyyy', { locale: currentLocale })}`;
      case 'day':
        return format(currentDate, 'PPPP', { locale: currentLocale });
      default:
        return '';
    }
  };
  
  const handleViewChange = (view: string) => {
    setViewMode(view as 'month' | 'week' | 'day');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">{t('app.calendar')}</h1>
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
      
      <Tabs value={viewMode} onValueChange={handleViewChange} className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <TabsList>
            <TabsTrigger value="month">{t('calendar.month')}</TabsTrigger>
            <TabsTrigger value="week">{t('calendar.week')}</TabsTrigger>
            <TabsTrigger value="day">{t('calendar.day')}</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToPrevious}>
              &#8592;
            </Button>
            <Button variant="outline" onClick={goToToday}>
              {t('calendar.today')}
            </Button>
            <Button variant="outline" size="sm" onClick={goToNext}>
              &#8594;
            </Button>
          </div>
        </div>
        
        <div className="text-center text-lg font-medium mb-4">
          {getViewTitle()}
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
                    "min-h-16 p-1 border rounded-md cursor-pointer hover:bg-accent/50 transition-colors",
                    !isSameMonth(day, currentDate) && "opacity-40",
                    isSameDay(day, selectedDay || new Date(0)) && "bg-accent/50",
                  )}
                  onClick={() => handleDayClick(day)}
                >
                  <div className="flex flex-col h-full">
                    <div 
                      className={cn(
                        "calendar-day inline-flex h-6 w-6 items-center justify-center text-sm",
                        isToday(day) && "today bg-primary text-primary-foreground rounded-full"
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

        <TabsContent value="week" className="mt-0">
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
                    "min-h-32 p-1 border rounded-md cursor-pointer hover:bg-accent/50 transition-colors",
                    isSameDay(day, selectedDay || new Date(0)) && "bg-accent/50",
                  )}
                  onClick={() => handleDayClick(day)}
                >
                  <div className="flex flex-col h-full">
                    <div 
                      className={cn(
                        "calendar-day inline-flex h-6 w-6 items-center justify-center text-sm",
                        isToday(day) && "today bg-primary text-primary-foreground rounded-full"
                      )}
                    >
                      {format(day, 'd')}
                    </div>
                    <div className="flex-1 overflow-auto mt-1">
                      {eventsOnDay(day).map(event => (
                        <div 
                          key={event.id}
                          className="text-xs p-1 mb-1 rounded truncate"
                          style={{ 
                            backgroundColor: event.color || '#3B82F6',
                            color: 'white'
                          }}
                        >
                          <div className="font-semibold">{event.title}</div>
                          {event.startTime && <div>{event.startTime}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="day" className="mt-0">
          <Card className="p-4">
            <div className="flex flex-col">
              <div className="text-center text-lg font-medium mb-4">
                {format(currentDate, 'EEEE, MMMM d', { locale: currentLocale })}
              </div>
              
              <div 
                className="min-h-[50vh] p-4 border rounded-md cursor-pointer"
                onClick={() => handleDayClick(currentDate)}
              >
                {eventsOnDay(currentDate).length > 0 ? (
                  <div className="space-y-2">
                    {eventsOnDay(currentDate).map(event => (
                      <div 
                        key={event.id}
                        className="p-2 rounded flex justify-between items-start"
                        style={{ 
                          backgroundColor: `${event.color}20` || '#3B82F620',
                          borderLeft: `4px solid ${event.color || '#3B82F6'}`
                        }}
                      >
                        <div>
                          <div className="font-semibold">{event.title}</div>
                          {event.description && <div className="text-sm text-muted-foreground">{event.description}</div>}
                          <div className="text-sm">
                            {event.startTime && event.endTime 
                              ? `${event.startTime} - ${event.endTime}` 
                              : event.startTime || ''}
                          </div>
                          {event.location && <div className="text-sm">{event.location}</div>}
                        </div>
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditEvent(event.id);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteConfirmation(event.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    {t('calendar.noEvents')}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Event details dialog */}
      <Dialog open={selectedDay !== null} onOpenChange={handleCloseEventDetails}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedDay && format(selectedDay, 'PPPP', { locale: currentLocale })}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            {selectedDay && eventsOnDay(selectedDay).length > 0 ? (
              eventsOnDay(selectedDay).map(event => (
                <div key={event.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{event.title}</h3>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleEditEvent(event.id)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteConfirmation(event.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  
                  {event.description && (
                    <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                  )}
                  
                  <div className="flex flex-col text-sm mt-2">
                    {event.startTime && (
                      <div className="text-muted-foreground">
                        {event.startTime}{event.endTime && ` - ${event.endTime}`}
                      </div>
                    )}
                    {event.location && (
                      <div className="text-muted-foreground">{event.location}</div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                {t('calendar.noEvents')}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Edit event dialog */}
      <Dialog open={editEventId !== null} onOpenChange={(open) => !open && setEditEventId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('calendar.editEvent')}</DialogTitle>
          </DialogHeader>
          {editEventId && (
            <EventForm 
              eventId={editEventId} 
              onClose={() => setEditEventId(null)} 
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('calendar.deleteEvent')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('calendar.deleteEventConfirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteEvent} className="bg-destructive text-destructive-foreground">
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CalendarPage;
