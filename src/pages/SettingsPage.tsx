
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const SettingsPage: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('settings.title')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('settings.language')}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={language} 
              onValueChange={handleLanguageChange}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fr" id="fr" />
                <Label htmlFor="fr">{t('settings.languages.fr')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="en" id="en" />
                <Label htmlFor="en">{t('settings.languages.en')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="es" id="es" />
                <Label htmlFor="es">{t('settings.languages.es')}</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('settings.notifications')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="task-notifications">
                  <div>{t('settings.notificationsSettings.tasks.title')}</div>
                  <div className="text-sm text-muted-foreground">
                    {t('settings.notificationsSettings.tasks.description')}
                  </div>
                </Label>
                <Switch id="task-notifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="event-notifications">
                  <div>{t('settings.notificationsSettings.events.title')}</div>
                  <div className="text-sm text-muted-foreground">
                    {t('settings.notificationsSettings.events.description')}
                  </div>
                </Label>
                <Switch id="event-notifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="pomodoro-notifications">
                  <div>{t('settings.notificationsSettings.pomodoro.title')}</div>
                  <div className="text-sm text-muted-foreground">
                    {t('settings.notificationsSettings.pomodoro.description')}
                  </div>
                </Label>
                <Switch id="pomodoro-notifications" defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
