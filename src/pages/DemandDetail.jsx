import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import DemandDetailContent from '@/Components/demands/DemandDetailContent';

export default function DemandDetailPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const fromPresidencial = location.state?.from === 'presidencial';
    const urlParams = new URLSearchParams(window.location.search);
    const demandId = urlParams.get('id');

    if (!demandId) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-slate-700">ID da demanda não fornecido</h2>
                    <Button variant="link" onClick={() => navigate('/demands')} className="mt-4">
                        Voltar para lista
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6 flex items-center gap-2">
                    <Button 
                        variant="ghost" 
                        onClick={() => navigate('/demands')} 
                        className="text-slate-600"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Voltar para Lista
                    </Button>
                    {fromPresidencial && (
                        <Button
                            variant="outline"
                            onClick={() => navigate('/dashboard', { state: { tab: 'presidencial' } })}
                            className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-400"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Voltar para Visão Presidencial
                        </Button>
                    )}
                </div>
                
                <DemandDetailContent 
                    demandId={demandId} 
                    onBack={() => navigate('/demands')} 
                    isModal={false}
                />
            </div>
        </div>
    );
}
