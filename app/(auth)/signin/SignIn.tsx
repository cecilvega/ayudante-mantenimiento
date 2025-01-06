"use client";

import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/config/firebase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserIcon } from "lucide-react";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/.");
    } catch (error) {
      setError("Failed to sign in. Please check your credentials.");
      console.error("Error signing in:", error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="bg-[#140a9a] text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
          <UserIcon className="mr-2 h-6 w-6" />
          Iniciar Sesión
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#140a9a]">
              Correo
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="border-gray-300 focus:border-[#140a9a] focus:ring-[#140a9a]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-[#140a9a]">
              Contraseña
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="border-gray-300 focus:border-[#140a9a] focus:ring-[#140a9a]"
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button
            type="submit"
            className="w-full bg-[#140a9a] text-white hover:bg-[#1e14b3] transition-colors duration-300"
          >
            Iniciar Sesión
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
