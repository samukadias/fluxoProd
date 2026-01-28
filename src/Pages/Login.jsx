import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fluxoApi } from '@/api/fluxoClient';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Lock, Mail, Loader2 } from "lucide-react";

export default function LoginPage({ onLogin }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error("Por favor, preencha todos os campos.");
            return;
        }

        setIsLoading(true);

        try {
            const user = await fluxoApi.auth.login(email, password);
            toast.success(`Bem-vindo, ${user.name}!`);
            onLogin(user);
            navigate(user.role === 'requester' ? '/demands' : '/dashboard');
        } catch (error) {
            console.error(error);
            toast.error("Email ou senha inválidos.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50">
            <div className="w-full max-w-md px-4">
                <Card className="border-0 shadow-xl">
                    <CardHeader className="space-y-1 text-center pb-8">
                        <div className="mx-auto w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-4">
                            <span className="text-white font-bold text-xl">F</span>
                        </div>
                        <CardTitle className="text-2xl font-bold text-slate-900">FluxoProd</CardTitle>
                        <CardDescription>
                            Entre com suas credenciais para acessar
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="seu@email.com"
                                        className="pl-9"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Senha</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••"
                                        className="pl-9"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Entrando...
                                    </>
                                ) : (
                                    "Entrar"
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-2 text-center text-sm text-slate-500 bg-slate-50/50 p-6 rounded-b-xl border-t">
                        <p>Credenciais de teste:</p>
                        <div className="grid grid-cols-1 gap-1 text-xs">
                            <code>gestor@fluxo.com / 123 (Gestor)</code>
                            <code>responsavel@fluxo.com / 123 (Responsável)</code>
                            <code>solicitante@fluxo.com / 123 (Solicitante)</code>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
