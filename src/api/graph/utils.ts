import type { QueryClient } from '@tanstack/react-query';
import { api } from '../index';
import { RelationSchema, type RelationType } from './schema';
import type { NodeId, RelationId } from './type';

export const invalidateRelation = (
  client: QueryClient,
  { type, from, to }: RelationId
) => {
  const { from: fromType, to: toType } = RelationSchema[type];
  client.invalidateQueries({
    queryKey: ['graph', { type: fromType, id: from }, type],
  });
  client.invalidateQueries({
    queryKey: ['graph', { type: toType, id: to }, type],
  });
};

export const invalidateNode = async (
  client: QueryClient,
  { type, id }: NodeId,
  relType: RelationType
) => {
  const nodes = await client.ensureQueryData({
    queryKey: ['graph', { type, id }, relType, 'node'],
    queryFn: () => api.graph.getRelatedNodes({ type, id, relType }),
  });

  client.invalidateQueries({ queryKey: ['graph', { type, id }, relType] });
  for (const node of nodes) {
    client.invalidateQueries({ queryKey: ['graph', node, relType] });
  }
};

export const removeNode = async (client: QueryClient, dto: NodeId) => {
  const nodes = await api.graph.getRelatedNodes(dto);

  client.removeQueries({ queryKey: ['graph', 'node', dto] });
  for (const node of nodes) {
    client.invalidateQueries({ queryKey: ['graph', node] });
  }
};
