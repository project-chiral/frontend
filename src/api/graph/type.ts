import { NodeType, RelationType } from './schema';

export type NodeId = {
  type: NodeType;
  id: number;
};

export type RelationId = {
  type: RelationType;
  from?: number;
  to?: number;
};
