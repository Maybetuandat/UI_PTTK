import { useState } from "react";

// Custom Hook đóng vai trò ViewModel
export function useAppViewModel() {
  const [selectedScreen, setSelectedScreen] = useState("training"); // Mặc định

  return {
    selectedScreen,
    setSelectedScreen,
  };
}
