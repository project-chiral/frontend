import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './select';

interface AsyncSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface AsyncSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  options: AsyncSelectOption[];
  loading?: boolean;
  error?: string;
  disabled?: boolean;
  className?: string;
  emptyMessage?: string;
}

function AsyncSelect({
  value,
  onValueChange,
  placeholder = 'Select...',
  label,
  options,
  loading = false,
  error,
  disabled = false,
  className,
  emptyMessage = 'No options found',
}: AsyncSelectProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && <SelectLabel>{label}</SelectLabel>}
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger>
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin mr-2" />
              <span>Loading...</span>
            </>
          ) : (
            <SelectValue placeholder={placeholder} />
          )}
        </SelectTrigger>
        <SelectContent>
          {options.length > 0 ? (
            options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </SelectItem>
            ))
          ) : (
            <div className="py-2 px-3 text-sm text-muted-foreground text-center">
              {emptyMessage}
            </div>
          )}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

interface UseAsyncSelectOptions<T extends AsyncSelectOption> {
  queryKey: unknown[];
  queryFn: () => Promise<T[]>;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  emptyMessage?: string;
}

function useAsyncSelect<T extends AsyncSelectOption>({
  queryKey,
  queryFn,
  placeholder,
  label,
  disabled,
  className,
  emptyMessage,
}: UseAsyncSelectOptions<T>) {
  const {
    data: options = [],
    isLoading,
    error,
  } = useQuery({
    queryKey,
    queryFn,
  });

  return {
    options,
    loading: isLoading,
    error: error instanceof Error ? error.message : undefined,
    placeholder,
    label,
    disabled,
    className,
    emptyMessage,
  };
}

export { AsyncSelect, useAsyncSelect };
export type { AsyncSelectOption, AsyncSelectProps };
