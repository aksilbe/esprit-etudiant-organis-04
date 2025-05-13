
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useData } from '@/contexts/DataContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { format, isToday, parseISO, isAfter, isFuture } from 'date-fns';
import { Search, Plus, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TaskFilter, Task } from '@/types';
import { TaskForm } from '@/components/tasks/TaskForm';
import { Badge } from '@/components/ui/badge';

const TasksPage: React.FC = () => {
  const { t } = useLanguage();
  const { state, toggleTaskCompletion, setTaskFilter } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  
  const filteredTasks = state.tasks.filter(task => {
    // Search filter
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Status filter
    switch (state.taskFilter) {
      case 'today':
        return isToday(parseISO(task.dueDate));
      case 'upcoming':
        return isFuture(parseISO(task.dueDate)) && !isToday(parseISO(task.dueDate));
      case 'completed':
        return task.completed;
      default:
        return true;
    }
  }).sort((a, b) => {
    // Sort by due date, then by priority
    const dateA = parseISO(a.dueDate);
    const dateB = parseISO(b.dueDate);
    
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    if (dateA.getTime() !== dateB.getTime()) {
      return dateA.getTime() - dateB.getTime();
    }
    
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
  
  const getPriorityColor = (task: Task) => {
    if (task.completed) return "bg-gray-300";
    
    const dueDate = parseISO(task.dueDate);
    const isOverdue = !isFuture(dueDate) && !isToday(dueDate);
    
    if (isOverdue) return "bg-red-500";
    
    switch (task.priority) {
      case 'high': return "bg-red-500";
      case 'medium': return "bg-yellow-500";
      case 'low': return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };
  
  const getCategoryColor = (categoryId: string) => {
    const category = state.categories.find(c => c.id === categoryId);
    return category?.color || '#6B7280';
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">{t('tasks.title')}</h1>
        <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t('tasks.add')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('tasks.add')}</DialogTitle>
            </DialogHeader>
            <TaskForm onClose={() => setIsAddTaskOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('tasks.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select
          value={state.taskFilter}
          onValueChange={(value: TaskFilter) => setTaskFilter(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('tasks.filter')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('tasks.all')}</SelectItem>
            <SelectItem value="today">{t('tasks.today')}</SelectItem>
            <SelectItem value="upcoming">{t('tasks.upcoming')}</SelectItem>
            <SelectItem value="completed">{t('tasks.completed')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <Card key={task.id} className={`p-4 ${task.completed ? 'opacity-70' : ''}`}>
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTaskCompletion(task.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${getPriorityColor(task)}`}></span>
                    <span className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {task.title}
                    </span>
                    <Badge
                      style={{ backgroundColor: getCategoryColor(task.category) }}
                      className="text-white ml-auto"
                    >
                      {t(`tasks.categories.${task.category}`)}
                    </Badge>
                  </div>
                  {task.description && (
                    <p className="text-sm text-muted-foreground mt-2">{task.description}</p>
                  )}
                  <div className="flex items-center text-xs text-muted-foreground mt-3">
                    <Calendar className="h-3 w-3 mr-1" />
                    {format(parseISO(task.dueDate), 'PPP')}
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">{t('tasks.empty')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksPage;
