
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// On s'assure qu'il n'y a pas de données précédentes dans le localStorage
localStorage.removeItem('tasks');
localStorage.removeItem('events');

createRoot(document.getElementById("root")!).render(<App />);
