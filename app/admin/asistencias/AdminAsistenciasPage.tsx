'use client'; // Add this at the top of the file

import React, { useState, useEffect } from 'react'
import {
    PlusIcon,
    TrashIcon,
    ChevronRightIcon,
    ChevronDownIcon
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Layout from "@/app/components/layout/Layout";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../firebase/config';

type Categoria = string
type Cargo = string

interface PersonaPredefinida {
    id: number
    nombre: string
    cargo: Cargo
    categoria: Categoria
}



export default function AdminAsistenciasPage() {

    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [cargos, setCargos] = useState<Cargo[]>([]);
    const [personasPredefinidas, setPersonasPredefinidas] = useState<PersonaPredefinida[]>([]);
    const [nuevaCategoria, setNuevaCategoria] = useState('');
    const [nuevoCargo, setNuevoCargo] = useState('');
    const [nuevaPersonaNombre, setNuevaPersonaNombre] = useState('');
    const [nuevaPersonaCargo, setNuevaPersonaCargo] = useState<Cargo | null>(null);
    const [nuevaPersonaCategoria, setNuevaPersonaCategoria] = useState<Categoria | null>(null);
    const [expandedCategories, setExpandedCategories] = useState<Set<Categoria>>(new Set());
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoriasRef = doc(db, 'admin', 'categorias');
                const cargosRef = doc(db, 'admin', 'cargos');
                const personasRef = doc(db, 'admin', 'personas');

                const [categoriasDoc, cargosDoc, personasDoc] = await Promise.all([
                    getDoc(categoriasRef),
                    getDoc(cargosRef),
                    getDoc(personasRef)
                ]);

                setCategorias(categoriasDoc.data()?.items || []);
                setCargos(cargosDoc.data()?.items || []);
                setPersonasPredefinidas(personasDoc.data()?.items || []);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();

        const handleOnline = () => {
            setIsOnline(true);
            setIsSyncing(true);
            enableNetwork(db).then(() => {
                fetchData().then(() => setIsSyncing(false));
            });
        };

        const handleOffline = () => {
            setIsOnline(false);
            disableNetwork(db);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const agregarCategoria = async () => {
        if (nuevaCategoria && !categorias.includes(nuevaCategoria)) {
            setCategorias([...categorias, nuevaCategoria]);
            setNuevaCategoria('');
            try {
                const categoriasRef = doc(db, 'admin', 'categorias');
                await updateDoc(categoriasRef, {
                    items: arrayUnion(nuevaCategoria)
                });
            } catch (error) {
                console.error("Error adding category:", error);
            }
        }
    };

    const eliminarCategoria = async (categoria: Categoria) => {
        setCategorias(categorias.filter(c => c !== categoria));
        setPersonasPredefinidas(personasPredefinidas.filter(p => p.categoria !== categoria));
        try {
            const categoriasRef = doc(db, 'admin', 'categorias');
            await updateDoc(categoriasRef, {
                items: arrayRemove(categoria)
            });
        } catch (error) {
            console.error("Error removing category:", error);
        }
    };

    const agregarCargo = async () => {
        if (nuevoCargo && !cargos.includes(nuevoCargo)) {
            setCargos([...cargos, nuevoCargo]);
            setNuevoCargo('');
            try {
                const cargosRef = doc(db, 'admin', 'cargos');
                await updateDoc(cargosRef, {
                    items: arrayUnion(nuevoCargo)
                });
            } catch (error) {
                console.error("Error adding cargo:", error);
            }
        }
    };

    const eliminarCargo = async (cargo: Cargo) => {
        setCargos(cargos.filter(c => c !== cargo));
        setPersonasPredefinidas(personasPredefinidas.filter(p => p.cargo !== cargo));
        try {
            const cargosRef = doc(db, 'admin', 'cargos');
            await updateDoc(cargosRef, {
                items: arrayRemove(cargo)
            });
        } catch (error) {
            console.error("Error removing cargo:", error);
        }
    };

    const agregarPersonaPredefinida = async () => {
        if (nuevaPersonaNombre && nuevaPersonaCargo && nuevaPersonaCategoria) {
            const nuevaPersona: PersonaPredefinida = {
                id: Date.now(),
                nombre: nuevaPersonaNombre,
                cargo: nuevaPersonaCargo,
                categoria: nuevaPersonaCategoria
            };
            setPersonasPredefinidas([...personasPredefinidas, nuevaPersona]);
            setNuevaPersonaNombre('');
            setNuevaPersonaCargo(null);
            setNuevaPersonaCategoria(null);
            try {
                const personasRef = doc(db, 'admin', 'personas');
                await updateDoc(personasRef, {
                    items: arrayUnion(nuevaPersona)
                });
            } catch (error) {
                console.error("Error adding person:", error);
            }
        }
    };

    const eliminarPersonaPredefinida = async (id: number) => {
        const personaToRemove = personasPredefinidas.find(p => p.id === id);
        if (personaToRemove) {
            setPersonasPredefinidas(personasPredefinidas.filter(p => p.id !== id));
            try {
                const personasRef = doc(db, 'admin', 'personas');
                await updateDoc(personasRef, {
                    items: arrayRemove(personaToRemove)
                });
            } catch (error) {
                console.error("Error removing person:", error);
            }
        }
    };

    const toggleCategoryExpansion = (categoria: Categoria) => {
        setExpandedCategories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(categoria)) {
                newSet.delete(categoria);
            } else {
                newSet.add(categoria);
            }
            return newSet;
        });
    };

    // const [categorias, setCategorias] = useState<Categoria[]>([]);
    // const [cargos, setCargos] = useState<Cargo[]>([]);
    // const [personasPredefinidas, setPersonasPredefinidas] = useState<PersonaPredefinida[]>([]);
    // const [nuevaCategoria, setNuevaCategoria] = useState('');
    // const [nuevoCargo, setNuevoCargo] = useState('');
    // const [nuevaPersonaNombre, setNuevaPersonaNombre] = useState('');
    // const [nuevaPersonaCargo, setNuevaPersonaCargo] = useState<Cargo | null>(null);
    // const [nuevaPersonaCategoria, setNuevaPersonaCategoria] = useState<Categoria | null>(null);
    // const [expandedCategories, setExpandedCategories] = useState<Set<Categoria>>(new Set());
    //
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const categoriasRef = doc(db, 'admin', 'categorias');
    //             const cargosRef = doc(db, 'admin', 'cargos');
    //             const personasRef = doc(db, 'admin', 'personas');
    //
    //             const [categoriasDoc, cargosDoc, personasDoc] = await Promise.all([
    //                 getDoc(categoriasRef),
    //                 getDoc(cargosRef),
    //                 getDoc(personasRef)
    //             ]);
    //
    //             setCategorias(categoriasDoc.data()?.items || []);
    //             setCargos(cargosDoc.data()?.items || []);
    //             setPersonasPredefinidas(personasDoc.data()?.items || []);
    //         } catch (error) {
    //             console.error("Error fetching data:", error);
    //         }
    //     };
    //
    //     fetchData();
    // }, []);
    //
    // const agregarCategoria = async () => {
    //     if (nuevaCategoria && !categorias.includes(nuevaCategoria)) {
    //         const categoriasRef = doc(db, 'admin', 'categorias');
    //         await updateDoc(categoriasRef, {
    //             items: arrayUnion(nuevaCategoria)
    //         });
    //         setCategorias([...categorias, nuevaCategoria]);
    //         setNuevaCategoria('');
    //     }
    // };
    //
    // const eliminarCategoria = async (categoria: Categoria) => {
    //     const categoriasRef = doc(db, 'admin', 'categorias');
    //     await updateDoc(categoriasRef, {
    //         items: arrayRemove(categoria)
    //     });
    //     setCategorias(categorias.filter(c => c !== categoria));
    //     setPersonasPredefinidas(personasPredefinidas.filter(p => p.categoria !== categoria));
    // };
    //
    // const agregarCargo = async () => {
    //     if (nuevoCargo && !cargos.includes(nuevoCargo)) {
    //         const cargosRef = doc(db, 'admin', 'cargos');
    //         await updateDoc(cargosRef, {
    //             items: arrayUnion(nuevoCargo)
    //         });
    //         setCargos([...cargos, nuevoCargo]);
    //         setNuevoCargo('');
    //     }
    // };
    //
    // const eliminarCargo = async (cargo: Cargo) => {
    //     const cargosRef = doc(db, 'admin', 'cargos');
    //     await updateDoc(cargosRef, {
    //         items: arrayRemove(cargo)
    //     });
    //     setCargos(cargos.filter(c => c !== cargo));
    //     setPersonasPredefinidas(personasPredefinidas.filter(p => p.cargo !== cargo));
    // };
    //
    // const agregarPersonaPredefinida = async () => {
    //     if (nuevaPersonaNombre && nuevaPersonaCargo && nuevaPersonaCategoria) {
    //         const nuevaPersona: PersonaPredefinida = {
    //             id: Date.now(),
    //             nombre: nuevaPersonaNombre,
    //             cargo: nuevaPersonaCargo,
    //             categoria: nuevaPersonaCategoria
    //         };
    //         const personasRef = doc(db, 'admin', 'personas');
    //         await updateDoc(personasRef, {
    //             items: arrayUnion(nuevaPersona)
    //         });
    //         setPersonasPredefinidas([...personasPredefinidas, nuevaPersona]);
    //         setNuevaPersonaNombre('');
    //         setNuevaPersonaCargo(null);
    //         setNuevaPersonaCategoria(null);
    //     }
    // };
    //
    // const eliminarPersonaPredefinida = async (id: number) => {
    //     const personaToRemove = personasPredefinidas.find(p => p.id === id);
    //     if (personaToRemove) {
    //         const personasRef = doc(db, 'admin', 'personas');
    //         await updateDoc(personasRef, {
    //             items: arrayRemove(personaToRemove)
    //         });
    //         setPersonasPredefinidas(personasPredefinidas.filter(p => p.id !== id));
    //     }
    // };

    // const toggleCategoryExpansion = (categoria: Categoria) => {
    //     setExpandedCategories(prev => {
    //         const newSet = new Set(prev);
    //         if (newSet.has(categoria)) {
    //             newSet.delete(categoria);
    //         } else {
    //             newSet.add(categoria);
    //         }
    //         return newSet;
    //     });
    // };

    // const agregarCategoria = async () => {
    //     if (nuevaCategoria && !categorias.includes(nuevaCategoria)) {
    //         const categoriasRef = doc(db, 'admin', 'categorias');
    //         await updateDoc(categoriasRef, {
    //             items: arrayUnion(nuevaCategoria)
    //         });
    //         setCategorias([...categorias, nuevaCategoria]);
    //         setNuevaCategoria('');
    //     }
    // };
    //
    // const eliminarCategoria = async (categoria: Categoria) => {
    //     const categoriasRef = doc(db, 'admin', 'categorias');
    //     await updateDoc(categoriasRef, {
    //         items: arrayRemove(categoria)
    //     });
    //     setCategorias(categorias.filter(c => c !== categoria));
    //     setPersonasPredefinidas(personasPredefinidas.filter(p => p.categoria !== categoria));
    // };
    //
    // const agregarCargo = async () => {
    //     if (nuevoCargo && !cargos.includes(nuevoCargo)) {
    //         const cargosRef = doc(db, 'admin', 'cargos');
    //         await updateDoc(cargosRef, {
    //             items: arrayUnion(nuevoCargo)
    //         });
    //         setCargos([...cargos, nuevoCargo]);
    //         setNuevoCargo('');
    //     }
    // };
    //
    // const eliminarCargo = async (cargo: Cargo) => {
    //     const cargosRef = doc(db, 'admin', 'cargos');
    //     await updateDoc(cargosRef, {
    //         items: arrayRemove(cargo)
    //     });
    //     setCargos(cargos.filter(c => c !== cargo));
    //     setPersonasPredefinidas(personasPredefinidas.filter(p => p.cargo !== cargo));
    // };
    //
    // const agregarPersonaPredefinida = async () => {
    //     if (nuevaPersonaNombre && nuevaPersonaCargo && nuevaPersonaCategoria) {
    //         const nuevaPersona: PersonaPredefinida = {
    //             id: Date.now(), // Simple ID generation
    //             nombre: nuevaPersonaNombre,
    //             cargo: nuevaPersonaCargo,
    //             categoria: nuevaPersonaCategoria
    //         };
    //         const personasRef = doc(db, 'admin', 'personas');
    //         await updateDoc(personasRef, {
    //             items: arrayUnion(nuevaPersona)
    //         });
    //         setPersonasPredefinidas([...personasPredefinidas, nuevaPersona]);
    //         setNuevaPersonaNombre('');
    //         setNuevaPersonaCargo(null);
    //         setNuevaPersonaCategoria(null);
    //     }
    // };
    //
    // const eliminarPersonaPredefinida = async (id: number) => {
    //     const personaToRemove = personasPredefinidas.find(p => p.id === id);
    //     if (personaToRemove) {
    //         const personasRef = doc(db, 'admin', 'personas');
    //         await updateDoc(personasRef, {
    //             items: arrayRemove(personaToRemove)
    //         });
    //         setPersonasPredefinidas(personasPredefinidas.filter(p => p.id !== id));
    //     }
    // };

    // const toggleCategoryExpansion = (categoria: Categoria) => {
    //     setExpandedCategories(prev => {
    //         const newSet = new Set(prev);
    //         if (newSet.has(categoria)) {
    //             newSet.delete(categoria);
    //         } else {
    //             newSet.add(categoria);
    //         }
    //         return newSet;
    //     });
    // };
    // const [categorias, setCategorias] = useState<Categoria[]>([]);
    // const [nuevaCategoria, setNuevaCategoria] = useState('');
    //
    // const [nuevoCargo, setNuevoCargo] = useState('')
    // const [nuevaPersonaNombre, setNuevaPersonaNombre] = useState('')
    // const [nuevaPersonaCargo, setNuevaPersonaCargo] = useState<Cargo | null>(null)
    // const [nuevaPersonaCategoria, setNuevaPersonaCategoria] = useState<Categoria | null>(null)
    // const [expandedCategories, setExpandedCategories] = useState<Set<Categoria>>(new Set())
    // // const [categorias, setCategorias] = useState<Categoria[]>([]);
    // // const [cargos, setCargos] = useState<Cargo[]>([]);
    // // const [personasPredefinidas, setPersonasPredefinidas] = useState<PersonaPredefinida[]>([]);
    //
    // useEffect(() => {
    //     const fetchData = async () => {
    //         const asistenciasRef = doc(db, 'admin', 'categorias');
    //         const cargosRef = doc(db, 'admin', 'cargos');
    //         const personasRef = doc(db, 'admin', 'personas');
    //
    //         const categoriasDoc = await getDoc(asistenciasRef);
    //         const cargosDoc = await getDoc(cargosRef);
    //         const personasDoc = await getDoc(personasRef);
    //         console.log("Fetched asistentes:", categoriasDoc);
    //
    //         setCategorias(categoriasDoc.data()?.items || []);
    //         setCargos(cargosDoc.data()?.items || []);
    //         setPersonasPredefinidas(personasDoc.data()?.items || []);
    //     };
    //
    //     fetchData();
    // }, []);
    //
    // const agregarCategoria = async () => {
    //     if (nuevaCategoria && !categorias.includes(nuevaCategoria)) {
    //         const categoriasRef = doc(db, 'admin', 'categorias');
    //         await updateDoc(categoriasRef, {
    //             items: arrayUnion(nuevaCategoria)
    //         });
    //         setCategorias([...categorias, nuevaCategoria]);
    //         setNuevaCategoria('');
    //
    //     }
    // };
    //
    // const eliminarCategoria = async (categoria: Categoria) => {
    //     const categoriasRef = doc(db, 'admin', 'categorias');
    //     await updateDoc(categoriasRef, {
    //         items: arrayRemove(categoria)
    //     });
    //     setCategorias(categorias.filter(c => c !== categoria));
    //     setPersonasPredefinidas(personasPredefinidas.filter(p => p.categoria !== categoria));
    // };
    //
    //
    // // const [categorias, setCategorias] = useState<Categoria[]>(['Administrativos KCH.', '7x7 KCH / KCC', 'PERSONAL ESOP', 'CUMMINS', 'REEMPLAZO. AT PALAS'])
    // const [cargos, setCargos] = useState<Cargo[]>(['Sub gerente', 'ADM KCH', 'Prevencion KCH', 'Jefe SSOMA', 'Jefe de Mantencion', 'Jefe RRHH', 'Ing. Gestion', 'Jefa de planificacion', 'SSOMA', 'Jefe Confiabilidad', 'Analista de Recursos Humanos', 'Coordinadora de Operaciones'])
    // const [personasPredefinidas, setPersonasPredefinidas] = useState<PersonaPredefinida[]>([
    //     { id: 1, nombre: 'Francisco Gonzalez', cargo: 'Sub gerente', categoria: 'Administrativos KCH.' },
    //     { id: 2, nombre: 'Derek Verdejo', cargo: 'ADM KCH', categoria: 'Administrativos KCH.' },
    //     { id: 3, nombre: 'Antonio Parraguez', cargo: 'Prevencion KCH', categoria: '7x7 KCH / KCC' },
    //     { id: 4, nombre: 'Gerson Rojas', cargo: 'Jefe SSOMA', categoria: 'Administrativos KCH.' },
    //     { id: 5, nombre: 'Cristian Salazar', cargo: 'Jefe de Mantencion', categoria: '7x7 KCH / KCC' },
    // ])
    //
    //
    // const agregarCargo = () => {
    //     if (nuevoCargo && !cargos.includes(nuevoCargo)) {
    //         setCargos([...cargos, nuevoCargo])
    //         setNuevoCargo('')
    //     }
    // }
    //
    // const eliminarCargo = (cargo: Cargo) => {
    //     setCargos(cargos.filter(c => c !== cargo))
    //     setPersonasPredefinidas(personasPredefinidas.filter(p => p.cargo !== cargo))
    // }
    //
    // const agregarPersonaPredefinida = () => {
    //     if (nuevaPersonaNombre && nuevaPersonaCargo && nuevaPersonaCategoria) {
    //         const nuevoId = Math.max(...personasPredefinidas.map(p => p.id), 0) + 1
    //         setPersonasPredefinidas([...personasPredefinidas, {
    //             id: nuevoId,
    //             nombre: nuevaPersonaNombre,
    //             cargo: nuevaPersonaCargo,
    //             categoria: nuevaPersonaCategoria
    //         }])
    //         setNuevaPersonaNombre('')
    //         setNuevaPersonaCargo(null)
    //         setNuevaPersonaCategoria(null)
    //     }
    // }
    //
    // const eliminarPersonaPredefinida = (id: number) => {
    //     setPersonasPredefinidas(personasPredefinidas.filter(p => p.id !== id))
    // }
    //
    // const toggleCategoryExpansion = (categoria: Categoria) => {
    //     setExpandedCategories(prev => {
    //         const newSet = new Set(prev)
    //         if (newSet.has(categoria)) {
    //             newSet.delete(categoria)
    //         } else {
    //             newSet.add(categoria)
    //         }
    //         return newSet
    //     })
    // }

    return (
        <Layout>  {/* Wrap the entire content with the Layout component */}
            <div className="min-h-screen bg-gray-50 flex flex-col">

                <main className="flex-grow flex items-center justify-center p-4">
                    <Card className="w-full max-w-4xl mx-auto shadow-lg">
                        <CardHeader className="bg-[#140a9a] text-white p-6">
                            <CardTitle className="text-3xl font-bold text-center">Administración de
                                Asistencia</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <Tabs defaultValue="categorias" className="space-y-6">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="categorias" className="text-[#140a9a]">Categorías</TabsTrigger>
                                    <TabsTrigger value="cargos" className="text-[#140a9a]">Cargos</TabsTrigger>
                                    <TabsTrigger value="personas" className="text-[#140a9a]">Personas
                                        Predefinidas</TabsTrigger>
                                </TabsList>
                                <TabsContent value="categorias">
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-2">
                                            <Input
                                                placeholder="Nueva categoría"
                                                value={nuevaCategoria}
                                                onChange={(e) => setNuevaCategoria(e.target.value)}
                                                className="flex-grow"
                                            />
                                            <Button onClick={agregarCategoria}
                                                    className="bg-[#140a9a] text-white hover:bg-[#1e14b3]">
                                                <PlusIcon className="h-4 w-4 mr-2"/>
                                                Agregar
                                            </Button>
                                        </div>
                                        <div className="bg-white rounded-lg shadow p-4">
                                            <h3 className="font-semibold mb-2 text-[#140a9a]">Categorías Actuales:</h3>
                                            <ul className="space-y-2">
                                                {categorias.map((categoria) => (
                                                    <li key={categoria}
                                                        className="flex justify-between items-center text-[#140a9a] border-b border-gray-200 py-2">
                                                        <span>{categoria}</span>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => eliminarCategoria(categoria)}
                                                            className="text-[#140a9a] hover:text-red-500"
                                                        >
                                                            <TrashIcon className="h-4 w-4"/>
                                                        </Button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </TabsContent>
                                <TabsContent value="cargos">
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-2">
                                            <Input
                                                placeholder="Nuevo cargo"
                                                value={nuevoCargo}
                                                onChange={(e) => setNuevoCargo(e.target.value)}
                                                className="flex-grow"
                                            />
                                            <Button onClick={agregarCargo}
                                                    className="bg-[#140a9a] text-white hover:bg-[#1e14b3]">
                                                <PlusIcon className="h-4 w-4 mr-2"/>
                                                Agregar
                                            </Button>
                                        </div>
                                        <div className="bg-white rounded-lg shadow p-4">
                                            <h3 className="font-semibold mb-2 text-[#140a9a]">Cargos Actuales:</h3>
                                            <ul className="space-y-2">
                                                {cargos.map((cargo) => (
                                                    <li key={cargo}
                                                        className="flex justify-between items-center text-[#140a9a] border-b border-gray-200 py-2">
                                                        <span>{cargo}</span>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => eliminarCargo(cargo)}
                                                            className="text-[#140a9a] hover:text-red-500"
                                                        >
                                                            <TrashIcon className="h-4 w-4"/>
                                                        </Button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </TabsContent>
                                <TabsContent value="personas">
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="nuevaPersonaNombre"
                                                       className="text-[#140a9a]">Nombre</Label>
                                                <Input
                                                    id="nuevaPersonaNombre"
                                                    placeholder="Nombre de la persona"
                                                    value={nuevaPersonaNombre}
                                                    onChange={(e) => setNuevaPersonaNombre(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="nuevaPersonaCargo"
                                                       className="text-[#140a9a]">Cargo</Label>
                                                <Select onValueChange={(valor) => setNuevaPersonaCargo(valor as Cargo)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Seleccionar cargo"/>
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
                                            <div>
                                                <Label htmlFor="nuevaPersonaCategoria"
                                                       className="text-[#140a9a]">Categoría</Label>
                                                <Select
                                                    onValueChange={(valor) => setNuevaPersonaCategoria(valor as Categoria)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Seleccionar categoría"/>
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
                                            <div className="flex items-end">
                                                <Button onClick={agregarPersonaPredefinida}
                                                        className="w-full bg-[#140a9a] text-white hover:bg-[#1e14b3]">
                                                    <PlusIcon className="h-4 w-4 mr-2"/>
                                                    Agregar Persona
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-lg shadow p-4">
                                            <h3 className="font-semibold mb-2 text-[#140a9a]">Personas
                                                Predefinidas:</h3>
                                            <div className="space-y-4">
                                                {categorias.map((categoria) => (
                                                    <div key={categoria} className="border rounded-lg p-2">
                                                        <div
                                                            className="flex items-center cursor-pointer"
                                                            onClick={() => toggleCategoryExpansion(categoria)}
                                                        >
                                                            {expandedCategories.has(categoria) ? (
                                                                <ChevronDownIcon
                                                                    className="h-4 w-4 mr-2 text-[#140a9a]"/>
                                                            ) : (
                                                                <ChevronRightIcon
                                                                    className="h-4 w-4 mr-2 text-[#140a9a]"/>
                                                            )}
                                                            <h4 className="font-medium text-[#140a9a]">{categoria}</h4>
                                                        </div>
                                                        {expandedCategories.has(categoria) && (
                                                            <ul className="mt-2 space-y-2 pl-6">
                                                                {personasPredefinidas
                                                                    .filter((persona) => persona.categoria === categoria)
                                                                    .map((persona) => (
                                                                        <li key={persona.id}
                                                                            className="flex justify-between items-center text-[#140a9a] border-b border-gray-200 py-2">
                                                                            <span>{persona.nombre} - {persona.cargo}</span>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() => eliminarPersonaPredefinida(persona.id)}
                                                                                className="text-[#140a9a] hover:text-red-500"
                                                                            >
                                                                                <TrashIcon className="h-4 w-4"/>
                                                                            </Button>
                                                                        </li>
                                                                    ))}
                                                            </ul>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </main>

            </div>
        </Layout>
    )

}