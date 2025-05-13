
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { DataProvider } from "@/contexts/DataContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { useState } from "react";
import Dashboard from "@/pages/Dashboard";
import TasksPage from "@/pages/TasksPage";
import CalendarPage from "@/pages/CalendarPage";
import PomodoroPage from "@/pages/PomodoroPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [currentPage, setCurrentPage] = useState<string>("dashboard");

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "tasks":
        return <TasksPage />;
      case "calendar":
        return <CalendarPage />;
      case "pomodoro":
        return <PomodoroPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <NotFound />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <DataProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AppLayout currentPage={currentPage} setCurrentPage={setCurrentPage}>
              {renderCurrentPage()}
            </AppLayout>
          </TooltipProvider>
        </DataProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
