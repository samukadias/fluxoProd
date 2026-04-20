import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import DemandDetailContent from '@/Components/demands/DemandDetailContent';

export default function DemandDetailPage() {
    const navigate = useNavigate();
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
                <div className="mb-6">
                    <Button 
                        variant="ghost" 
                        onClick={() => navigate('/demands')} 
                        className="text-slate-600"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Voltar para Lista
                    </Button>
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
