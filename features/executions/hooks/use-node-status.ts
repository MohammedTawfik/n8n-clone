import { Realtime } from '@inngest/realtime';
import { NodeStatus } from '@/components/react-flow/node-status-indicator';
import { useState, useEffect } from 'react';
import { useInngestSubscription } from '@inngest/realtime/hooks';

interface UseNodeStatusProps {
  nodeId: string;
  channel: string;
  topic: string;
  refreshToken: () => Promise<Realtime.Subscribe.Token>;
}

export const useNodeStatus = ({
  nodeId,
  channel,
  topic,
  refreshToken,
}: UseNodeStatusProps) => {
  const [status, setStatus] = useState<NodeStatus>('initial');

  const { data } = useInngestSubscription({ refreshToken, enabled: true });

  useEffect(() => {
    if (!data?.length) {
      return;
    }

    // Find the latest message for this node
    const latestMessage = data
      .filter((msg) => {
        return (
          msg.kind === 'data' &&
          msg.topic === topic &&
          msg.channel === channel &&
          msg.data.nodeId === nodeId
        );
      })
      .sort((a, b) => {
        if (a.kind === 'data' && b.kind === 'data') {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
        return 0;
      })[0];

    if (!latestMessage) {
      return;
    }
    if (latestMessage?.kind === 'data') {
      setStatus((latestMessage.data.status as NodeStatus));
    }
  }, [data,nodeId,channel,topic]);

  return status ;
};
