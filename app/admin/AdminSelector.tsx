import React from 'react'
import { AlertTriangleIcon, ClipboardListIcon, WrenchIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from 'next/link'
import Layout from '../components/layout/Layout'  // Import the Layout component

export default function AdminSelector() {
    return (
        <Layout>  {/* Wrap the entire content with the Layout component */}
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <main className="flex-grow flex items-center justify-center p-4">
                    <Card className="w-full max-w-4xl mx-auto shadow-lg">
                        <CardHeader className="bg-[#140a9a] text-white p-6">
                            <CardTitle className="text-3xl font-bold text-center">Panel de Administración</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <Alert variant="default" className="mb-6 bg-yellow-50 border-yellow-200 text-yellow-800">
                                <AlertTriangleIcon className="h-5 w-5 text-yellow-600" />
                                <AlertTitle className="text-lg font-semibold text-yellow-800">Advertencia</AlertTitle>
                                <AlertDescription className="text-sm text-yellow-700">
                                    Los cambios en la administración deben realizarse con precaución. Solo Cristian Salazar está autorizado para realizar modificaciones.
                                </AlertDescription>
                            </Alert>

                            <div className="grid gap-6 md:grid-cols-2">
                                <Link href="/admin/asistencias" passHref>
                                    <Button
                                        variant="outline"
                                        className="w-full h-40 text-center flex flex-col items-center justify-center space-y-4 p-4 hover:bg-gray-100 transition-colors duration-300 border-2 border-[#140a9a]"
                                    >
                                        <ClipboardListIcon className="h-16 w-16 text-[#140a9a]" />
                                        <div>
                                            <h3 className="text-xl font-semibold text-[#140a9a]">Asistencias</h3>
                                            <p className="text-sm text-gray-600 break-words">Gestionar categorías, cargos y personas</p>
                                        </div>
                                    </Button>
                                </Link>

                                <Link href="/admin/mantenimiento" passHref>
                                    <Button
                                        variant="outline"
                                        className="w-full h-40 text-center flex flex-col items-center justify-center space-y-4 p-4 hover:bg-gray-100 transition-colors duration-300 border-2 border-[#140a9a]"
                                    >
                                        <WrenchIcon className="h-16 w-16 text-[#140a9a]" />
                                        <div>
                                            <h3 className="text-xl font-semibold text-[#140a9a]">Mantenimiento</h3>
                                            <p className="text-sm text-gray-600 break-words">Gestionar tareas y registros</p>
                                        </div>
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </Layout>
    )
}