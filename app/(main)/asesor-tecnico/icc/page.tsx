import MainLayout from "@/app/components/layout/MainLayout";
import { ICCList } from "./ICCList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardListIcon } from "lucide-react";

export default function ICCPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full mx-auto shadow-lg">
          <CardHeader className="bg-[#140a9a] text-white p-6">
            <div className="flex items-center gap-4">
              <ClipboardListIcon className="h-8 w-8" />
              <CardTitle className="text-3xl font-bold">
                Informe de Cambio de Componentes (ICC)
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <ICCList />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}