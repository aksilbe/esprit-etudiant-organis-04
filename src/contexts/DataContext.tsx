
import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { Task, Event, Category, TaskFilter } from '@/types';

type State = {
  tasks: Task[];
  events: Event[];
  categories: Category[];
  taskFilter: TaskFilter;
};

type Action =
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_EVENTS'; payload: Event[] }
  | { type: 'ADD_EVENT'; payload: Event }
  | { type: 'UPDATE_EVENT'; payload: Event }
  | { type: 'DELETE_EVENT'; payload: string }
  | { type: 'SET_TASK_FILTER'; payload: TaskFilter };

const initialState: State = {
  tasks: [
    {
      id: '1',
      title: 'Finir Powerpoint PP',
      description: 'Projet de présentation pour le cours de PP',
      dueDate: '2025-05-13T00:00:00.000Z',
      priority: 'low',
      category: 'project',
      completed: false,
      createdAt: '2025-05-12T10:30:00.000Z'
    },
    {
      id: '2',
      title: 'Finir Application PP',
      description: 'Développement de l\'application pour le projet PP',
      dueDate: '2025-05-13T00:00:00.000Z',
      priority: 'low',
      category: 'project',
      completed: false,
      createdAt: '2025-05-12T10:35:00.000Z'
    },
    {
      id: '3',
      title: 'Compléter Doc Maths',
      description: 'Exercices de mathématiques à rendre',
      dueDate: '2025-05-21T00:00:00.000Z',
      priority: 'high',
      category: 'homework',
      completed: false,
      createdAt: '2025-05-12T10:40:00.000Z'
    },
    {
      id: '4',
      title: 'Compléter Doc Finance',
      description: 'Devoir sur les concepts financiers',
      dueDate: '2025-05-13T00:00:00.000Z',
      priority: 'low',
      category: 'homework',
      completed: false,
      createdAt: '2025-05-12T10:45:00.000Z'
    },
    {
      id: '5',
      title: 'Préparation Exam Finance',
      description: 'Révisions pour l\'examen de finance',
      dueDate: '2025-05-13T00:00:00.000Z',
      priority: 'medium',
      category: 'exam',
      completed: false,
      createdAt: '2025-05-12T10:50:00.000Z'
    }
  ],
  events: [
    // Jour 1 (12 mai - Monday)
    {
      id: '1',
      title: 'Multisports 5 avec DEPANI.M.',
      description: 'ASC501-01 en GYM',
      date: '2025-05-12T08:25:00.000Z',
      startTime: '08:25',
      endTime: '09:40',
      location: 'GYM',
      color: '#3B82F6'
    },
    {
      id: '2',
      title: 'Histoire du OC.& du avec APRIL.G.',
      description: '085401-07 en N208',
      date: '2025-05-12T09:47:00.000Z',
      startTime: '09:47',
      endTime: '11:02',
      location: 'N208',
      color: '#10B981'
    },
    {
      id: '3',
      title: 'Français 5 Régulier avec CLERMONT.V.',
      description: '132501-04 en N335',
      date: '2025-05-12T11:09:00.000Z',
      startTime: '11:09',
      endTime: '12:24',
      location: 'N335',
      color: '#8B5CF6'
    },
    {
      id: '4',
      title: 'Culture/citoyenneté avec JOSEPH.C.',
      description: '080501-03 en S445',
      date: '2025-05-12T13:53:00.000Z',
      startTime: '13:53',
      endTime: '15:08',
      location: 'S445',
      color: '#F59E0B'
    },

    // Jour 2 (13 mai - Tuesday)
    {
      id: '5',
      title: 'Ed.phys.(gym)-Reg avec SOURROUBILLE.I.',
      description: '043501-04 en GYM',
      date: '2025-05-13T08:25:00.000Z',
      startTime: '08:25',
      endTime: '09:40',
      location: 'GYM',
      color: '#EF4444'
    },
    {
      id: '6',
      title: 'Multisports 5 avec DEPANI.M.',
      description: 'ASC501-01 en GYM',
      date: '2025-05-13T09:47:00.000Z',
      startTime: '09:47',
      endTime: '11:02',
      location: 'GYM',
      color: '#3B82F6'
    },
    {
      id: '7',
      title: 'Éducation financière avec BENOIT.R.',
      description: '102501-08 en N208',
      date: '2025-05-13T11:09:00.000Z',
      startTime: '11:09',
      endTime: '12:24',
      location: 'N208',
      color: '#6B7280'
    },
    {
      id: '8',
      title: 'Français 5 Régulier avec CLERMONT.V.',
      description: '132501-04 en N335',
      date: '2025-05-13T13:53:00.000Z',
      startTime: '13:53',
      endTime: '15:08',
      location: 'N335',
      color: '#8B5CF6'
    },
    
    // Jour 3 (14 mai - Wednesday)
    {
      id: '9',
      title: 'Math. 5 CST avec SAUMURE.M.',
      description: '063501-05 en N330',
      date: '2025-05-14T08:25:00.000Z',
      startTime: '08:25',
      endTime: '09:40',
      location: 'N330',
      color: '#EF4444'
    },
    {
      id: '10',
      title: 'Math. 5 CST avec SAUMURE.M.',
      description: '063501-05 en N330',
      date: '2025-05-14T09:47:00.000Z',
      startTime: '09:47',
      endTime: '11:02',
      location: 'N330',
      color: '#EF4444'
    },
    {
      id: '11',
      title: 'Histoire du OC.& du avec APRIL.G.',
      description: '085401-07 en N208',
      date: '2025-05-14T11:09:00.000Z',
      startTime: '11:09',
      endTime: '12:24',
      location: 'N208',
      color: '#10B981'
    },
    {
      id: '12',
      title: 'Français 5 Régulier avec CLERMONT.V.',
      description: '132501-04 en N335',
      date: '2025-05-14T13:53:00.000Z',
      startTime: '13:53',
      endTime: '15:08',
      location: 'N335',
      color: '#8B5CF6'
    },
    
    // Jour 4 (15 mai - Thursday)
    {
      id: '13',
      title: 'Anglais 5 Régulier avec STAIT.J.',
      description: '134501-07 en S415',
      date: '2025-05-15T08:25:00.000Z',
      startTime: '08:25',
      endTime: '09:40',
      location: 'S415',
      color: '#F59E0B'
    },
    {
      id: '14',
      title: 'Anglais 5 Régulier avec STAIT.J.',
      description: '134501-07 en S415',
      date: '2025-05-15T09:47:00.000Z',
      startTime: '09:47',
      endTime: '11:02',
      location: 'S415',
      color: '#F59E0B'
    },
    {
      id: '15',
      title: 'Multisports 5 avec DEPANI.M.',
      description: 'ASC501-01 en GYM',
      date: '2025-05-15T11:09:00.000Z',
      startTime: '11:09',
      endTime: '12:24',
      location: 'GYM',
      color: '#3B82F6'
    },
    {
      id: '16',
      title: 'M/Cont./Ed.Fin. 5 avec BENOIT.R.',
      description: '092501-08 en N208',
      date: '2025-05-15T13:53:00.000Z',
      startTime: '13:53',
      endTime: '15:08',
      location: 'N208',
      color: '#6B7280'
    },
    
    // Jour 5 (16 mai - Friday)
    {
      id: '17',
      title: 'Arts Plast. 5 Réguli avec VEZEAU-CROTEAU.K.',
      description: '168501-05 en N119',
      date: '2025-05-16T08:25:00.000Z',
      startTime: '08:25',
      endTime: '09:40',
      location: 'N119',
      color: '#8B5CF6'
    },
    {
      id: '18',
      title: 'Culture/citoyenneté avec JOSEPH.C.',
      description: '080501-03 en S445',
      date: '2025-05-16T09:47:00.000Z',
      startTime: '09:47',
      endTime: '11:02',
      location: 'S445',
      color: '#F59E0B'
    },
    {
      id: '19',
      title: 'Ed.phys.(gym)-Reg avec SOURROUBILLE.I.',
      description: '043501-04 en GYM',
      date: '2025-05-16T11:09:00.000Z',
      startTime: '11:09',
      endTime: '12:24',
      location: 'GYM',
      color: '#EF4444'
    },
    {
      id: '20',
      title: 'Histoire du OC.& du avec APRIL.G.',
      description: '085401-07 en N208',
      date: '2025-05-16T13:53:00.000Z',
      startTime: '13:53',
      endTime: '15:08',
      location: 'N208',
      color: '#10B981'
    }
  ],
  categories: [
    { id: 'homework', color: '#3B82F6' },
    { id: 'exam', color: '#EF4444' },
    { id: 'project', color: '#8B5CF6' },
    { id: 'reading', color: '#10B981' },
    { id: 'other', color: '#6B7280' },
  ],
  taskFilter: 'all',
};

// On simplifie cette fonction pour toujours utiliser les données initiales au premier chargement
const loadState = (): State => {
  try {
    // Au premier lancement, on veut forcer l'utilisation des données initiales
    const isFirstLoad = !localStorage.getItem('isInitialized');
    
    if (isFirstLoad) {
      // On marque que l'initialisation a été faite
      localStorage.setItem('isInitialized', 'true');
      return initialState;
    }

    // Pour les lancements suivants, on essaie de charger depuis localStorage
    const serializedTasks = localStorage.getItem('tasks');
    const serializedEvents = localStorage.getItem('events');
    
    return {
      ...initialState,
      tasks: serializedTasks ? JSON.parse(serializedTasks) : initialState.tasks,
      events: serializedEvents ? JSON.parse(serializedEvents) : initialState.events,
    };
  } catch (err) {
    console.error('Error loading state from localStorage, using initial state', err);
    return initialState;
  }
};

const saveState = (state: State) => {
  try {
    localStorage.setItem('tasks', JSON.stringify(state.tasks));
    localStorage.setItem('events', JSON.stringify(state.events));
  } catch (err) {
    console.error('Could not save state to localStorage', err);
  }
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    case 'SET_EVENTS':
      return { ...state, events: action.payload };
    case 'ADD_EVENT':
      return { ...state, events: [...state.events, action.payload] };
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map((event) =>
          event.id === action.payload.id ? action.payload : event
        ),
      };
    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter((event) => event.id !== action.payload),
      };
    case 'SET_TASK_FILTER':
      return { ...state, taskFilter: action.payload };
    default:
      return state;
  }
};

type DataContextType = {
  state: State;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (id: string) => void;
  setTaskFilter: (filter: TaskFilter) => void;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // On utilise maintenant directement les données initiales pour le premier rendu
  const [state, dispatch] = useReducer(reducer, loadState());

  // Sauvegardons l'état à chaque changement
  useEffect(() => {
    saveState(state);
  }, [state.tasks, state.events]);

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...task,
    };
    dispatch({ type: 'ADD_TASK', payload: newTask });
  };

  const updateTask = (task: Task) => {
    dispatch({ type: 'UPDATE_TASK', payload: task });
  };

  const deleteTask = (id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const toggleTaskCompletion = (id: string) => {
    const task = state.tasks.find((t) => t.id === id);
    if (task) {
      updateTask({ ...task, completed: !task.completed });
    }
  };

  const addEvent = (event: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      id: Date.now().toString(),
      ...event,
    };
    dispatch({ type: 'ADD_EVENT', payload: newEvent });
  };

  const updateEvent = (event: Event) => {
    dispatch({ type: 'UPDATE_EVENT', payload: event });
  };

  const deleteEvent = (id: string) => {
    dispatch({ type: 'DELETE_EVENT', payload: id });
  };

  const setTaskFilter = (filter: TaskFilter) => {
    dispatch({ type: 'SET_TASK_FILTER', payload: filter });
  };

  return (
    <DataContext.Provider
      value={{
        state,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        addEvent,
        updateEvent,
        deleteEvent,
        setTaskFilter,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
