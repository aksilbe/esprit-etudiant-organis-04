
import React, { useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format, isToday, isFuture, parseISO, isBefore, addDays, subDays } from 'date-fns';
import { Link } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
import { Task } from '@/types';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const { state, toggleTaskCompletion } = useData();
  
  const upcomingTasks = state.tasks
    .filter(task => !task.completed && (isToday(parseISO(task.dueDate)) || isFuture(parseISO(task.dueDate))))
    .sort((a, b) => parseISO(a.dueDate).getTime() - parseISO(b.dueDate).getTime())
    .slice(0, 5);
    
  const upcomingEvents = state.events
    .filter(event => isToday(parseISO(event.date)) || isFuture(parseISO(event.date)))
    .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
    .slice(0, 3);
    
  const completedTasksCount = state.tasks.filter(task => task.completed).length;
  const pendingTasksCount = state.tasks.filter(task => !task.completed).length;
  
  // Prepare data for charts
  const categoryData = useMemo(() => {
    const categoryCounts: Record<string, number> = {};
    
    state.tasks.forEach(task => {
      if (!categoryCounts[task.category]) {
        categoryCounts[task.category] = 0;
      }
      categoryCounts[task.category]++;
    });
    
    return Object.entries(categoryCounts).map(([category, count]) => ({
      name: t(`tasks.categories.${category}`),
      value: count,
      color: state.categories.find(c => c.id === category)?.color || '#6B7280',
    }));
  }, [state.tasks, state.categories, t]);
  
  // Timeline data for last 7 days
  const timelineData = useMemo(() => {
    const today = new Date();
    const dates = Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i));
    
    return dates.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const completedCount = state.tasks.filter(task => {
        const taskDate = parseISO(task.dueDate);
        return task.completed && format(taskDate, 'yyyy-MM-dd') === dateStr;
      }).length;
      
      return {
        date: format(date, 'dd MMM'),
        completed: completedCount,
      };
    });
  }, [state.tasks]);
  
  const getPriorityColor = (task: Task) => {
    if (task.completed) return "bg-gray-300";
    
    const dueDate = parseISO(task.dueDate);
    const isOverdue = isBefore(dueDate, new Date()) && !isToday(dueDate);
    
    if (isOverdue) return "bg-red-500";
    
    switch (task.priority) {
      case 'high': return "bg-red-500";
      case 'medium': return "bg-yellow-500";
      case 'low': return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('dashboard.welcome')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.tasks.title')}</CardTitle>
            <CardDescription>
              {upcomingTasks.length === 0 && t('dashboard.tasks.empty')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingTasks.length > 0 ? (
              <div className="space-y-3">
                {upcomingTasks.map(task => (
                  <div key={task.id} className="flex items-start gap-2">
                    <Checkbox 
                      checked={task.completed}
                      onCheckedChange={() => toggleTaskCompletion(task.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${getPriorityColor(task)}`}></span>
                        <span className={task.completed ? "line-through text-muted-foreground" : ""}>
                          {task.title}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {isToday(parseISO(task.dueDate)) 
                          ? t('tasks.today') 
                          : format(parseISO(task.dueDate), 'PP')}
                      </p>
                    </div>
                  </div>
                ))}
                <Link to="/tasks">
                  <Button variant="link" size="sm" className="mt-2 px-0">
                    {t('dashboard.tasks.all')}
                  </Button>
                </Link>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">{t('dashboard.tasks.empty')}</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.events.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length > 0 ? (
              <div className="space-y-3">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="flex flex-col">
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {format(parseISO(event.date), 'PP')}
                      {event.startTime && ` • ${event.startTime}`}
                    </div>
                    {event.location && (
                      <div className="text-xs text-muted-foreground">{event.location}</div>
                    )}
                  </div>
                ))}
                <Link to="/calendar">
                  <Button variant="link" size="sm" className="mt-2 px-0">
                    {t('dashboard.events.all')}
                  </Button>
                </Link>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">{t('dashboard.events.empty')}</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.stats.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  {t('dashboard.stats.tasksCompleted')}
                </div>
                <div className="text-2xl font-bold">{completedTasksCount}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  {t('dashboard.stats.tasksRemaining')}
                </div>
                <div className="text-2xl font-bold">{pendingTasksCount}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Timeline Chart */}
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.charts.completedTasks')}</CardTitle>
            <CardDescription>{t('dashboard.charts.completedTasksDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={timelineData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                    name={t('dashboard.charts.completed')}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Category Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.charts.taskCategories')}</CardTitle>
            <CardDescription>{t('dashboard.charts.taskCategoriesDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
