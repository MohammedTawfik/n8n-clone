import { Connection, Node } from '@/lib/generated/prisma/client';
import toposort from 'toposort';

/**
 * Validates that all connections reference nodes that exist in the nodes array
 */
function validateConnections(nodes: Node[], connections: Connection[]): void {
  const nodeIds = new Set(nodes.map((node) => node.id));
  
  for (const connection of connections) {
    if (!nodeIds.has(connection.sourceNodeId)) {
      throw new Error(
        `Connection references non-existent source node: ${connection.sourceNodeId}`
      );
    }
    if (!nodeIds.has(connection.targetNodeId)) {
      throw new Error(
        `Connection references non-existent target node: ${connection.targetNodeId}`
      );
    }
    if (connection.sourceNodeId === connection.targetNodeId) {
      throw new Error(
        `Self-loop detected: node ${connection.sourceNodeId} connects to itself`
      );
    }
  }
}

/**
 * Detects cycles in the dependency graph using DFS
 */
function detectCycles(nodes: Node[], connections: Connection[]): void {
  const nodeIds = new Set(nodes.map((node) => node.id));
  const adjacencyList = new Map<string, string[]>();
  
  // Initialize adjacency list for all nodes
  for (const nodeId of nodeIds) {
    adjacencyList.set(nodeId, []);
  }
  
  // Build adjacency list from connections
  for (const connection of connections) {
    const neighbors = adjacencyList.get(connection.sourceNodeId) || [];
    neighbors.push(connection.targetNodeId);
    adjacencyList.set(connection.sourceNodeId, neighbors);
  }
  
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const cyclePath: string[] = [];
  
  function dfs(nodeId: string): boolean {
    if (recursionStack.has(nodeId)) {
      // Found a cycle, build the cycle path
      const cycleStart = cyclePath.indexOf(nodeId);
      const cycle = cyclePath.slice(cycleStart).concat(nodeId);
      throw new Error(
        `Circular dependency detected: ${cycle.join(' -> ')}`
      );
    }
    
    if (visited.has(nodeId)) {
      return false;
    }
    
    visited.add(nodeId);
    recursionStack.add(nodeId);
    cyclePath.push(nodeId);
    
    const neighbors = adjacencyList.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (dfs(neighbor)) {
        return true;
      }
    }
    
    recursionStack.delete(nodeId);
    cyclePath.pop();
    return false;
  }
  
  // Check all nodes for cycles
  for (const nodeId of nodeIds) {
    if (!visited.has(nodeId)) {
      dfs(nodeId);
    }
  }
}

/**
 * Sorts nodes in topological order for execution.
 * Ensures that nodes are executed only after all their dependencies have been executed.
 * 
 * @param nodes - Array of nodes to sort
 * @param connections - Array of connections representing dependencies (source -> target)
 * @returns Array of nodes sorted in topological order
 * @throws Error if validation fails, cycles are detected, or sorting fails
 */
export const sortNodes = (nodes: Node[], connections: Connection[]): Node[] => {
  // Validate input
  if (!nodes || !Array.isArray(nodes)) {
    throw new Error('Nodes must be a non-null array');
  }
  if (!connections || !Array.isArray(connections)) {
    throw new Error('Connections must be a non-null array');
  }
  
  // Handle empty nodes array
  if (nodes.length === 0) {
    return [];
  }
  
  // Handle case with no connections - return nodes in deterministic order
  if (connections.length === 0) {
    // Sort by creation time for deterministic ordering
    return [...nodes].sort((a, b) => {
      const timeA = a.createdAt.getTime();
      const timeB = b.createdAt.getTime();
      if (timeA !== timeB) {
        return timeA - timeB;
      }
      // Fallback to ID comparison for nodes created at the same time
      return a.id.localeCompare(b.id);
    });
  }
  
  // Validate that all connections reference existing nodes
  validateConnections(nodes, connections);
  
  // Detect cycles before attempting topological sort
  detectCycles(nodes, connections);
  
  // Build edges array for toposort (source -> target means source must execute before target)
  const edges: [string, string][] = connections.map((connection) => [
    connection.sourceNodeId,
    connection.targetNodeId,
  ]);
  
  // Find isolated nodes (nodes with no incoming or outgoing connections)
  const connectedNodeIds = new Set<string>();
  for (const connection of connections) {
    connectedNodeIds.add(connection.sourceNodeId);
    connectedNodeIds.add(connection.targetNodeId);
  }
  
  const isolatedNodes = nodes.filter((node) => !connectedNodeIds.has(node.id));
  
  // Perform topological sort
  let sortedNodeIds: string[];
  try {
    sortedNodeIds = toposort(edges);
    
    // Remove duplicates while preserving order (toposort may include duplicates)
    const seen = new Set<string>();
    sortedNodeIds = sortedNodeIds.filter((id) => {
      if (seen.has(id)) {
        return false;
      }
      seen.add(id);
      return true;
    });
  } catch (error) {
    // This should not happen since we detect cycles above, but handle it anyway
    if (error instanceof Error) {
      throw new Error(`Topological sort failed: ${error.message}`);
    }
    throw new Error('Topological sort failed: Unknown error');
  }
  
  // Create a map for quick node lookup
  const nodeMap = new Map<string, Node>();
  for (const node of nodes) {
    nodeMap.set(node.id, node);
  }
  
  // Map sorted node IDs to actual nodes
  const sortedNodes: Node[] = [];
  for (const nodeId of sortedNodeIds) {
    const node = nodeMap.get(nodeId);
    if (!node) {
      throw new Error(
        `Topological sort returned invalid node ID: ${nodeId}`
      );
    }
    sortedNodes.push(node);
  }
  
  // Add isolated nodes at the beginning (they can execute independently)
  // Sort isolated nodes deterministically
  const sortedIsolatedNodes = isolatedNodes.sort((a, b) => {
    const timeA = a.createdAt.getTime();
    const timeB = b.createdAt.getTime();
    if (timeA !== timeB) {
      return timeA - timeB;
    }
    return a.id.localeCompare(b.id);
  });
  
  // Combine isolated nodes (first) with sorted connected nodes
  const result = [...sortedIsolatedNodes, ...sortedNodes];
  
  // Final validation: ensure all nodes are included
  if (result.length !== nodes.length) {
    const resultIds = new Set(result.map((node) => node.id));
    const missingNodes = nodes.filter((node) => !resultIds.has(node.id));
    throw new Error(
      `Not all nodes were included in sorted result. Missing: ${missingNodes.map((n) => n.id).join(', ')}`
    );
  }
  
  return result;
};
