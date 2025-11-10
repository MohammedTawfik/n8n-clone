import { useState } from 'react';
import UpgradeModal from '@/components/upgrade-modal';
import type { TRPCClientErrorLike } from '@trpc/client';
import type { AppRouter } from '@/trpc/routers/_app';

export const useUpgradeModel = () => {
  const [open, setOpen] = useState(false);
  const handleError = (error: unknown) => {
    // tRPC client errors have a data property with the error code
    if (error && typeof error === 'object' && 'data' in error) {
      const trpcError = error as TRPCClientErrorLike<AppRouter>;
      if (trpcError.data?.code === 'FORBIDDEN') {
        console.error(error);
        setOpen(true);
        return true;
      }
    }
    return false;
  };
  const modal = (
    <UpgradeModal
      open={open}
      onOpenChange={setOpen}
    />
  );
  return {
    modal,
    handleError,
  };
};
