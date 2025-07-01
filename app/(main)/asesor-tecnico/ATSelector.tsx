import React from "react";
import {ClipboardListIcon, WrenchIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";

export default function ATSelector() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl mx-auto shadow-lg">
          <CardHeader className="bg-[#140a9a] text-white p-6">
            <CardTitle className="text-3xl font-bold text-center">
              Bienvenidos al área Confiabilidad!
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">


            <div className="grid gap-6 md:grid-cols-2">
              <Link href="/asesor-tecnico/icc" passHref>
                <Button
                  variant="outline"
                  className="w-full h-40 text-center flex flex-col items-center justify-center space-y-4 p-4 hover:bg-gray-100 transition-colors duration-300 border-2 border-[#140a9a]"
                >
                  <ClipboardListIcon className="h-16 w-16 text-[#140a9a]" />
                  <div>
                    <h3 className="text-xl font-semibold text-[#140a9a]">
                      Cambios de Componentes
                    </h3>
                    <p className="text-sm text-gray-600 break-words">
                      Por cada cambio de componente que sale, un análisis
                    </p>
                  </div>
                </Button>
              </Link>

              <Link href="/asesor-tecnico/reporte-actividad" passHref>
                <Button
                  variant="outline"
                  className="w-full h-40 text-center flex flex-col items-center justify-center space-y-4 p-4 hover:bg-gray-100 transition-colors duration-300 border-2 border-[#140a9a]"
                >
                  <WrenchIcon className="h-16 w-16 text-[#140a9a]" />
                  <div>
                    <h3 className="text-xl font-semibold text-[#140a9a]">
                      Servicio al Cliente
                    </h3>
                    <p className="text-sm text-gray-600 break-words">
                      La pizarra de Andrés
                    </p>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
