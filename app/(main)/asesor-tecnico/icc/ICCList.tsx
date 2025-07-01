"use client";

import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/config/firebase";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ICCTableRow } from "./ICCTableRow";
import { ComponentChangeoutTask } from "@/lib/types";
import { Loader2 } from "lucide-react";

export function IccList() {
  const [changeouts, setChangeouts] = useState<ComponentChangeoutTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "component_changeouts"),
      orderBy("changeoutDate", "desc"),
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const data: ComponentChangeoutTask[] = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() } as ComponentChangeoutTask);
        });
        setChangeouts(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching component changeouts: ", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-[#140a9a]" />
      </div>
    );
  }

  return (
    <Table>
      <TableCaption>
        Lista de los últimos cambios de componentes.
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Foto</TableHead>
          <TableHead>Equipo</TableHead>
          <TableHead>Componente</TableHead>
          <TableHead>Posición</TableHead>
          <TableHead>Fecha de Cambio</TableHead>
          <TableHead>Pieza Afectada</TableHead>
          <TableHead>Modo de Falla</TableHead>
          <TableHead>ICC Completo</TableHead>
          <TableHead>Usar en EP</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {changeouts.map((changeout) => (
          <ICCTableRow key={changeout.id} changeout={changeout} />
        ))}
      </TableBody>
    </Table>
  );
}