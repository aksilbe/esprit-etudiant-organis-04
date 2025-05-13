
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useForm, Controller } from 'react-hook-form';
import { fr, enUS, es } from 'date-fns/locale';

type EventFormProps = {
  onClose: () => void;
  eventId?: string;
};

type FormData = {
  title: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  color: string;
};

export const EventForm: React.FC<EventFormProps> = ({ onClose, eventId }) => {
  const { t, language } = useLanguage();
  const { state, addEvent, updateEvent } = useData();
  
  const localeMap = {
    fr: fr,
    en: enUS,
    es: es,
  };
  
  const currentLocale = localeMap[language as keyof typeof localeMap] || enUS;
  
  const existingEvent = eventId ? state.events.find(event => event.id === eventId) : null;
  
  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: existingEvent
      ? {
          title: existingEvent.title,
          description: existingEvent.description || '',
          date: new Date(existingEvent.date),
          startTime: existingEvent.startTime || '',
          endTime: existingEvent.endTime || '',
          location: existingEvent.location || '',
          color: existingEvent.color || '#3B82F6',
        }
      : {
          title: '',
          description: '',
          date: new Date(),
          startTime: '',
          endTime: '',
          location: '',
          color: '#3B82F6',
        },
  });
  
  const currentColor = watch('color');
  
  const onSubmit = (data: FormData) => {
    if (existingEvent) {
      updateEvent({
        ...existingEvent,
        title: data.title,
        description: data.description,
        date: data.date.toISOString(),
        startTime: data.startTime,
        endTime: data.endTime,
        location: data.location,
        color: data.color,
      });
    } else {
      addEvent({
        title: data.title,
        description: data.description,
        date: data.date.toISOString(),
        startTime: data.startTime,
        endTime: data.endTime,
        location: data.location,
        color: data.color,
      });
    }
    onClose();
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">{t('calendar.event.title')}</label>
        <Input
          {...register('title', { required: true })}
          placeholder={t('calendar.event.title')}
          className={errors.title ? 'border-red-500' : ''}
        />
        {errors.title && (
          <p className="text-xs text-red-500">{t('calendar.event.title')} {t('common.required')}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">{t('calendar.event.description')}</label>
        <Textarea
          {...register('description')}
          placeholder={t('calendar.event.description')}
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">{t('calendar.event.date')}</label>
        <Controller
          control={control}
          name="date"
          render={({ field }) => (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value ? (
                    format(field.value, "PP", { locale: currentLocale })
                  ) : (
                    <span>{t('calendar.event.date')}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  initialFocus
                  locale={currentLocale}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('calendar.event.startTime')}</label>
          <Input
            type="time"
            {...register('startTime')}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('calendar.event.endTime')}</label>
          <Input
            type="time"
            {...register('endTime')}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">{t('calendar.event.location')}</label>
        <Input
          {...register('location')}
          placeholder={t('calendar.event.location')}
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Color</label>
        <div className="flex gap-2">
          {['#3B82F6', '#EF4444', '#8B5CF6', '#10B981', '#F59E0B'].map(color => (
            <div 
              key={color} 
              className={cn(
                'h-8 w-8 rounded-full cursor-pointer transition-all',
                currentColor === color ? 'ring-2 ring-offset-2 ring-primary' : ''
              )}
              style={{ backgroundColor: color }}
              onClick={() => setValue('color', color, { shouldValidate: true })}
            />
          ))}
          <Input
            type="color"
            {...register('color')}
            className="w-8 h-8 p-0 overflow-hidden"
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" type="button" onClick={onClose}>
          {t('calendar.event.cancel')}
        </Button>
        <Button type="submit">
          {t('calendar.event.submit')}
        </Button>
      </div>
    </form>
  );
};
