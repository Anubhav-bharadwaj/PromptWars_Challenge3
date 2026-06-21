import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import Dashboard from './pages/Dashboard';
import Tracker from './pages/Tracker';
import Simulator from './pages/Simulator';
import Challenges from './pages/Challenges';
import AIChat from './components/AIChat';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tracker" element={<Tracker />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/challenges" element={<Challenges />} />
        </Routes>
        <AIChat />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
