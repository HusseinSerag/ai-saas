import { createContext, ReactNode, useContext, useState } from "react";

interface ProModal {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}
interface ProModalContextProps {
  children: ReactNode;
}
const ProModal = createContext<ProModal>({} as ProModal);

export function ProModalContext({ children }: ProModalContextProps) {
  const [isOpen, setIsOpen] = useState(false);
  function onOpen() {
    setIsOpen(true);
  }
  function onClose() {
    setIsOpen((o) => !o);
  }
  console.log(isOpen);
  return (
    <ProModal.Provider
      value={{
        isOpen,
        onClose,
        onOpen,
      }}
    >
      {children}
    </ProModal.Provider>
  );
}

export function useModal() {
  const context = useContext(ProModal);
  if (!context) {
    throw new Error("Cannot use useModal outside its context");
  }
  return context;
}
