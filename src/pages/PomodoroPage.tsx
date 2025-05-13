
import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { PomodoroMode, PomodoroSettings } from '@/types';
import { Slider } from '@/components/ui/slider';

const PomodoroPage: React.FC = () => {
  const { t } = useLanguage();
  const [mode, setMode] = useState<PomodoroMode>('work');
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(25 * 60); // 25 minutes in seconds
  const [settings, setSettings] = useState<PomodoroSettings>({
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
  });
  
  const initialTime = useRef(time);
  const timer = useRef<number | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    audioRef.current = new Audio('https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg');
    
    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, []);
  
  useEffect(() => {
    if (isActive) {
      timer.current = window.setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            setIsActive(false);
            if (audioRef.current) {
              audioRef.current.play();
            }
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      if (timer.current) {
        clearInterval(timer.current);
        timer.current = null;
      }
    }
    
    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, [isActive]);
  
  useEffect(() => {
    let duration = 0;
    
    switch (mode) {
      case 'work':
        duration = settings.workDuration;
        break;
      case 'shortBreak':
        duration = settings.shortBreakDuration;
        break;
      case 'longBreak':
        duration = settings.longBreakDuration;
        break;
      default:
        duration = 25;
    }
    
    setTime(duration * 60);
    initialTime.current = duration * 60;
    setIsActive(false);
  }, [mode, settings]);
  
  const toggleTimer = () => {
    setIsActive(!isActive);
  };
  
  const resetTimer = () => {
    setIsActive(false);
    setTime(initialTime.current);
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const progress = (time / initialTime.current) * 100;
  
  const updateSetting = (settingName: keyof PomodoroSettings, value: number[]) => {
    setSettings(prev => ({
      ...prev,
      [settingName]: value[0],
    }));
  };
  
  return (
    <div className="container mx-auto max-w-2xl py-6">
      <h1 className="text-3xl font-bold text-center mb-8">{t('pomodoro.title')}</h1>
      
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="timer">
            <TabsList className="mx-auto mb-6">
              <TabsTrigger value="timer">Timer</TabsTrigger>
              <TabsTrigger value="settings">{t('pomodoro.settings')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="timer" className="space-y-6">
              <div className="mb-4">
                <TabsList className="w-full">
                  <TabsTrigger 
                    value="work" 
                    onClick={() => setMode('work')}
                    className={mode === 'work' ? 'bg-primary text-primary-foreground' : ''}
                  >
                    {t('pomodoro.work')}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="shortBreak" 
                    onClick={() => setMode('shortBreak')}
                    className={mode === 'shortBreak' ? 'bg-primary text-primary-foreground' : ''}
                  >
                    {t('pomodoro.shortBreak')}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="longBreak" 
                    onClick={() => setMode('longBreak')}
                    className={mode === 'longBreak' ? 'bg-primary text-primary-foreground' : ''}
                  >
                    {t('pomodoro.longBreak')}
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <div className="text-center">
                <div className="text-6xl font-bold my-8">{formatTime(time)}</div>
                <Progress value={progress} className="h-2 mb-8" />
                
                <div className="flex justify-center gap-4">
                  <Button size="lg" onClick={toggleTimer}>
                    {isActive ? (
                      <>
                        <Pause className="mr-2 h-5 w-5" />
                        {t('pomodoro.pause')}
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-5 w-5" />
                        {t('pomodoro.start')}
                      </>
                    )}
                  </Button>
                  <Button size="lg" variant="outline" onClick={resetTimer}>
                    <RotateCcw className="mr-2 h-5 w-5" />
                    {t('pomodoro.reset')}
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="font-medium">{t('pomodoro.workDuration')}</label>
                    <span>{settings.workDuration} {t('pomodoro.minutes')}</span>
                  </div>
                  <Slider 
                    value={[settings.workDuration]} 
                    min={5} 
                    max={60} 
                    step={5}
                    onValueChange={(value) => updateSetting('workDuration', value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="font-medium">{t('pomodoro.shortBreakDuration')}</label>
                    <span>{settings.shortBreakDuration} {t('pomodoro.minutes')}</span>
                  </div>
                  <Slider 
                    value={[settings.shortBreakDuration]} 
                    min={1} 
                    max={15} 
                    step={1}
                    onValueChange={(value) => updateSetting('shortBreakDuration', value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="font-medium">{t('pomodoro.longBreakDuration')}</label>
                    <span>{settings.longBreakDuration} {t('pomodoro.minutes')}</span>
                  </div>
                  <Slider 
                    value={[settings.longBreakDuration]} 
                    min={5} 
                    max={30} 
                    step={5}
                    onValueChange={(value) => updateSetting('longBreakDuration', value)}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PomodoroPage;
