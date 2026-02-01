import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Building2, Layers, Calendar, UserCog, Database, X } from "lucide-react";

// Components
import UserManagement from './Users';
import ClientsTab from './Settings/tabs/ClientsTab';
import CyclesTab from './Settings/tabs/CyclesTab';
import HolidaysTab from './Settings/tabs/HolidaysTab';
import ImportExportTab from './Settings/tabs/ImportExportTab';

export default function SettingsPage() {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('users');

    useEffect(() => {
        const stored = localStorage.getItem('fluxo_user');
        if (stored) {
            setUser(JSON.parse(stored));
        }
    }, []);

    const isAdmin = user?.role === 'admin' || user?.role === 'manager' || user?.department === 'GOR';

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex items-center justify-center">
                <Card className="max-w-md border-0 shadow-lg">
                    <CardContent className="p-8 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <X className="w-8 h-8 text-red-500" />
                        </div>
                        <h2 className="text-xl font-semibold text-slate-700 mb-2">Acesso Restrito</h2>
                        <p className="text-slate-500">
                            Apenas gestores podem acessar a administração do sistema.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                        <UserCog className="w-8 h-8 text-indigo-600" />
                        Administração do Sistema
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Gerenciamento unificado de usuários, cadastros e configurações globais.
                    </p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="bg-white border border-slate-200 p-1 rounded-xl flex flex-wrap h-auto shadow-sm gap-1">
                        <TabsTrigger
                            value="users"
                            className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-lg flex-1 md:flex-none px-4 py-2"
                        >
                            <Users className="w-4 h-4 mr-2" />
                            Usuários
                        </TabsTrigger>

                        <TabsTrigger
                            value="clients"
                            className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-lg flex-1 md:flex-none px-4 py-2"
                        >
                            <Building2 className="w-4 h-4 mr-2" />
                            Clientes
                        </TabsTrigger>

                        <TabsTrigger
                            value="cycles"
                            className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-lg flex-1 md:flex-none px-4 py-2"
                        >
                            <Layers className="w-4 h-4 mr-2" />
                            Ciclos
                        </TabsTrigger>

                        <TabsTrigger
                            value="holidays"
                            className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-lg flex-1 md:flex-none px-4 py-2"
                        >
                            <Calendar className="w-4 h-4 mr-2" />
                            Feriados
                        </TabsTrigger>

                        <TabsTrigger
                            value="import_export"
                            className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-lg flex-1 md:flex-none px-4 py-2"
                        >
                            <Database className="w-4 h-4 mr-2" />
                            Sistema
                        </TabsTrigger>
                    </TabsList>

                    {/* Content Area */}
                    <div className="min-h-[500px]">
                        <TabsContent value="users" className="mt-0 focus-visible:outline-none animate-in fade-in-50 duration-300">
                            <UserManagement isEmbedded={true} />
                        </TabsContent>

                        <TabsContent value="clients" className="mt-0 focus-visible:outline-none animate-in fade-in-50 duration-300">
                            <ClientsTab />
                        </TabsContent>

                        <TabsContent value="cycles" className="mt-0 focus-visible:outline-none animate-in fade-in-50 duration-300">
                            <CyclesTab />
                        </TabsContent>

                        <TabsContent value="holidays" className="mt-0 focus-visible:outline-none animate-in fade-in-50 duration-300">
                            <HolidaysTab />
                        </TabsContent>

                        <TabsContent value="import_export" className="mt-0 focus-visible:outline-none animate-in fade-in-50 duration-300">
                            <ImportExportTab />
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
}
