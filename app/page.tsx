'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { ClipboardListIcon, ShieldIcon, WrenchIcon, BoxIcon } from 'lucide-react'
import Layout from './components/layout/Layout'
import ProtectedRoute from '@/app/components/ProtectedRoute'

export default function Home() {
    return (
        <ProtectedRoute>
            <Layout>
                <div className="min-h-screen bg-gray-50 flex flex-col">
                    <main className="flex-grow flex items-center justify-center p-4">
                        <Card className="w-full max-w-6xl mx-auto shadow-lg">
                            <CardContent className="p-6">
                                <h1 className="text-4xl font-bold text-center text-[#140a9a] mb-8 tracking-tight">
                                    Ayudante Mantenimiento
                                </h1>
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                    <Link href="/registro-asistencia" passHref className="blo   ck h-full">
                                        <Button
                                            variant="outline"
                                            className="w-full h-full min-h-[10rem] text-center flex flex-col items-center justify-center space-y-4 p-4 hover:bg-gray-100 transition-colors duration-300 border-2 border-[#140a9a]"
                                        >
                                            <ClipboardListIcon className="h-12 w-12 sm:h-16 sm:w-16 text-[#140a9a]" />
                                            <div>
                                                <h3 className="text-lg sm:text-xl font-semibold text-[#140a9a]">Registro de Asistencia</h3>
                                                <p className="text-xs sm:text-sm text-gray-600">Gestionar asistencia diaria</p>
                                            </div>
                                        </Button>
                                    </Link>

                                    <Link href="/admin" passHref className="block h-full">
                                        <Button
                                            variant="outline"
                                            className="w-full h-full min-h-[10rem] text-center flex flex-col items-center justify-center space-y-4 p-4 hover:bg-gray-100 transition-colors duration-300 border-2 border-[#140a9a]"
                                        >
                                            <ShieldIcon className="h-12 w-12 sm:h-16 sm:w-16 text-[#140a9a]" />
                                            <div>
                                                <h3 className="text-lg sm:text-xl font-semibold text-[#140a9a]">Administración</h3>
                                                <p className="text-xs sm:text-sm text-gray-600">Acceder al panel de administración</p>
                                            </div>
                                        </Button>
                                    </Link>

                                    <Link href="/mantenimiento" passHref className="block h-full">
                                        <Button
                                            variant="outline"
                                            className="w-full h-full min-h-[10rem] text-center flex flex-col items-center justify-center space-y-4 p-4 hover:bg-gray-100 transition-colors duration-300 border-2 border-[#140a9a]"
                                        >
                                            <WrenchIcon className="h-12 w-12 sm:h-16 sm:w-16 text-[#140a9a]" />
                                            <div>
                                                <h3 className="text-lg sm:text-xl font-semibold text-[#140a9a]">Mantenimiento</h3>
                                                <p className="text-xs sm:text-sm text-gray-600">Registrar tareas realizadas</p>
                                            </div>
                                        </Button>
                                    </Link>

                                    <Link href="/misc" passHref className="block h-full">
                                        <Button
                                            variant="outline"
                                            className="w-full h-full min-h-[10rem] text-center flex flex-col items-center justify-center space-y-4 p-4 hover:bg-gray-100 transition-colors duration-300 border-2 border-[#140a9a]"
                                        >
                                            <BoxIcon className="h-12 w-12 sm:h-16 sm:w-16 text-[#140a9a]" />
                                            <div>
                                                <h3 className="text-lg sm:text-xl font-semibold text-[#140a9a]">Misceláneos</h3>
                                                <p className="text-xs sm:text-sm text-gray-600">Funcionalidades adicionales</p>
                                            </div>
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </main>
                </div>
            </Layout>
        </ProtectedRoute>
    )
}