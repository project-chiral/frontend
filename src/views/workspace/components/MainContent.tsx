import { useParams, Outlet } from 'react-router-dom';
import { useWorkspaceStore } from '@/store';
import { ComponentType } from '@/store/workspace';

export default function MainContent() {
  const { id: projectId } = useParams();
  const { components, activeComponentId, setActiveComponent } = useWorkspaceStore();

  const renderComponent = (component: { id: string; type: ComponentType; title: string }) => {
    switch (component.type) {
      case 'gantt':
        return <div>Gantt Component - {component.title}</div>;
      case 'editor':
        return <div>Editor Component - {component.title}</div>;
      case 'graph':
        return <div>Graph Component - {component.title}</div>;
      case 'design':
        return <div>Design Component - {component.title}</div>;
      default:
        return null;
    }
  };

  return (
    <div className="h-full w-full p-4">
      {projectId && <div className="mb-4">Project: {projectId}</div>}
      
      {components.length === 0 ? (
        <div className="flex h-full items-center justify-center text-muted-foreground">
          Select components from the sidebar to add them here
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {components.map((component) => (
            <div
              key={component.id}
              className={`border rounded-lg p-4 min-h-[200px] ${
                activeComponentId === component.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setActiveComponent(component.id)}
            >
              <h3 className="font-medium mb-2">{component.title}</h3>
              {renderComponent(component)}
            </div>
          ))}
        </div>
      )}
      
      <Outlet />
    </div>
  );
}
