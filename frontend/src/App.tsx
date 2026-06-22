import { Header } from './components/layout/Header';
import { LeftSidebar } from './components/layout/LeftSidebar';
import { CenterPanel } from './components/layout/CenterPanel';
import { RightSidebar } from './components/layout/RightSidebar';
import { usePromptState } from './hooks/usePromptState';
import './App.css';

function App() {
  const promptState = usePromptState();

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container">
      <Header promptState={promptState} />
      <main className="flex flex-1 overflow-hidden">
        <LeftSidebar promptState={promptState} />
        <CenterPanel promptState={promptState} />
        <RightSidebar promptState={promptState} />
      </main>
    </div>
  );
}

export default App;
