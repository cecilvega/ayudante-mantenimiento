import React from "react";
import { Button } from "@/components/ui/button";
import { UserIcon, XIcon, LogOutIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/config/firebase";
import UpdateButton from "./UpdateButton";
import { DeploymentTimeDisplay } from "@/app/components/layout/LastSyncDisplay"; // Add this import

interface SideTabProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string | undefined;
}

export const SideTab: React.FC<SideTabProps> = ({
  isOpen,
  onClose,
  userEmail,
}) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push("/signin");
      onClose();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-lg transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 ease-in-out z-50`}
    >
      <div className="p-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-5 right-5 text-[#140a9a] hover:bg-[#140a9a] hover:text-white transition-colors duration-300"
        >
          <XIcon className="h-8 w-8" />
        </Button>
        <nav className="mt-20 space-y-6">
          {userEmail && (
            <div className="text-xl font-semibold text-[#140a9a] mb-6 break-all">
              {userEmail}
            </div>
          )}
          <Link href="/profile" passHref>
            <Button
              variant="ghost"
              className="w-full justify-start text-[#140a9a] hover:bg-[#140a9a] hover:text-white transition-colors duration-300 text-xl py-5"
            >
              <UserIcon className="mr-4 h-7 w-7" />
              Mi Cuenta
            </Button>
          </Link>

          {/* Add UpdateButton here */}
          <UpdateButton />

          <Button
            variant="ghost"
            className="w-full justify-start text-[#140a9a] hover:bg-[#140a9a] hover:text-white transition-colors duration-300 text-xl py-5"
            onClick={handleLogout}
          >
            <LogOutIcon className="mr-4 h-7 w-7" />
            Cerrar Sesión
          </Button>
        </nav>
      </div>
      <DeploymentTimeDisplay />
    </div>
  );
};
