import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import DemandDetailContent from './DemandDetailContent';

export default function DemandDetailModal({ demandId, isOpen, onOpenChange }) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto p-6 md:p-8">
                <DialogHeader className="sr-only">
                    <DialogTitle>Detalhes da Demanda</DialogTitle>
                </DialogHeader>
                
                {demandId && (
                    <DemandDetailContent 
                        demandId={demandId} 
                        isModal={true}
                        onBack={() => onOpenChange(false)}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
