import mitt, { type Emitter } from 'mitt';

type CustomEvents = {
  'event-select': { id: number };
  'chara-select': { id: number };
  'scene-select': { id: number };
  reload: {};
  'component-resize': { id: string; width: number; height: number };
};

const emitter: Emitter<CustomEvents> = mitt<CustomEvents>();

export const useEmitter = () => emitter;

export const onEventSelect = (handler: (data: { id: number }) => void) => {
  emitter.on('event-select', handler);
  return () => emitter.off('event-select', handler);
};

export const onCharaSelect = (handler: (data: { id: number }) => void) => {
  emitter.on('chara-select', handler);
  return () => emitter.off('chara-select', handler);
};

export const onSceneSelect = (handler: (data: { id: number }) => void) => {
  emitter.on('scene-select', handler);
  return () => emitter.off('scene-select', handler);
};

export const onReload = (handler: () => void) => {
  emitter.on('reload', handler);
  return () => emitter.off('reload', handler);
};

export const emitEventSelect = (id: number) =>
  emitter.emit('event-select', { id });
export const emitCharaSelect = (id: number) =>
  emitter.emit('chara-select', { id });
export const emitSceneSelect = (id: number) =>
  emitter.emit('scene-select', { id });
export const emitReload = () => emitter.emit('reload');

export { emitter };
