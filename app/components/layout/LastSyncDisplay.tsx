import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale/es";
import { Package } from "lucide-react";

export const DeploymentTimeDisplay = () => {
  const [deploymentTime, setDeploymentTime] = useState<Date | null>(null);

  useEffect(() => {
    fetch("/version.json")
      .then((res) => res.json())
      .then((data) => setDeploymentTime(new Date(data.deployedAt)));
  }, []);

  if (!deploymentTime) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-gray-500 mt-4 p-4 mx-6 bg-gray-50 rounded-lg">
      <Package className="h-4 w-4 text-[#140a9a]" />
      <span>
        Última actualización:{" "}
        {format(deploymentTime, "d 'de' MMMM 'a las' HH:mm", { locale: es })}
      </span>
    </div>
  );
};
