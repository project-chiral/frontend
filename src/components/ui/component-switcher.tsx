import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import type { ComponentType } from '@/store/workspace';

interface ComponentSwitcherProps {
  className?: string;
}

interface ComponentConfig {
  type: ComponentType;
  label: string;
  icon: React.ReactNode;
}

const DEFAULT_COMPONENTS: ComponentConfig[] = [
  { type: 'gantt', label: 'Gantt', icon: '📊' },
  { type: 'editor', label: 'Editor', icon: '📝' },
  { type: 'graph', label: 'Graph', icon: '🔗' },
  { type: 'design', label: 'Design', icon: '🎨' },
];

interface ComponentSwitcherComponentProps {
  type: ComponentType;
  isActive: boolean;
}

function GanttComponent({ isActive }: ComponentSwitcherComponentProps) {
  if (!isActive) return null;
  return (
    <div className="h-full w-full flex items-center justify-center bg-muted/20 rounded-lg">
      <div className="text-center">
        <div className="text-4xl mb-2">📊</div>
        <div className="text-muted-foreground">Gantt Chart Component</div>
        <div className="text-sm text-muted-foreground mt-1">
          Timeline view for events
        </div>
      </div>
    </div>
  );
}

function EditorComponent({ isActive }: ComponentSwitcherComponentProps) {
  if (!isActive) return null;
  return (
    <div className="h-full w-full flex items-center justify-center bg-muted/20 rounded-lg">
      <div className="text-center">
        <div className="text-4xl mb-2">📝</div>
        <div className="text-muted-foreground">Editor Component</div>
        <div className="text-sm text-muted-foreground mt-1">
          Rich text content editor
        </div>
      </div>
    </div>
  );
}

function GraphComponent({ isActive }: ComponentSwitcherComponentProps) {
  if (!isActive) return null;
  return (
    <div className="h-full w-full flex items-center justify-center bg-muted/20 rounded-lg">
      <div className="text-center">
        <div className="text-4xl mb-2">🔗</div>
        <div className="text-muted-foreground">Graph Component</div>
        <div className="text-sm text-muted-foreground mt-1">
          Event relationship visualization
        </div>
      </div>
    </div>
  );
}

function DesignComponent({ isActive }: ComponentSwitcherComponentProps) {
  if (!isActive) return null;
  return (
    <div className="h-full w-full flex items-center justify-center bg-muted/20 rounded-lg">
      <div className="text-center">
        <div className="text-4xl mb-2">🎨</div>
        <div className="text-muted-foreground">Design Component</div>
        <div className="text-sm text-muted-foreground mt-1">
          World view and character design
        </div>
      </div>
    </div>
  );
}

function renderComponent(type: ComponentType, isActive: boolean) {
  switch (type) {
    case 'gantt':
      return <GanttComponent type={type} isActive={isActive} />;
    case 'editor':
      return <EditorComponent type={type} isActive={isActive} />;
    case 'graph':
      return <GraphComponent type={type} isActive={isActive} />;
    case 'design':
      return <DesignComponent type={type} isActive={isActive} />;
    default:
      return null;
  }
}

export function ComponentSwitcher({ className }: ComponentSwitcherProps) {
  const [activeTab, setActiveTab] = React.useState<ComponentType>('gantt');
  const [components, setComponents] = React.useState<ComponentType[]>([
    'gantt',
    'editor',
    'graph',
    'design',
  ]);

  const toggleComponent = (type: ComponentType) => {
    setComponents((prev) => {
      if (prev.includes(type)) {
        const newComponents = prev.filter((t) => t !== type);
        if (newComponents.length === 0) return prev;
        if (activeTab === type && newComponents.length > 0) {
          const newTab = newComponents[0];
          if (newTab) setActiveTab(newTab);
        }
        return newComponents;
      } else {
        setActiveTab(type);
        return [...prev, type];
      }
    });
  };

  const isComponentActive = (type: ComponentType) => components.includes(type);

  return (
    <div className={cn('flex flex-col h-full', className)}>
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Active View:</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {DEFAULT_COMPONENTS.find((c) => c.type === activeTab)?.icon}{' '}
                {DEFAULT_COMPONENTS.find((c) => c.type === activeTab)?.label}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {DEFAULT_COMPONENTS.map((component) => (
                <DropdownMenuItem
                  key={component.type}
                  onClick={() => setActiveTab(component.type)}
                  disabled={!isComponentActive(component.type)}
                >
                  <span className="mr-2">{component.icon}</span>
                  <span>{component.label}</span>
                  {isComponentActive(component.type) && (
                    <span className="ml-auto text-xs text-muted-foreground">
                      ●
                    </span>
                  )}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              {DEFAULT_COMPONENTS.map((component) => (
                <DropdownMenuItem
                  key={`toggle-${component.type}`}
                  onClick={() => toggleComponent(component.type)}
                >
                  <span className="mr-2">
                    {isComponentActive(component.type) ? '◉' : '○'}
                  </span>
                  {isComponentActive(component.type)
                    ? `Hide ${component.label}`
                    : `Show ${component.label}`}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="text-xs text-muted-foreground">
          {components.length} component{components.length !== 1 ? 's' : ''}{' '}
          visible
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as ComponentType)}
        className="flex-1 flex flex-col"
      >
        <TabsList className="mx-4 mt-2 justify-start">
          {components.map((type) => {
            const config = DEFAULT_COMPONENTS.find((c) => c.type === type);
            return (
              <TabsTrigger key={type} value={type} className="gap-1">
                <span>{config?.icon}</span>
                <span>{config?.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <div className="flex-1 p-4 overflow-hidden">
          {components.map((type) => (
            <TabsContent
              key={type}
              value={type}
              className="h-full m-0 data-[state=active]:flex"
            >
              {renderComponent(type, type === activeTab)}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}
