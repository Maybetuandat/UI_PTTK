// ToastContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Alert, Snackbar, Button } from "@mui/material";

interface ToastOptions {
  message: string;
  duration: number;
  onUndo: () => void;
}

interface ToastContextType {
  showToast: (message: string, duration: number, onUndo: () => void) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toast, setToast] = useState<ToastOptions | null>(null);

  const showToast = (message: string, duration: number, onUndo: () => void) => {
    setToast({ message, duration, onUndo });
  };

  const handleClose = () => {
    setToast(null);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && (
        <Snackbar
          open={true}
          autoHideDuration={toast.duration}
          onClose={handleClose}
        >
          <Alert
            severity="info"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => {
                  toast.onUndo();
                  handleClose();
                }}
              >
                HOÀN TÁC
              </Button>
            }
          >
            {toast.message}
          </Alert>
        </Snackbar>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
