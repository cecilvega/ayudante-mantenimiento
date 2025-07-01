import React from "react";
import Image from "next/image";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";
import { ComponentChangeoutTask } from "@/lib/types";
import { componentNameMap, positionNameMap } from "../../maintenance/constants";

interface ICCTableRowProps {
  changeout: ComponentChangeoutTask;
}

export function ICCTableRow({ changeout }: ICCTableRowProps) {
  const {
    equipmentName,
    componentName,
    positionName,
    changeoutDate,
    failureDetails,
    isIccComplete,
    useInEp,
    imageUrl,
  } = changeout;

  const formattedDate = changeoutDate
    ? new Date(changeoutDate.seconds * 1000).toLocaleDateString("es-CL")
    : "N/A";

  return (
    <TableRow>
      <TableCell>
        <Image
          src={imageUrl || "/images/placeholder.png"}
          alt={componentName}
          width={64}
          height={64}
          className="rounded-md object-cover"
        />
      </TableCell>
      <TableCell className="font-medium">{equipmentName}</TableCell>
      <TableCell>
        {componentNameMap[componentName] || componentName}
      </TableCell>
      <TableCell>{positionNameMap[positionName] || positionName}</TableCell>
      <TableCell>{formattedDate}</TableCell>
      <TableCell>{failureDetails?.piezaAfectada || "N/A"}</TableCell>
      <TableCell>{failureDetails?.modoFalla || "N/A"}</TableCell>
      <TableCell>
        <Badge variant={isIccComplete ? "default" : "destructive"}>
          {isIccComplete ? (
            <CheckCircle2 className="mr-2 h-4 w-4" />
          ) : (
            <XCircle className="mr-2 h-4 w-4" />
          )}
          {isIccComplete ? "Completo" : "Incompleto"}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant={useInEp ? "default" : "outline"}>
          {useInEp ? "Sí" : "No"}
        </Badge>
      </TableCell>
    </TableRow>
  );
}