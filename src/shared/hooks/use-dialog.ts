import { useBoolean } from './use-boolean';

export interface UseDialogReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setIsOpen: (value: boolean) => void;
  onOpenChange: (open: boolean) => void;
}

export const useDialog = (initialOpen = false): UseDialogReturn => {
  const [isOpen, setTrue, setFalse, setToggle, setValue] =
    useBoolean(initialOpen);

  return {
    isOpen,
    open: setTrue,
    close: setFalse,
    toggle: setToggle,
    setIsOpen: setValue,
    onOpenChange: setValue,
  };
};
