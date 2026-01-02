export const EVENT = 'event' as const;
export const CHARA = 'chara' as const;
export const SCENE = 'scene' as const;

export const HAPPENED_AFTER = 'HAPPENED_AFTER' as const;
export const LED_TO = 'LED_TO' as const;
export const AFFECTED = 'AFFECTED' as const;
export const OCCURRED_IN = 'OCCURRED_IN' as const;
export const HAS_RELATIONSHIP = 'HAS_RELATIONSHIP' as const;
export const PARTICIPATED_IN = 'PARTICIPATED_IN' as const;
export const CONTAINS = 'CONTAINS' as const;

export enum NodeEnum {
  event = 'event',
  chara = 'chara',
  scene = 'scene',
}
export type NodeType = keyof typeof NodeEnum;

export enum RelationEnum {
  HAPPENED_AFTER = 'HAPPENED_AFTER',
  LED_TO = 'LED_TO',
  AFFECTED = 'AFFECTED',
  OCCURRED_IN = 'OCCURRED_IN',
  HAS_RELATIONSHIP = 'HAS_RELATIONSHIP',
  PARTICIPATED_IN = 'PARTICIPATED_IN',
  CONTAINS = 'CONTAINS',
}
export type RelationType = keyof typeof RelationEnum;

export const RelationSchema = {
  [HAPPENED_AFTER]: { from: EVENT, to: EVENT },
  [LED_TO]: { from: EVENT, to: EVENT },
  [AFFECTED]: { from: EVENT, to: EVENT },
  [OCCURRED_IN]: { from: EVENT, to: SCENE },
  [HAS_RELATIONSHIP]: { from: CHARA, to: CHARA },
  [PARTICIPATED_IN]: { from: CHARA, to: EVENT },
  [CONTAINS]: { from: SCENE, to: SCENE },
} as const;
