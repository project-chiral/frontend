import { Outlet, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useGlobalStore } from '@/store';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function WorkspacePage() {
  const { id: projectId } = useParams();
  const { setProjectId } = useGlobalStore();

  useEffect(() => {
    if (projectId) {
      setProjectId(projectId);
      sessionStorage.setItem('project-id', projectId);
    }
  }, [projectId, setProjectId]);

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <Outlet />
          </ScrollArea>
        </main>
      </div>
    </div>
  );
}
