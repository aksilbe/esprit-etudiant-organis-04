
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useForm, Controller } from 'react-hook-form';
import { Priority, CategoryId } from '@/types';
import { fr, enUS, es } from 'date-fns/locale';

type TaskFormProps = {
  onClose: () => void;
  taskId?: string;
};

type FormData = {
  title: string;
  description: string;
  dueDate: Date;
  priority: Priority;
  category: CategoryId;
};

export const TaskForm: React.FC<TaskFormProps> = ({ onClose, taskId }) => {
  const { t, language } = useLanguage();
  const { state, addTask, updateTask } = useData();
  
  const localeMap = {
    fr: fr,
    en: enUS,
    es: es,
  };
  
  const currentLocale = localeMap[language as keyof typeof localeMap] || enUS;
  
  const existingTask = taskId ? state.tasks.find(task => task.id === taskId) : null;
  
  const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>({
    defaultValues: existingTask
      ? {
          title: existingTask.title,
          description: existingTask.description || '',
          dueDate: new Date(existingTask.dueDate),
          priority: existingTask.priority,
          category: existingTask.category,
        }
      : {
          title: '',
          description: '',
          dueDate: new Date(),
          priority: 'medium',
          category: 'homework',
        },
  });
  
  const onSubmit = (data: FormData) => {
    if (existingTask) {
      updateTask({
        ...existingTask,
        title: data.title,
        description: data.description,
        dueDate: data.dueDate.toISOString(),
        priority: data.priority,
        category: data.category,
      });
    } else {
      addTask({
        title: data.title,
        description: data.description,
        dueDate: data.dueDate.toISOString(),
        priority: data.priority,
        category: data.category,
        completed: false,
      });
    }
    onClose();
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">{t('tasks.form.title')}</label>
        <Input
          {...register('title', { required: true })}
          placeholder={t('tasks.form.title')}
          className={errors.title ? 'border-red-500' : ''}
        />
        {errors.title && (
          <p className="text-xs text-red-500">{t('tasks.form.title')} {t('common.required')}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">{t('tasks.form.description')}</label>
        <Textarea
          {...register('description')}
          placeholder={t('tasks.form.description')}
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">{t('tasks.form.dueDate')}</label>
        <Controller
          control={control}
          name="dueDate"
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
                    <span>{t('tasks.form.dueDate')}</span>
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
                  weekStartsOn={1}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('tasks.form.priority')}</label>
          <Controller
            control={control}
            name="priority"
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('tasks.form.priority')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">{t('tasks.priority.low')}</SelectItem>
                  <SelectItem value="medium">{t('tasks.priority.medium')}</SelectItem>
                  <SelectItem value="high">{t('tasks.priority.high')}</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('tasks.form.category')}</label>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('tasks.form.category')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="homework">{t('tasks.categories.homework')}</SelectItem>
                  <SelectItem value="exam">{t('tasks.categories.exam')}</SelectItem>
                  <SelectItem value="project">{t('tasks.categories.project')}</SelectItem>
                  <SelectItem value="reading">{t('tasks.categories.reading')}</SelectItem>
                  <SelectItem value="other">{t('tasks.categories.other')}</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" type="button" onClick={onClose}>
          {t('tasks.form.cancel')}
        </Button>
        <Button type="submit">
          {t('tasks.form.submit')}
        </Button>
      </div>
    </form>
  );
};
