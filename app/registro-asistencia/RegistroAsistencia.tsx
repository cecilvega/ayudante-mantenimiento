'use client'

import React, { useState, useEffect } from 'react'
import { PlusIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { addDays, subDays } from "date-fns"
import { Asistente, EstadoAsistencia, TipoTurno, Categoria, Cargo, PersonaPredefinida } from '../types/Asistencia'
import {DatePicker} from "./DatePicker"
// import { getDoc, doc } from 'firebase/firestore';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { estadosAsistencia, tiposTurno, categorias, cargos, personasPredefinidas, iconosPorEstado, iconosPorTurno, turnosPorEstado, estadosPorTurno } from './AsistenciaConstants'
import { format, startOfDay } from 'date-fns'
import {toZonedTime } from 'date-fns-tz'
import { doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';


export async function getAsistentesByDate(date: Date): Promise<Asistente[]> {
    const zonedDate = toZonedTime(date, 'America/Santiago');
    const dateString = format(zonedDate, 'yyyy-MM-dd');
    // const dateString = date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD

    const asistentesRef = collection(db, 'attendance', dateString, 'asistentes');

    try {
        const querySnapshot = await getDocs(asistentesRef);

        if (querySnapshot.empty) {
            console.log("No documents found for date:", dateString);
            return [];
        }

        const asistentes: Asistente[] = querySnapshot.docs.map(doc => {
            const data = doc.data();

            return {
                id: data.id,
                nombre: data.nombre,
                estado: data.estado,
                categoria: data.categoria,
                turno: data.turno,
                cargo: data.cargo
            } as Asistente;
        });

        console.log("Fetched asistentes:", asistentes);
        return asistentes;
    } catch (error) {
        console.error("Error fetching asistentes:", error);
        return [];
    }
}

export default function RegistroAsistencia() {
    const timeZone = 'America/Santiago' // UTC-3 for Chile
    const [fechaSeleccionada, setFechaSeleccionada] = useState(() => {
        const now = new Date()
        return startOfDay(toZonedTime(now, timeZone))
    })
    // const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date())
    // const [asistentes, setAsistentes] = useState<Asistente[]>([])
    const [asistentes, setAsistentes] = useState<Asistente[]>([])
    // const [isLoading, setIsLoading] = useState(true)
    // const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchAsistentes() {
            try {
                const fetchedAsistentes = await getAsistentesByDate(fechaSeleccionada);
                console.log("Fetched asistentes:", fetchedAsistentes);
                setAsistentes(fetchedAsistentes);
            } catch (error) {
                console.error("Error fetching asistentes:", error);
                setAsistentes([]); // Set to empty array in case of error
            }
        }

        fetchAsistentes();
    }, [fechaSeleccionada]);


    // const [asistentes, setAsistentes] = useState<Asistente[]>([
    //     { id: 1, nombre: 'Francisco Gonzalez', cargo: 'Sub gerente', categoria: 'Administrativos KCH.', estado: 'Presente', turno: 'Turno día' },
    //     { id: 2, nombre: 'Derek Verdejo', cargo: 'ADM KCH', categoria: 'Administrativos KCH.', estado: 'Presente', turno: 'Turno día' },
    //     { id: 3, nombre: 'Antonio Parraguez', cargo: 'Prevencion KCH', categoria: '7x7 KCH / KCC', estado: 'Presente', turno: 'Turno noche' },
    //     { id: 4, nombre: 'Gerson Rojas', cargo: 'Jefe SSOMA', categoria: 'Administrativos KCH.', estado: 'Presente', turno: 'Turno día' },
    //     { id: 5, nombre: 'Cristian Salazar', cargo: 'Jefe de Mantencion', categoria: '7x7 KCH / KCC', estado: 'Presente', turno: 'Descanso' },
    // ])
    const [nuevoNombre, setNuevoNombre] = useState('')
    const [nuevoCargo, setNuevoCargo] = useState<Cargo>('Undefined')
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(null)
    const [personaSeleccionada, setPersonaSeleccionada] = useState<PersonaPredefinida | null>(null)

    // const actualizarEstado = (id: number, nuevoEstado: EstadoAsistencia) => {
    //     setAsistentes(asistentes.map(asistente =>
    //         asistente.id === id ? { ...asistente, estado: nuevoEstado, turno: turnosPorEstado[nuevoEstado][0] } : asistente
    //     ))
    // }

    const actualizarEstado = async (id: number, nuevoEstado: EstadoAsistencia) => {
        const dateString = format(fechaSeleccionada, 'yyyy-MM-dd');
        const asistentesRef = collection(db, 'attendance', dateString, 'asistentes');
        const asistenteDocRef = doc(asistentesRef, id.toString());

        try {
            await updateDoc(asistenteDocRef, {
                estado: nuevoEstado,
                turno: turnosPorEstado[nuevoEstado][0]
            });
            setAsistentes(asistentes.map(asistente =>
                asistente.id === id ? { ...asistente, estado: nuevoEstado, turno: turnosPorEstado[nuevoEstado][0] } : asistente
            ));
        } catch (error) {
            console.error("Error updating estado:", error);
        }
    }

    // const actualizarTurno = (id: number, nuevoTurno: TipoTurno) => {
    //     setAsistentes(asistentes.map(asistente =>
    //         asistente.id === id ? { ...asistente, turno: nuevoTurno, estado: estadosPorTurno[nuevoTurno][0] } : asistente
    //     ))
    // }

    const actualizarTurno = async (id: number, nuevoTurno: TipoTurno) => {
        const dateString = format(fechaSeleccionada, 'yyyy-MM-dd');
        const asistentesRef = collection(db, 'attendance', dateString, 'asistentes');
        const asistenteDocRef = doc(asistentesRef, id.toString());

        try {
            await updateDoc(asistenteDocRef, {
                turno: nuevoTurno,
                estado: estadosPorTurno[nuevoTurno][0]
            });
            setAsistentes(asistentes.map(asistente =>
                asistente.id === id ? { ...asistente, turno: nuevoTurno, estado: estadosPorTurno[nuevoTurno][0] } : asistente
            ));
        } catch (error) {
            console.error("Error updating turno:", error);
        }
    }

    const contarEstados = (estado: EstadoAsistencia) =>
        asistentes.filter(a => a.estado === estado).length

    const contarTurnos = (turno: TipoTurno) =>
        asistentes.filter(a => a.turno === turno).length

    // const agregarPersona = (nombre: string, cargo: Cargo, categoria: Categoria) => {
    //     if (nombre && cargo && categoria) {
    //         const nuevoId = Math.max(...asistentes.map(a => a.id), 0) + 1
    //         setAsistentes([...asistentes, {
    //             id: nuevoId,
    //             nombre,
    //             cargo,
    //             categoria,
    //             estado: 'Presente',
    //             turno: 'Turno día'
    //         }])
    //         setNuevoNombre('')
    //         setNuevoCargo('Undefined')
    //         setCategoriaSeleccionada(null)
    //         setPersonaSeleccionada(null)
    //     }
    // }

    const agregarPersona = async (nombre: string, cargo: Cargo, categoria: Categoria) => {
        if (nombre && cargo && categoria) {
            const dateString = format(fechaSeleccionada, 'yyyy-MM-dd');
            const asistentesRef = collection(db, 'attendance', dateString, 'asistentes');
            const nuevoId = Math.max(...asistentes.map(a => a.id), 0) + 1;
            const nuevaPersona = {
                id: nuevoId,
                nombre,
                cargo,
                categoria,
                estado: 'Presente' as EstadoAsistencia,
                turno: 'Turno día' as TipoTurno
            };

            try {
                await setDoc(doc(asistentesRef, nuevoId.toString()), nuevaPersona);
                setAsistentes([...asistentes, nuevaPersona]);
                setNuevoNombre('');
                setNuevoCargo('Undefined');
                setCategoriaSeleccionada(null);
                setPersonaSeleccionada(null);
            } catch (error) {
                console.error("Error adding new person:", error);
            }
        }
    }

    // const eliminarPersona = (id: number) => {
    //     setAsistentes(asistentes.filter(a => a.id !== id))
    // }

    const eliminarPersona = async (id: number) => {
        const dateString = format(fechaSeleccionada, 'yyyy-MM-dd');
        const asistentesRef = collection(db, 'attendance', dateString, 'asistentes');
        const asistenteDocRef = doc(asistentesRef, id.toString());

        try {
            await deleteDoc(asistenteDocRef);
            setAsistentes(asistentes.filter(a => a.id !== id));
        } catch (error) {
            console.error("Error deleting person:", error);
        }
    }

    const cambiarFecha = (dias: number) => {
        setFechaSeleccionada(prevDate => dias > 0 ? addDays(prevDate, dias) : subDays(prevDate, Math.abs(dias)))
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
            <Card className="w-full max-w-4xl mx-auto shadow-lg">
                <CardHeader className="bg-[#140a9a] text-white p-6">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-2xl font-bold">Registro de Asistencia</CardTitle>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="bg-white text-[#140a9a] hover:bg-gray-100">
                                    <PlusIcon className="mr-2 h-4 w-4" />
                                    Gestionar Personal
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px] bg-white">
                                <DialogHeader>
                                    <DialogTitle className="text-[#140a9a]">Gestionar Personal</DialogTitle>
                                </DialogHeader>
                                <Tabs defaultValue="predefinido">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="predefinido">Predefinido</TabsTrigger>

                                        <TabsTrigger value="personalizado">Personalizado</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="predefinido">
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="categoria" className="text-right text-[#140a9a]">
                                                    Categoría
                                                </Label>
                                                <Select onValueChange={(valor) => setCategoriaSeleccionada(valor as Categoria)}>
                                                    <SelectTrigger className="col-span-3">
                                                        <SelectValue placeholder="Seleccionar categoría" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {categorias.map((categoria) => (
                                                            <SelectItem key={categoria} value={categoria}>
                                                                {categoria}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            {categoriaSeleccionada && (
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="personaPredefinida" className="text-right text-[#140a9a]">
                                                        Persona
                                                    </Label>
                                                    <Select onValueChange={(valor) => {
                                                        const persona = personasPredefinidas.find(p => p.nombre === valor)
                                                        setPersonaSeleccionada(persona || null)
                                                    }}>
                                                        <SelectTrigger className="col-span-3">
                                                            <SelectValue placeholder="Seleccionar persona" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {personasPredefinidas
                                                                .filter(p => p.categoria === categoriaSeleccionada)
                                                                .map((persona) => (
                                                                    <SelectItem key={persona.nombre} value={persona.nombre}>
                                                                        {persona.nombre}
                                                                    </SelectItem>
                                                                ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            )}
                                        </div>
                                        <Button onClick={() => personaSeleccionada && agregarPersona(personaSeleccionada.nombre, personaSeleccionada.cargo, personaSeleccionada.categoria)} className="w-full bg-[#140a9a] text-white hover:bg-[#1e14b3]">
                                            Agregar Persona Predefinida
                                        </Button>
                                    </TabsContent>
                                    <TabsContent value="personalizado">
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="nombre" className="text-right text-[#140a9a]">
                                                    Nombre
                                                </Label>
                                                <Input
                                                    id="nombre"
                                                    value={nuevoNombre}
                                                    onChange={(e) => setNuevoNombre(e.target.value)}
                                                    className="col-span-3"
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="cargo" className="text-right text-[#140a9a]">
                                                    Cargo
                                                </Label>
                                                <Select onValueChange={(valor) => setNuevoCargo(valor as Cargo)}>
                                                    <SelectTrigger className="col-span-3">
                                                        <SelectValue placeholder="Seleccionar cargo" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {cargos.map((cargo) => (
                                                            <SelectItem key={cargo} value={cargo}>
                                                                {cargo}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="categoria" className="text-right text-[#140a9a]">
                                                    Categoría
                                                </Label>
                                                <Select onValueChange={(valor) => setCategoriaSeleccionada(valor as Categoria)}>
                                                    <SelectTrigger className="col-span-3">
                                                        <SelectValue placeholder="Seleccionar categoría" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {categorias.map((categoria) => (
                                                            <SelectItem key={categoria} value={categoria}>
                                                                {categoria}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <Button onClick={() => categoriaSeleccionada && agregarPersona(nuevoNombre, nuevoCargo, categoriaSeleccionada)} className="w-full bg-[#140a9a] text-white hover:bg-[#1e14b3]">
                                            Agregar Persona Personalizada
                                        </Button>
                                    </TabsContent>
                                </Tabs>
                                <div className="mt-4">
                                    <h4 className="mb-2 font-semibold text-[#140a9a]">Personal Actual:</h4>
                                    <ul className="space-y-2">
                                        {asistentes.map((asistente) => (
                                            <li key={asistente.id} className="flex justify-between items-center text-[#140a9a]">
                                                <span>{asistente.nombre}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => eliminarPersona(asistente.id)}
                                                    className="text-[#140a9a] hover:text-red-500"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </Button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                        <Button variant="outline" className="bg-white text-[#140a9a]" onClick={() => cambiarFecha(-1)}>
                            <ChevronLeftIcon className="h-4 w-4" />
                        </Button>
                        <DatePicker
                            date={fechaSeleccionada}
                            setDate={setFechaSeleccionada}
                        />
                        <Button variant="outline" className="bg-white text-[#140a9a]" onClick={() => cambiarFecha(1)}>
                            <ChevronRightIcon className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="space-y-6">
                        {asistentes.map((asistente) => (
                            <div key={asistente.id} className="bg-white rounded-lg shadow p-4">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                                    <div>
                                        <h3 className="text-lg font-semibold">{asistente.nombre}</h3>
                                        <Badge variant="outline" className="mt-1 text-[#140a9a]">{asistente.cargo}</Badge>
                                    </div>
                                    <Badge variant="secondary" className="mt-2 sm:mt-0">{asistente.categoria}</Badge>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                    <Select
                                        value={asistente.estado}
                                        onValueChange={(valor) => actualizarEstado(asistente.id, valor as EstadoAsistencia)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Cambiar estado">
                        <span className="flex items-center gap-2">
                          {iconosPorEstado[asistente.estado]}
                            {asistente.estado}
                        </span>
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {estadosAsistencia.map((estado) => (
                                                <SelectItem key={estado} value={estado}>
                          <span className="flex items-center gap-2">
                            {iconosPorEstado[estado]}
                              {estado}
                          </span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Select
                                        value={asistente.turno}
                                        onValueChange={(valor) => actualizarTurno(asistente.id, valor as TipoTurno)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Cambiar turno">
                        <span className="flex items-center gap-2">
                          {iconosPorTurno[asistente.turno]}
                            {asistente.turno}
                        </span>
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {turnosPorEstado[asistente.estado].map((turno) => (
                                                <SelectItem key={turno} value={turno}>
                          <span className="flex items-center gap-2">
                            {iconosPorTurno[turno]}
                              {turno}
                          </span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 space-y-6">
                        <div className="bg-white rounded-lg shadow p-4">
                            <h3 className="font-semibold mb-2 text-[#140a9a]">Resumen de Estados</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                                {estadosAsistencia.map((estado) => (
                                    <div key={estado} className="flex items-center gap-2">
                                        {iconosPorEstado[estado]}
                                        <span className="font-medium">{estado}:</span> {contarEstados(estado)}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <h3 className="font-semibold mb-2 text-[#140a9a]">Resumen de Turnos</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                                {tiposTurno.map((turno) => (
                                    <div key={turno} className="flex items-center gap-2">
                                        {iconosPorTurno[turno]}
                                        <span className="font-medium">{turno}:</span> {contarTurnos(turno)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}