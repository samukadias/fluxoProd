import React, { useState } from "react";
import { toast } from "sonner";
import { fluxoApi } from "@/api/fluxoClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Download, FileText, AlertTriangle, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const CONTRACT_FIELDS = [
  "id",
  "client_name",
  "pd_number",
  "responsible_analyst",
  "sei_process_number",
  "sei_send_area",
  "start_date",
  "end_date",
  "total_value",
  "notes",
  "esps",
  "gestor_email",
  "grupo_cliente",
  "termo",
  "objeto",
  "data_inicio_efetividade",
  "data_fim_efetividade",
  "status_vigencia"
];

export default function ImportExportDialog({ open, onOpenChange, contracts, onImportComplete }) {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState(null);

  const exportToExcel = async () => {
    const XLSX = await import('xlsx');
    setIsExporting(true);
    try {
      const data = contracts.map(contract => {
        const row = {};
        CONTRACT_FIELDS.forEach(field => {
          let value = contract[field];
          if (field === 'esps' && value) {
            value = typeof value === 'string' ? value : JSON.stringify(value);
          }
          row[field] = value;
        });
        return row;
      });

      const worksheet = XLSX.utils.json_to_sheet(data, { header: CONTRACT_FIELDS });
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Contratos CVAC");

      const fileName = `contratos_cvac_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      toast.success("Exportação concluída!");
    } catch (error) {
      console.error("Erro ao exportar:", error);
      toast.error("Erro ao exportar dados.");
    }
    setIsExporting(false);
  };

  const downloadTemplate = async () => {
    const XLSX = await import('xlsx');
    try {
      // Create headers but exclude 'id' for the template if they want to create new ones
      const templateFields = CONTRACT_FIELDS.filter(f => f !== 'id');
      const worksheet = XLSX.utils.aoa_to_sheet([templateFields]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Template");

      XLSX.writeFile(workbook, "modelo_importacao_contratos_cvac.xlsx");
    } catch (error) {
      console.error("Erro ao baixar template:", error);
    }
  };

  const parseDate = (dateInfo) => {
    if (!dateInfo) return null;
    if (typeof dateInfo === 'number') {
      const date = new Date(Math.round((dateInfo - 25569) * 86400 * 1000));
      return date.toISOString();
    }
    const dateString = String(dateInfo).trim();
    if (!dateString) return null;
    let date = new Date(dateString);
    if (!isNaN(date.getTime())) return date.toISOString();
    return null;
  };

  const handleFileImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsImporting(true);
    setImportStatus({ type: "info", message: "Lendo arquivo..." });

    const reader = new FileReader();
    reader.onload = async (e) => {
      const XLSX = await import('xlsx');
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        if (!rawData || rawData.length === 0) {
          throw new Error("O arquivo está vazio.");
        }

        const processed = rawData.map(row => {
          const item = { ...row };
          // Clean dates
          ["start_date", "end_date", "data_inicio_efetividade", "data_fim_efetividade"].forEach(f => {
            if (item[f]) item[f] = parseDate(item[f]);
          });
          // Clean numeric
          if (item.total_value) {
            item.total_value = typeof item.total_value === 'string' 
              ? parseFloat(item.total_value.replace(/[^\d.,-]/g, '').replace(',', '.')) 
              : parseFloat(item.total_value);
          }
          // Parse ESPS
          if (item.esps && typeof item.esps === 'string') {
            try { item.esps = JSON.parse(item.esps); } catch (e) { item.esps = []; }
          }
          return item;
        }).filter(item => item.client_name || item.pd_number);

        if (processed.length === 0) throw new Error("Nenhum contrato válido encontrado.");

        await fluxoApi.entities.FinanceContract.bulk(processed);
        setImportStatus({ type: "success", message: `Sucesso: ${processed.length} contratos processados.` });
        toast.success("Importação concluída!");
        onImportComplete();
      } catch (error) {
        console.error("Import error:", error);
        setImportStatus({ type: "error", message: error.message });
        toast.error("Erro na importação.");
      }
      setIsImporting(false);
    };
    reader.readAsArrayBuffer(file);
    event.target.value = "";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Importar/Exportar Contratos CVAC</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="export" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="export">Exportar</TabsTrigger>
            <TabsTrigger value="import">Importar</TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-4">
            <div className="text-center py-6">
              <FileText className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Exportar Dados</h3>
              <p className="text-gray-600 mb-6">Baixe todos os contratos em formato Excel.</p>
              <Button onClick={exportToExcel} disabled={isExporting || contracts.length === 0} className="bg-blue-600 hover:bg-blue-700">
                {isExporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                {isExporting ? "Exportando..." : `Baixar ${contracts.length} Contratos`}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="import" className="space-y-4 p-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Importante:</strong> Use o campo "id" para atualizar contratos existentes. Deixe vazio para criar novos.
              </AlertDescription>
            </Alert>

            <div className="text-center py-6 border-2 border-dashed rounded-lg">
              <Upload className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Importar Arquivo</h3>
              <div className="flex justify-center gap-4">
                <input type="file" accept=".xlsx, .xls" onChange={handleFileImport} className="hidden" id="contract-upload" disabled={isImporting} />
                <Button onClick={() => document.getElementById('contract-upload').click()} disabled={isImporting} className="bg-green-600 hover:bg-green-700">
                  {isImporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                  {isImporting ? "Importando..." : "Selecionar Excel"}
                </Button>
                <Button variant="outline" onClick={downloadTemplate}>
                  <Download className="w-4 h-4 mr-2" />
                  Modelo
                </Button>
              </div>
            </div>

            {importStatus && (
              <Alert variant={importStatus.type === "error" ? "destructive" : "default"} className={importStatus.type === "success" ? "bg-green-50 border-green-200" : ""}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{importStatus.message}</AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
