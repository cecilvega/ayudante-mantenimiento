import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function UpdateButton() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      // Check for updates periodically
      const checkForUpdates = async () => {
        try {
          const registration = await navigator.serviceWorker.ready;

          if (registration.waiting) {
            setUpdateAvailable(true);
          }

          // Set up update check
          registration.addEventListener("updatefound", () => {
            if (registration.installing) {
              registration.installing.addEventListener("statechange", () => {
                if (registration.waiting) {
                  setUpdateAvailable(true);
                }
              });
            }
          });
        } catch (error) {
          console.error("Error checking for updates:", error);
        }
      };

      // Check initially and every hour
      checkForUpdates();
      const interval = setInterval(checkForUpdates, 60 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, []);

  const updateApp = async () => {
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.ready;
      if (registration.waiting) {
        // Send skip waiting message
        registration.waiting.postMessage({ type: "SKIP_WAITING" });
        window.location.reload();
      }
    }
  };

  if (!updateAvailable) {
    return (
      <Button
        variant="ghost"
        className="w-full justify-start text-gray-500 hover:bg-gray-100 transition-colors duration-300 text-xl py-5"
        disabled
      >
        <RefreshCw className="mr-4 h-7 w-7" />
        No hay actualizaciones
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      onClick={updateApp}
      className="w-full justify-start text-green-600 hover:bg-green-50 transition-colors duration-300 text-xl py-5"
    >
      <RefreshCw className="mr-4 h-7 w-7 animate-spin" />
      Actualizar Aplicación
    </Button>
  );
}
