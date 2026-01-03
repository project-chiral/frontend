import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { type ComponentType, useWorkspaceStore } from '@/store';

interface SidebarProps {
  className?: string;
}

const COMPONENT_OPTIONS: {
  type: ComponentType;
  label: string;
  icon: string;
}[] = [
  { type: 'gantt', label: 'Gantt Chart', icon: '📊' },
  { type: 'editor', label: 'Editor', icon: '📝' },
  { type: 'graph', label: 'Graph', icon: '🔗' },
  { type: 'design', label: 'Design', icon: '🎨' },
];

export function Sidebar({ className }: SidebarProps) {
  const {
    components,
    menuExpanded,
    addComponent,
    removeComponent,
    activeComponentId,
    setActiveComponent,
  } = useWorkspaceStore();

  const handleAddComponent = (type: ComponentType) => {
    const id = `${type}-${Date.now()}`;
    addComponent({
      id,
      type,
      title: COMPONENT_OPTIONS.find((o) => o.type === type)?.label || type,
    });
    setActiveComponent(id);
  };

  return (
    <aside
      className={cn(
        'border-r bg-card flex flex-col transition-all duration-300',
        menuExpanded ? 'w-64' : 'w-12',
        className
      )}
    >
      <div className="p-3 border-b">
        {menuExpanded && (
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Components</h2>
          </div>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full"
              size={menuExpanded ? 'default' : 'icon'}
            >
              {menuExpanded ? 'Add Component' : '+'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            {COMPONENT_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option.type}
                onClick={() => handleAddComponent(option.type)}
              >
                <span className="mr-2">{option.icon}</span>
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ScrollArea className="flex-1">
        {menuExpanded ? (
          <div className="p-2 space-y-1">
            {components.length === 0 ? (
              <p className="text-sm text-muted-foreground p-2">
                No components added yet
              </p>
            ) : (
              components.map((component) => {
                const option = COMPONENT_OPTIONS.find(
                  (o) => o.type === component.type
                );
                return (
                  <button
                    key={component.id}
                    type="button"
                    className={cn(
                      'w-full flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors border-0 bg-transparent text-left',
                      activeComponentId === component.id
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-muted'
                    )}
                    onClick={() => setActiveComponent(component.id)}
                  >
                    <div className="flex items-center gap-2">
                      <span>{option?.icon || '📦'}</span>
                      <span className="text-sm">{component.title}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeComponent(component.id);
                      }}
                    >
                      ×
                    </Button>
                  </button>
                );
              })
            )}
          </div>
        ) : (
          <div className="p-1 space-y-1">
            {components.map((component) => {
              const option = COMPONENT_OPTIONS.find(
                (o) => o.type === component.type
              );
              return (
                <button
                  key={component.id}
                  type="button"
                  className={cn(
                    'w-full flex items-center justify-center p-2 rounded-md cursor-pointer transition-colors border-0 bg-transparent',
                    activeComponentId === component.id
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-muted'
                  )}
                  onClick={() => setActiveComponent(component.id)}
                  title={component.title}
                >
                  <span>{option?.icon || '📦'}</span>
                </button>
              );
            })}
          </div>
        )}
      </ScrollArea>

      <div className="p-2 border-t">
        <Button
          variant="ghost"
          size="sm"
          className="w-full"
          onClick={() => useWorkspaceStore.getState().toggleMenu()}
        >
          {menuExpanded ? '← Collapse' : '→'}
        </Button>
      </div>
    </aside>
  );
}
