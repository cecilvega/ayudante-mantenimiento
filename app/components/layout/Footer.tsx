import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ClipboardListIcon,
  ShieldIcon,
  WrenchIcon,
  HomeIcon,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#140a9a] text-white p-2 fixed bottom-0 left-0 right-0">
      <div className="container mx-auto">
        <div className="grid grid-cols-4 gap-1">
          <Link href="/." passHref>
            <Button
              variant="ghost"
              className="w-full h-16 text-white hover:bg-white hover:text-[#140a9a] transition-colors duration-300"
            >
              <div className="flex flex-col items-center">
                <HomeIcon className="h-6 w-6 mb-1" />
                <span className="text-xs font-semibold text-center">
                  Inicio
                </span>
              </div>
            </Button>
          </Link>
          <Link href="/attendance" passHref>
            <Button
              variant="ghost"
              className="w-full h-16 text-white hover:bg-white hover:text-[#140a9a] transition-colors duration-300"
            >
              <div className="flex flex-col items-center">
                <ClipboardListIcon className="h-6 w-6 mb-1" />
                <span className="text-xs font-semibold text-center">
                  Asistencia
                </span>
              </div>
            </Button>
          </Link>
          <Link href="/maintenance" passHref>
            <Button
              variant="ghost"
              className="w-full h-16 text-white hover:bg-white hover:text-[#140a9a] transition-colors duration-300"
            >
              <div className="flex flex-col items-center">
                <WrenchIcon className="h-6 w-6 mb-1" />
                <span className="text-xs font-semibold text-center">
                  Mantención
                </span>
              </div>
            </Button>
          </Link>
          <Link href="/admin" passHref>
            <Button
              variant="ghost"
              className="w-full h-16 text-white hover:bg-white hover:text-[#140a9a] transition-colors duration-300"
            >
              <div className="flex flex-col items-center">
                <ShieldIcon className="h-6 w-6 mb-1" />
                <span className="text-xs font-semibold text-center">Admin</span>
              </div>
            </Button>
          </Link>
        </div>
      </div>
    </footer>
  );
}
