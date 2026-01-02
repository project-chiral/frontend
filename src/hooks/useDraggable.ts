import { useCallback, useRef, useState } from 'react';

interface UseDraggableOptions {
  onDragStart?: () => void;
  onDragEnd?: (delta: { x: number; y: number }) => void;
  minDistance?: number;
}

export function useDraggable(options: UseDraggableOptions = {}) {
  const { onDragStart, onDragEnd, minDistance = 5 } = options;
  const [isDragging, setIsDragging] = useState(false);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const deltaRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handlePointerDown = useCallback((event: React.PointerEvent) => {
    const { clientX, clientY } = event;
    startRef.current = { x: clientX, y: clientY };
    deltaRef.current = { x: 0, y: 0 };
    setIsDragging(true);
    onDragStart?.();
  }, [onDragStart]);

  const handlePointerMove = useCallback((event: React.PointerEvent) => {
    if (!startRef.current) return;

    const { clientX, clientY } = event;
    const deltaX = clientX - startRef.current.x;
    const deltaY = clientY - startRef.current.y;

    if (Math.abs(deltaX) < minDistance && Math.abs(deltaY) < minDistance) {
      return;
    }

    deltaRef.current = { x: deltaX, y: deltaY };
  }, [minDistance]);

  const handlePointerUp = useCallback(() => {
    if (!startRef.current) return;

    setIsDragging(false);
    onDragEnd?.(deltaRef.current);
    startRef.current = null;
    deltaRef.current = { x: 0, y: 0 };
  }, [onDragEnd]);

  return {
    start: handlePointerDown,
    delta: deltaRef.current,
    isDragging,
    reset: () => {
      startRef.current = null;
      deltaRef.current = { x: 0, y: 0 };
      setIsDragging(false);
    },
  };
}
