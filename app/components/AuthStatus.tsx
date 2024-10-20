'use client'

import { useAuth } from '@/app/auth/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import Layout from '@/app/components/layout/Layout';

export default function AccountPage() {
    const { user } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await auth.signOut();
            router.push('/signin');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <Card className="w-full max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">Mi Cuenta</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {user ? (
                            <div className="space-y-4">
                                <p><strong>Email:</strong> {user.email}</p>
                                <p><strong>UID:</strong> {user.uid}</p>
                                <Button onClick={handleLogout} className="w-full">Cerrar Sesión</Button>
                            </div>
                        ) : (
                            <p>No hay usuario autenticado.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}