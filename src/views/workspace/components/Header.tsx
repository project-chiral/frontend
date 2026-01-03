import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useGlobalStore } from '@/store';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const { id: projectId } = useParams();
  const { darkMode, toggleDarkMode, userId } = useGlobalStore();

  return (
    <header
      className={cn(
        'border-b bg-card px-4 py-2 flex items-center justify-between',
        className
      )}
    >
      <div className="flex items-center gap-4">
        <Link to="/" className="font-bold text-lg">
          Project Chiral
        </Link>
        {projectId && (
          <span className="text-sm text-muted-foreground">
            Project: {projectId}
          </span>
        )}
      </div>

      <nav className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/project/${projectId || 1}`}>Workspace</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/project/${projectId || 1}/search`}>Search</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/project/${projectId || 1}/settings`}>Settings</Link>
        </Button>
      </nav>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? '🌙' : '☀️'}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              {userId ? `User: ${userId}` : 'Guest'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to={`/project/${projectId || 1}/user`}>Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/project/${projectId || 1}/help`}>Help</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to={`/project/${projectId || 1}/about`}>About</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
