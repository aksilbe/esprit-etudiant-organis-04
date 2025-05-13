
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
    // Jour 1 (12 mai - Monday) - Week 1
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
      title: 'M/Cont./Ed.Fin. 5 avec BENOIT.R.',
      description: '092501-08 en N208',
      date: '2025-05-12T09:47:00.000Z',
      startTime: '09:47',
      endTime: '11:02',
      location: 'N208',
      color: '#6B7280'
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
      title: 'Anglais 5 Régulier avec STAIT.J.',
      description: '134501-07 en S415',
      date: '2025-05-12T13:53:00.000Z',
      startTime: '13:53',
      endTime: '15:08',
      location: 'S415',
      color: '#F59E0B'
    },

    // Jour 2 (13 mai - Tuesday) - Week 1
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
      title: 'Histoire du Oc.& du avec APRIL.G.',
      description: '085401-07 en N208',
      date: '2025-05-13T09:47:00.000Z',
      startTime: '09:47',
      endTime: '11:02',
      location: 'N208',
      color: '#10B981'
    },
    {
      id: '7',
      title: 'Français 5 Régulier avec CLERMONT.V.',
      description: '132501-04 en N335',
      date: '2025-05-13T11:09:00.000Z',
      startTime: '11:09',
      endTime: '12:24',
      location: 'N335',
      color: '#8B5CF6'
    },
    {
      id: '8',
      title: 'Culture/citoyenneté avec JOSEPH.C.',
      description: '080501-03 en S445',
      date: '2025-05-13T13:53:00.000Z',
      startTime: '13:53',
      endTime: '15:08',
      location: 'S445',
      color: '#F59E0B'
    },
    
    // Jour 3 (14 mai - Wednesday) - Week 1
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
      title: 'Multisports 5 avec DEPANI.M.',
      description: 'ASC501-01 en GYM',
      date: '2025-05-14T09:47:00.000Z',
      startTime: '09:47',
      endTime: '11:02',
      location: 'GYM',
      color: '#3B82F6'
    },
    {
      id: '11',
      title: 'Éducation financière avec BENOIT.R.',
      description: '102501-08 en N208',
      date: '2025-05-14T11:09:00.000Z',
      startTime: '11:09',
      endTime: '12:24',
      location: 'N208',
      color: '#6B7280'
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
    
    // Jour 4 (15 mai - Thursday) - Week 1
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
      title: 'Math. 5 CST avec SAUMURE.M.',
      description: '063501-05 en N330',
      date: '2025-05-15T09:47:00.000Z',
      startTime: '09:47',
      endTime: '11:02',
      location: 'N330',
      color: '#EF4444'
    },
    {
      id: '15',
      title: 'Histoire du Oc.& du avec APRIL.G.',
      description: '085401-07 en N208',
      date: '2025-05-15T11:09:00.000Z',
      startTime: '11:09',
      endTime: '12:24',
      location: 'N208',
      color: '#10B981'
    },
    {
      id: '16',
      title: 'Français 5 Régulier avec CLERMONT.V.',
      description: '132501-04 en N335',
      date: '2025-05-15T13:53:00.000Z',
      startTime: '13:53',
      endTime: '15:08',
      location: 'N335',
      color: '#8B5CF6'
    },
    
    // Jour 5 (16 mai - Friday) - Week 1
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
      title: 'Math. 5 CST avec SAUMURE.M.',
      description: '063501-05 en N330',
      date: '2025-05-16T09:47:00.000Z',
      startTime: '09:47',
      endTime: '11:02',
      location: 'N330',
      color: '#EF4444'
    },
    {
      id: '19',
      title: 'Multisports 5 avec DEPANI.M.',
      description: 'ASC501-01 en GYM',
      date: '2025-05-16T11:09:00.000Z',
      startTime: '11:09',
      endTime: '12:24',
      location: 'GYM',
      color: '#3B82F6'
    },
    {
      id: '20',
      title: 'M/Cont./Ed.Fin. 5 avec BENOIT.R.',
      description: '092501-08 en N208',
      date: '2025-05-16T13:53:00.000Z',
      startTime: '13:53',
      endTime: '15:08',
      location: 'N208',
      color: '#6B7280'
    },
    
    // Jour 6 (19 mai - Monday) - Week 2
    {
      id: '21',
      title: 'Français 5 Régulier avec CLERMONT.V.',
      description: '132501-04 en N335',
      date: '2025-05-19T08:25:00.000Z',
      startTime: '08:25',
      endTime: '09:40',
      location: 'N335',
      color: '#8B5CF6'
    },
    {
      id: '22',
      title: 'Anglais 5 Régulier avec STAIT.J.',
      description: '134501-07 en S415',
      date: '2025-05-19T09:47:00.000Z',
      startTime: '09:47',
      endTime: '11:02',
      location: 'S415',
      color: '#F59E0B'
    },
    {
      id: '23',
      title: 'Ed.phys.(gym)-Reg avec SOURROUBILLE.I.',
      description: '043501-04 en GYM',
      date: '2025-05-19T11:09:00.000Z',
      startTime: '11:09',
      endTime: '12:24',
      location: 'GYM',
      color: '#EF4444'
    },
    {
      id: '24',
      title: 'Histoire du Oc.& du avec APRIL.G.',
      description: '085401-07 en N208',
      date: '2025-05-19T13:53:00.000Z',
      startTime: '13:53',
      endTime: '15:08',
      location: 'N208',
      color: '#10B981'
    },
    
    // Jour 7 (20 mai - Tuesday) - Week 2
    {
      id: '25',
      title: 'Français 5 Régulier avec CLERMONT.V.',
      description: '132501-04 en N335',
      date: '2025-05-20T08:25:00.000Z',
      startTime: '08:25',
      endTime: '09:40',
      location: 'N335',
      color: '#8B5CF6'
    },
    {
      id: '26',
      title: 'Culture/citoyenneté avec JOSEPH.C.',
      description: '080501-03 en S445',
      date: '2025-05-20T09:47:00.000Z',
      startTime: '09:47',
      endTime: '11:02',
      location: 'S445',
      color: '#F59E0B'
    },
    {
      id: '27',
      title: 'Math. 5 CST avec SAUMURE.M.',
      description: '063501-05 en N330',
      date: '2025-05-20T11:09:00.000Z',
      startTime: '11:09',
      endTime: '12:24',
      location: 'N330',
      color: '#EF4444'
    },
    {
      id: '28',
      title: 'Multisports 5 avec DEPANI.M.',
      description: 'ASC501-01 en GYM',
      date: '2025-05-20T13:53:00.000Z',
      startTime: '13:53',
      endTime: '15:08',
      location: 'GYM',
      color: '#3B82F6'
    },
    
    // Jour 8 (21 mai - Wednesday) - Week 2
    {
      id: '29',
      title: 'Éducation financière avec BENOIT.R.',
      description: '102501-08 en N208',
      date: '2025-05-21T08:25:00.000Z',
      startTime: '08:25',
      endTime: '09:40',
      location: 'N208',
      color: '#6B7280'
    },
    {
      id: '30',
      title: 'Histoire du Oc.& du avec APRIL.G.',
      description: '085401-07 en N208',
      date: '2025-05-21T09:47:00.000Z',
      startTime: '09:47',
      endTime: '11:02',
      location: 'N208',
      color: '#10B981'
    },
    {
      id: '31',
      title: 'Anglais 5 Régulier avec STAIT.J.',
      description: '134501-07 en S415',
      date: '2025-05-21T11:09:00.000Z',
      startTime: '11:09',
      endTime: '12:24',
      location: 'S415',
      color: '#F59E0B'
    },
    {
      id: '32',
      title: 'Math. 5 CST avec SAUMURE.M.',
      description: '063501-05 en N330',
      date: '2025-05-21T13:53:00.000Z',
      startTime: '13:53',
      endTime: '15:08',
      location: 'N330',
      color: '#EF4444'
    },
    
    // Jour 9 (22 mai - Thursday) - Week 2
    {
      id: '33',
      title: 'Histoire du Oc.& du avec APRIL.G.',
      description: '085401-07 en N208',
      date: '2025-05-22T08:25:00.000Z',
      startTime: '08:25',
      endTime: '09:40',
      location: 'N208',
      color: '#10B981'
    },
    {
      id: '34',
      title: 'Français 5 Régulier avec CLERMONT.V.',
      description: '132501-04 en N335',
      date: '2025-05-22T09:47:00.000Z',
      startTime: '09:47',
      endTime: '11:02',
      location: 'N335',
      color: '#8B5CF6'
    },
    {
      id: '35',
      title: 'Arts Plast. 5 Réguli avec VEZEAU-CROTEAU.K.',
      description: '168501-05 en N119',
      date: '2025-05-22T11:09:00.000Z',
      startTime: '11:09',
      endTime: '12:24',
      location: 'N119',
      color: '#8B5CF6'
    },
    {
      id: '36',
      title: 'Math. 5 CST avec SAUMURE.M.',
      description: '063501-05 en N330',
      date: '2025-05-22T13:53:00.000Z',
      startTime: '13:53',
      endTime: '15:08',
      location: 'N330',
      color: '#EF4444'
    },
    
    // Week 3 (May 26-30, 2025) - Repeating pattern from Week 1
    
    // Jour 1 (26 mai - Monday) - Week 3
    {
      id: '37',
      title: 'Multisports 5 avec DEPANI.M.',
      description: 'ASC501-01 en GYM',
      date: '2025-05-26T08:25:00.000Z',
      startTime: '08:25',
      endTime: '09:40',
      location: 'GYM',
      color: '#3B82F6'
    },
    {
      id: '38',
      title: 'M/Cont./Ed.Fin. 5 avec BENOIT.R.',
      description: '092501-08 en N208',
      date: '2025-05-26T09:47:00.000Z',
      startTime: '09:47',
      endTime: '11:02',
      location: 'N208',
      color: '#6B7280'
    },
    {
      id: '39',
      title: 'Français 5 Régulier avec CLERMONT.V.',
      description: '132501-04 en N335',
      date: '2025-05-26T11:09:00.000Z',
      startTime: '11:09',
      endTime: '12:24',
      location: 'N335',
      color: '#8B5CF6'
    },
    {
      id: '40',
      title: 'Anglais 5 Régulier avec STAIT.J.',
      description: '134501-07 en S415',
      date: '2025-05-26T13:53:00.000Z',
      startTime: '13:53',
      endTime: '15:08',
      location: 'S415',
      color: '#F59E0B'
    },

    // Jour 2 (27 mai - Tuesday) - Week 3
    {
      id: '41',
      title: 'Ed.phys.(gym)-Reg avec SOURROUBILLE.I.',
      description: '043501-04 en GYM',
      date: '2025-05-27T08:25:00.000Z',
      startTime: '08:25',
      endTime: '09:40',
      location: 'GYM',
      color: '#EF4444'
    },
    {
      id: '42',
      title: 'Histoire du Oc.& du avec APRIL.G.',
      description: '085401-07 en N208',
      date: '2025-05-27T09:47:00.000Z',
      startTime: '09:47',
      endTime: '11:02',
      location: 'N208',
      color: '#10B981'
    },
    {
      id: '43',
      title: 'Français 5 Régulier avec CLERMONT.V.',
      description: '132501-04 en N335',
      date: '2025-05-27T11:09:00.000Z',
      startTime: '11:09',
      endTime: '12:24',
      location: 'N335',
      color: '#8B5CF6'
    },
    {
      id: '44',
      title: 'Culture/citoyenneté avec JOSEPH.C.',
      description: '080501-03 en S445',
      date: '2025-05-27T13:53:00.000Z',
      startTime: '13:53',
      endTime: '15:08',
      location: 'S445',
      color: '#F59E0B'
    },
    
    // Jour 3 (28 mai - Wednesday) - Week 3
    {
      id: '45',
      title: 'Math. 5 CST avec SAUMURE.M.',
      description: '063501-05 en N330',
      date: '2025-05-28T08:25:00.000Z',
      startTime: '08:25',
      endTime: '09:40',
      location: 'N330',
      color: '#EF4444'
    },
    {
      id: '46',
      title: 'Multisports 5 avec DEPANI.M.',
      description: 'ASC501-01 en GYM',
      date: '2025-05-28T09:47:00.000Z',
      startTime: '09:47',
      endTime: '11:02',
      location: 'GYM',
      color: '#3B82F6'
    },
    {
      id: '47',
      title: 'Éducation financière avec BENOIT.R.',
      description: '102501-08 en N208',
      date: '2025-05-28T11:09:00.000Z',
      startTime: '11:09',
      endTime: '12:24',
      location: 'N208',
      color: '#6B7280'
    },
    {
      id: '48',
      title: 'Français 5 Régulier avec CLERMONT.V.',
      description: '132501-04 en N335',
      date: '2025-05-28T13:53:00.000Z',
      startTime: '13:53',
      endTime: '15:08',
      location: 'N335',
      color: '#8B5CF6'
    },
    
    // Jour 4 (29 mai - Thursday) - Week 3
    {
      id: '49',
      title: 'Anglais 5 Régulier avec STAIT.J.',
      description: '134501-07 en S415',
      date: '2025-05-29T08:25:00.000Z',
      startTime: '08:25',
      endTime: '09:40',
      location: 'S415',
      color: '#F59E0B'
    },
    {
      id: '50',
      title: 'Math. 5 CST avec SAUMURE.M.',
      description: '063501-05 en N330',
      date: '2025-05-29T09:47:00.000Z',
      startTime: '09:47',
      endTime: '11:02',
      location: 'N330',
      color: '#EF4444'
    },
    {
      id: '51',
      title: 'Histoire du Oc.& du avec APRIL.G.',
      description: '085401-07 en N208',
      date: '2025-05-29T11:09:00.000Z',
      startTime: '11:09',
      endTime: '12:24',
      location: 'N208',
      color: '#10B981'
    },
    {
      id: '52',
      title: 'Français 5 Régulier avec CLERMONT.V.',
      description: '132501-04 en N335',
      date: '2025-05-29T13:53:00.000Z',
      startTime: '13:53',
      endTime: '15:08',
      location: 'N335',
      color: '#8B5CF6'
    },
    
    // Jour 5 (30 mai - Friday) - Week 3
    {
      id: '53',
      title: 'Arts Plast. 5 Réguli avec VEZEAU-CROTEAU.K.',
      description: '168501-05 en N119',
      date: '2025-05-30T08:25:00.000Z',
      startTime: '08:25',
      endTime: '09:40',
      location: 'N119',
      color: '#8B5CF6'
    },
    {
      id: '54',
      title: 'Math. 5 CST avec SAUMURE.M.',
      description: '063501-05 en N330',
      date: '2025-05-30T09:47:00.000Z',
      startTime: '09:47',
      endTime: '11:02',
      location: 'N330',
      color: '#EF4444'
    },
    {
      id: '55',
      title: 'Multisports 5 avec DEPANI.M.',
      description: 'ASC501-01 en GYM',
      date: '2025-05-30T11:09:00.000Z',
      startTime: '11:09',
      endTime: '12:24',
      location: 'GYM',
      color: '#3B82F6'
    },
    {
      id: '56',
      title: 'M/Cont./Ed.Fin. 5 avec BENOIT.R.',
      description: '092501-08 en N208',
      date: '2025-05-30T13:53:00.000Z',
      startTime: '13:53',
      endTime: '15:08',
      location: 'N208',
      color: '#6B7280'
    },
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
  return initialState;
};

const saveState = (state: State): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('appState', serializedState);
  } catch (err) {
    console.error('Could not save state', err);
  }
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_TASKS':
      return {
        ...state,
        tasks: action.payload
      };
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload]
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        )
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      };
    case 'SET_EVENTS':
      return {
        ...state,
        events: action.payload
      };
    case 'ADD_EVENT':
      return {
        ...state,
        events: [...state.events, action.payload]
      };
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map(event =>
          event.id === action.payload.id ? action.payload : event
        )
      };
    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter(event => event.id !== action.payload)
      };
    case 'SET_TASK_FILTER':
      return {
        ...state,
        taskFilter: action.payload
      };
    default:
      return state;
  }
};

type DataContextType = {
  state: State;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  setEvents: (events: Event[]) => void;
  addEvent: (event: Event) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (id: string) => void;
  setTaskFilter: (filter: TaskFilter) => void;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, loadState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  const setTasks = (tasks: Task[]) => {
    dispatch({ type: 'SET_TASKS', payload: tasks });
  };

  const addTask = (task: Task) => {
    dispatch({ type: 'ADD_TASK', payload: task });
  };

  const updateTask = (task: Task) => {
    dispatch({ type: 'UPDATE_TASK', payload: task });
  };

  const deleteTask = (id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const setEvents = (events: Event[]) => {
    dispatch({ type: 'SET_EVENTS', payload: events });
  };

  const addEvent = (event: Event) => {
    dispatch({ type: 'ADD_EVENT', payload: event });
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
        setTasks,
        addTask,
        updateTask,
        deleteTask,
        setEvents,
        addEvent,
        updateEvent,
        deleteEvent,
        setTaskFilter
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
