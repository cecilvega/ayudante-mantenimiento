"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  BedDouble,
  ChevronDown,
  ChevronUp,
  Home,
  Trash2,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import { useAttendanceContext } from "../contexts";
import { AttendanceRecord, Cama, EstadoAsistencia } from "@/lib/types";
import {
  ESTADOS_ASISTENCIA,
  ICONOS_POR_CAMA,
  ICONOS_POR_ESTADO,
  ICONOS_POR_TURNO,
} from "../constants";

export default function AttendanceList() {
  const {
    personas,
    attendances,
    setAttendances,
    handleUpdateAttendance,
    handleRemoveAttendance,
  } = useAttendanceContext();

  const [categoriasColapsadas, setCategoriasColapsadas] = useState<
    Record<string, boolean>
  >({});

  const toggleCategoria = (grupo: string) => {
    setCategoriasColapsadas((prev) => ({
      ...prev,
      [grupo]: !prev[grupo],
    }));
  };

  const actualizarEstado = async (id: string, estado: EstadoAsistencia) => {
    await handleUpdateAttendance(id, { estado });
  };

  const actualizarHabitacion = async (id: string, habitacion: number) => {
    await handleUpdateAttendance(id, { habitacion });
  };

  const actualizarCama = async (id: string, cama: Cama) => {
    await handleUpdateAttendance(id, { cama });
  };

  const eliminarPersona = async (id: string) => {
    // Update local state immediately
    setAttendances((prev) => {
      const newAttendances = { ...prev };
      delete newAttendances[id];
      return newAttendances;
    });

    // Sync with Firebase in background
    await handleRemoveAttendance([id]);
  };

  const eliminarGrupo = async (grupo: string) => {
    const asistentesGrupo = Object.values(attendances).filter(
      (asistente) => getGrupo(asistente) === grupo,
    );
    const idsToRemove = asistentesGrupo.map((a) => a.id);

    // Update local state immediately
    setAttendances((prev) => {
      const newAttendances = { ...prev };
      idsToRemove.forEach((id) => delete newAttendances[id]);
      return newAttendances;
    });

    await handleRemoveAttendance(idsToRemove);
  };

  const getGrupo = (asistente: AttendanceRecord): string => {
    return asistente.subcategoria !== "NA"
      ? asistente.subcategoria
      : asistente.categoria;
  };

  const getCargo = (rut: string): string => {
    const persona = Object.values(personas).find((p) => p.rut === rut);
    return persona ? persona.cargo : "No especificado";
  };

  const asistenciasAgrupadas = Object.values(attendances).reduce(
    (acc, asistente) => {
      const grupo = getGrupo(asistente);
      if (!acc[grupo]) acc[grupo] = [];
      acc[grupo].push(asistente);
      return acc;
    },
    {} as Record<string, AttendanceRecord[]>,
  );

  if (Object.keys(attendances).length === 0) {
    return (
      <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center p-8 bg-yellow-50 rounded-lg">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
            <p className="text-lg font-semibold text-yellow-700">
              No se ha registrado asistencia para este día
            </p>
            <p className="text-sm text-yellow-600 mt-2">
              Agregue personas para comenzar el registro de asistencia.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-2">
          {Object.entries(asistenciasAgrupadas).map(([grupo, asistentes]) => (
            <div key={grupo} className="bg-white rounded-lg overflow-hidden">
              <div
                className="flex items-center justify-between p-4 cursor-pointer bg-[#140a9a] text-white"
                onClick={() => toggleCategoria(grupo)}
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-full">
                    {grupo === "MN" ? (
                      <UserIcon className="h-6 w-6" />
                    ) : (
                      <UsersIcon className="h-6 w-6" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold">
                    {grupo === "MN" ? "4X3" : grupo}
                  </h3>
                  <Badge
                    variant="secondary"
                    className="bg-white/10 text-white ml-2"
                  >
                    {asistentes.length}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      eliminarGrupo(grupo);
                    }}
                    className="h-8 w-8 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Eliminar Grupo</span>
                  </Button>
                  {categoriasColapsadas[grupo] ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronUp className="h-5 w-5" />
                  )}
                </div>
              </div>

              {!categoriasColapsadas[grupo] && (
                <div className="divide-y divide-gray-100">
                  {asistentes.map((asistente) => (
                    <div
                      key={asistente.id}
                      className="p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h5 className="text-lg font-semibold text-[#140a9a]">
                              {asistente.nombre}
                            </h5>
                            <Badge
                              variant="outline"
                              className="bg-gray-50 text-gray-700 font-normal"
                            >
                              {getCargo(asistente.rut)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            RUT: {asistente.rut}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                          <div
                            className={`flex items-center gap-2 px-3 py-1 rounded-full ${ICONOS_POR_TURNO[asistente.turno].bgColor} ${ICONOS_POR_TURNO[asistente.turno].textColor}`}
                          >
                            {ICONOS_POR_TURNO[asistente.turno].icon}
                            <span className="text-sm font-medium">
                              {asistente.turno}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => eliminarPersona(asistente.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div>
                          <div className="text-sm font-medium text-gray-500 mb-2">
                            Estado
                          </div>
                          <Select
                            value={asistente.estado}
                            onValueChange={async (valor) => {
                              await actualizarEstado(
                                asistente.id,
                                valor as EstadoAsistencia,
                              );
                            }}
                          >
                            <SelectTrigger className="w-full bg-white border-gray-200">
                              <SelectValue>
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`p-1 rounded-full ${asistente.estado === "Presente" ? "bg-green-100" : "bg-gray-100"}`}
                                  >
                                    {ICONOS_POR_ESTADO[asistente.estado]}
                                  </span>
                                  <span>{asistente.estado}</span>
                                </div>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {ESTADOS_ASISTENCIA.map((estado) => (
                                <SelectItem key={estado} value={estado}>
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`p-1 rounded-full ${estado === "Presente" ? "bg-green-100" : "bg-gray-100"}`}
                                    >
                                      {ICONOS_POR_ESTADO[estado]}
                                    </span>
                                    <span>{estado}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <div className="text-sm font-medium text-gray-500 mb-2">
                            Habitación
                          </div>
                          <Select
                            value={
                              asistente.habitacion === -1
                                ? "no-asignado"
                                : asistente.habitacion.toString()
                            }
                            onValueChange={(valor) =>
                              actualizarHabitacion(
                                asistente.id,
                                valor === "no-asignado" ? -1 : parseInt(valor),
                              )
                            }
                          >
                            <SelectTrigger
                              className={`w-full bg-white border-gray-200 ${asistente.habitacion === -1 ? "bg-yellow-50 border-yellow-200" : ""}`}
                            >
                              <SelectValue>
                                <div className="flex items-center gap-2">
                                  <Home
                                    className={`h-4 w-4 ${asistente.habitacion === -1 ? "text-yellow-500" : "text-gray-500"}`}
                                  />
                                  <span>
                                    {asistente.habitacion === -1
                                      ? "Sin asignar"
                                      : asistente.habitacion}
                                  </span>
                                </div>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="no-asignado">
                                Sin asignar
                              </SelectItem>
                              {[...Array(10)].map((_, i) => (
                                <SelectItem
                                  key={i}
                                  value={(500 + i).toString()}
                                >
                                  {500 + i}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <div className="text-sm font-medium text-gray-500 mb-2">
                            Cama
                          </div>
                          <Select
                            value={asistente.cama}
                            onValueChange={(valor) =>
                              actualizarCama(asistente.id, valor as Cama)
                            }
                          >
                            <SelectTrigger
                              className={`w-full bg-white border-gray-200 ${asistente.cama === "NA" ? "bg-yellow-50 border-yellow-200" : ""}`}
                            >
                              <SelectValue>
                                <div className="flex items-center gap-2">
                                  <BedDouble
                                    className={`h-4 w-4 ${asistente.cama === "NA" ? "text-yellow-500" : "text-gray-500"}`}
                                  />
                                  {
                                    ICONOS_POR_CAMA[
                                      asistente.cama as keyof typeof ICONOS_POR_CAMA
                                    ]
                                  }
                                  <span>
                                    {asistente.cama === "NA"
                                      ? "No asignado"
                                      : asistente.cama}
                                  </span>
                                </div>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="NA">
                                <div className="flex items-center gap-2">
                                  {ICONOS_POR_CAMA.NA}
                                  <span>No asignado</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="Ventana">
                                <div className="flex items-center gap-2">
                                  {ICONOS_POR_CAMA.Ventana}
                                  <span>Ventana</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="Pasillo">
                                <div className="flex items-center gap-2">
                                  {ICONOS_POR_CAMA.Pasillo}
                                  <span>Pasillo</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
