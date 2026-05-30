import { useState, useCallback } from 'react';
import ConfirmDialog from '../components/ui/ConfirmDialog';

const useConfirm = () => {
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'danger',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
  });
  const [resolver, setResolver] = useState(null);

  const openConfirm = useCallback((opts = {}) => {
    return new Promise((resolve) => {
      setDialogState({
        isOpen: true,
        title: opts.title || 'Are you sure?',
        message: opts.message || 'This action cannot be undone.',
        type: opts.type || 'danger',
        confirmLabel: opts.confirmLabel || 'Confirm',
        cancelLabel: opts.cancelLabel || 'Cancel',
      });
      setResolver(() => resolve);
    });
  }, []);

  const handleConfirm = useCallback(() => {
    setDialogState(s => ({ ...s, isOpen: false }));
    resolver?.(true);
  }, [resolver]);

  const handleCancel = useCallback(() => {
    setDialogState(s => ({ ...s, isOpen: false }));
    resolver?.(false);
  }, [resolver]);

  const confirmDialog = (
    <ConfirmDialog
      isOpen={dialogState.isOpen}
      type={dialogState.type}
      title={dialogState.title}
      message={dialogState.message}
      confirmLabel={dialogState.confirmLabel}
      cancelLabel={dialogState.cancelLabel}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );

  return { confirmDialog, openConfirm };
};

export default useConfirm;
