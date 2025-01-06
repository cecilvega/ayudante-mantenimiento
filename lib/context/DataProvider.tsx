import React, { createContext, useContext, useState, useEffect } from "react";

interface DataContextType {
  lastSyncTime: Date | null;
  updateLastSyncTime: () => void;
}

export const DataContext = createContext<DataContextType | undefined>(
  undefined,
);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  const updateLastSyncTime = () => {
    setLastSyncTime(new Date());
  };

  // Update sync time when coming back online
  useEffect(() => {
    const handleOnline = () => {
      updateLastSyncTime();
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, []);

  return (
    <DataContext.Provider value={{ lastSyncTime, updateLastSyncTime }}>
      {children}
    </DataContext.Provider>
  );
}

// Custom hook to use the data context
export function useDataContext() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useDataContext must be used within a DataProvider");
  }
  return context;
}
