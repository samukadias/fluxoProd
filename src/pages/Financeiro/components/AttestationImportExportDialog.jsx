import React, { useState, useCallback } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from '@tanstack/react-query';
import {
  Upload, Download, FileText, AlertTriangle, Loader2,
  AlertCircle, TableProperties, CheckCircle2, XCircle, Info,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

// ─────────────────────────────────────────────────────────────
// Fields used for regular attestation export
// ─────────────────────────────────────────────────────────────
const ATTESTATION_FIELDS = [
  "id", "contract_id", "reference_month", "client_name", "pd_number",
  "responsible_analyst", "esp_number", "esp_value", "measurement_value",
  "billed_amount", "paid_amount", "status", "invoice_number", "nfe_issue_date",
  "nfe_sharepoint_date", "report_generation_date", "report_send_date",
  "attestation_return_date", "invoice_send_date", "invoice_send_to_client_date",
  "sei_process_number", "sei_send_area", "gestor_email", "notes", "observations",
];

// ─────────────────────────────────────────────────────────────
// Column mapping: Excel letter index (0-based) → system field
// A=0 … AA=26
// ─────────────────────────────────────────────────────────────
const COL_MAP = {
  1:  'client_name',                  // B
  2:  'pd_number',                    // C
  3:  'esp_number',                   // D
  13: 'sei_send_area',               // N
  14: 'sei_process_number',          // O
  15: 'measurement_value',           // P
  16: 'report_send_date',            // Q
  17: 'attestation_return_date',     // R
  18: 'invoice_send_to_client_date', // S
  19: 'nfe_sharepoint_date',         // T
  20: 'invoice_number',              // U
  21: 'nfe_issue_date',              // V
  22: 'billed_amount',               // W
  23: 'invoice_send_date',           // X
  24: 'observations',                // Y
  25: 'responsible_analyst',         // Z
  26: 'reference_month',             // AA
};

// ─────────────────────────────────────────────────────────────
// Parsers
// ─────────────────────────────────────────────────────────────

/** Excel serial or string → YYYY-MM-DD */
const parseDate = (v) => {
  if (!v && v !== 0) return null;
  if (typeof v === 'number') {
    if (v < 1000) return null; // not a date serial
    const d = new Date(Math.round((v - 25569) * 86400 * 1000));
    return d.toISOString().split('T')[0];
  }
  const s = String(v).trim();
  if (!s) return null;
  const dmy = s.match(/^(\d{2})[\/\-\.](\d{2})[\/\-\.](\d{4})$/);
  if (dmy) return `${dmy[3]}-${dmy[2]}-${dmy[1]}`;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d.toISOString().split('T')[0];
};

/** Parse string like "R$ 1.234,56" or number → float */
const parseCurrency = (v) => {
  if (v === null || v === undefined || v === '') return null;
  if (typeof v === 'number') return isNaN(v) ? null : v;
  const cleaned = String(v).replace(/[^\d.,-]/g, '').replace(',', '.');
  const n = parseFloat(cleaned);
  return isNaN(n) ? null : n;
};

/**
 * Parse reference month from many possible formats → YYYY-MM
 * Handles: "Jan/26", "Jan/2026", "Janeiro/2026", "01/2026",
 *          "2026-01", "01-2026", Excel serial (date object)
 */
const parseReferenceMonth = (v) => {
  if (!v) return null;

  // Excel date serial
  if (typeof v === 'number') {
    const d = new Date(Math.round((v - 25569) * 86400 * 1000));
    if (!isNaN(d.getTime())) {
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    }
    return null;
  }

  const s = String(v).trim();
  if (!s) return null;

  // Already YYYY-MM
  if (/^\d{4}-\d{2}$/.test(s)) return s;

  // MM/YYYY or MM-YYYY
  const mmYYYY = s.match(/^(\d{1,2})[\/\-](\d{4})$/);
  if (mmYYYY) return `${mmYYYY[2]}-${String(mmYYYY[1]).padStart(2, '0')}`;

  // Abbreviated month + 2-digit year: Jan/26, Fev/26 …
  const months3 = {
    jan:1, fev:2, mar:3, abr:4, mai:5, jun:6,
    jul:7, ago:8, set:9, out:10, nov:11, dez:12,
    feb:2, apr:4, may:5, aug:8, sep:9, oct:10, dec:12,
  };

  const abbr2 = s.match(/^([a-zA-ZçÇ]{3})[\p{P}\s\/\-]?(\d{2,4})$/u);
  if (abbr2) {
    const mon = months3[abbr2[1].toLowerCase()];
    if (mon) {
      let yr = parseInt(abbr2[2]);
      if (yr < 100) yr += 2000;
      return `${yr}-${String(mon).padStart(2, '0')}`;
    }
  }

  // Full Portuguese month name: "Janeiro/2026"
  const fullMonths = {
    janeiro:1, fevereiro:2, março:3, marco:3, abril:4, maio:5, junho:6,
    julho:7, agosto:8, setembro:9, outubro:10, novembro:11, dezembro:12,
  };
  const fullMatch = s.toLowerCase().match(/^([a-zçã]+)[\s\/\-](\d{2,4})$/);
  if (fullMatch) {
    const mon = fullMonths[fullMatch[1]];
    if (mon) {
      let yr = parseInt(fullMatch[2]);
      if (yr < 100) yr += 2000;
      return `${yr}-${String(mon).padStart(2, '0')}`;
    }
  }

  return null;
};

/**
 * Convert a raw xlsx row (array of cell values) into a system record
 * using COL_MAP.
 */
const mapRowToRecord = (rowArray) => {
  const rec = {};
  Object.entries(COL_MAP).forEach(([colIdx, field]) => {
    const raw = rowArray[parseInt(colIdx)];
    if (field === 'reference_month') {
      rec[field] = parseReferenceMonth(raw);
    } else if (['measurement_value', 'billed_amount'].includes(field)) {
      rec[field] = parseCurrency(raw);
    } else if ([
      'report_send_date', 'attestation_return_date', 'invoice_send_to_client_date',
      'nfe_sharepoint_date', 'nfe_issue_date', 'invoice_send_date',
    ].includes(field)) {
      rec[field] = parseDate(raw);
    } else {
      rec[field] = raw !== undefined && raw !== null ? String(raw).trim() : null;
      if (rec[field] === '') rec[field] = null;
    }
  });
  return rec;
};

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────
export default function AttestationImportExportDialog({
  open, onOpenChange, attestations = [], onImportComplete, contractId, pd_number,
}) {
  const [isExporting, setIsExporting]   = useState(false);
  const [isImporting, setIsImporting]   = useState(false);
  const [importStatus, setImportStatus] = useState(null);

  // BASE CVAC states
  const [previewRows, setPreviewRows]         = useState(null); // null = nothing loaded
  const [allMappedRows, setAllMappedRows]     = useState([]);
  const [importResult, setImportResult]       = useState(null);
  const [isImportingBase, setIsImportingBase] = useState(false);
  const [baseFileName, setBaseFileName]       = useState('');

  // FATURAMENTO MULTA states
  const [fatAnalyst, setFatAnalyst] = useState('');
  const [fatPreviewRows, setFatPreviewRows] = useState(null);
  const [fatMappedRows, setFatMappedRows] = useState([]);
  const [fatFileName, setFatFileName] = useState('');
  const [fatImportResult, setFatImportResult] = useState(null);
  const [isImportingFat, setIsImportingFat] = useState(false);

  const { data: analysts = [] } = useQuery({
    queryKey: ['cvac-analysts'],
    queryFn: () => fluxoApi.entities.User.list({ role: 'analyst', department: 'CVAC' })
  });

  // ── Regular Export ──────────────────────────────────────────
  const exportToExcel = async () => {
    const XLSX = await import('xlsx');
    setIsExporting(true);
    try {
      const data = attestations.map(att => {
        const row = {};
        ATTESTATION_FIELDS.forEach(f => { row[f] = att[f]; });
        return row;
      });
      const ws = XLSX.utils.json_to_sheet(data, { header: ATTESTATION_FIELDS });
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Atestações");
      const suffix = pd_number ? `_pd_${pd_number}` : '';
      XLSX.writeFile(wb, `atestacoes_cvac${suffix}_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success("Exportação concluída!");
    } catch (err) {
      toast.error("Erro ao exportar dados.");
    }
    setIsExporting(false);
  };

  const downloadTemplate = async () => {
    const XLSX = await import('xlsx');
    try {
      const fields = ATTESTATION_FIELDS.filter(f => f !== 'id');
      const ws = XLSX.utils.aoa_to_sheet([fields]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Template");
      XLSX.writeFile(wb, "modelo_importacao_atestacoes_cvac.xlsx");
    } catch (_) {}
  };

  // ── Regular Import (existing format) ───────────────────────
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
        const wb = XLSX.read(data, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rawData = XLSX.utils.sheet_to_json(ws, { defval: "" });
        if (!rawData?.length) throw new Error("O arquivo está vazio.");

        const processed = rawData.map(row => {
          const item = { ...row };
          ["report_generation_date","report_send_date","attestation_return_date",
           "invoice_send_date","nfe_issue_date","nfe_sharepoint_date"].forEach(f => {
            if (item[f]) item[f] = parseDate(item[f]);
          });
          ["billed_amount","paid_amount","measurement_value","esp_value"].forEach(f => {
            if (item[f]) item[f] = parseCurrency(item[f]);
          });
          if (contractId) item.contract_id = parseInt(contractId);
          return item;
        }).filter(i => i.contract_id || i.pd_number);

        if (!processed.length) throw new Error("Nenhuma atestação válida encontrada.");

        await fluxoApi.entities.MonthlyAttestation.bulk(processed);
        setImportStatus({ type: "success", message: `Sucesso: ${processed.length} atestações processadas.` });
        toast.success("Importação concluída!");
        onImportComplete();
      } catch (err) {
        setImportStatus({ type: "error", message: err.message });
        toast.error("Erro na importação.");
      }
      setIsImporting(false);
    };
    reader.readAsArrayBuffer(file);
    event.target.value = "";
  };

  // ── BASE CVAC: read & preview ───────────────────────────────
  const handleBaseCvacFileSelect = useCallback(async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    event.target.value = "";

    setPreviewRows(null);
    setAllMappedRows([]);
    setImportResult(null);
    setBaseFileName(file.name);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const XLSX = await import('xlsx');
      try {
        const data = new Uint8Array(e.target.result);
        // cellDates: false → keep serial numbers so we can parse them ourselves
        const wb = XLSX.read(data, { type: 'array', cellDates: false });
        const ws = wb.Sheets[wb.SheetNames[0]];
        // Read as array of arrays (preserves column positions A=0, B=1 …)
        const raw = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });

        // Skip header row (row 0). Filter out rows where column C (index 2) is empty.
        const dataRows = raw.slice(1).filter(r => r[2] !== null && r[2] !== undefined && String(r[2]).trim() !== '');
        if (!dataRows.length) {
          toast.error("Nenhuma linha de dados encontrada na planilha.");
          return;
        }

        const mapped = dataRows.map(mapRowToRecord);
        setAllMappedRows(mapped);
        setPreviewRows(mapped.slice(0, 5));
        toast.success(`${dataRows.length} linha(s) lida(s). Revise o preview e confirme a importação.`);
      } catch (err) {
        toast.error("Erro ao ler arquivo: " + err.message);
      }
    };
    reader.readAsArrayBuffer(file);
  }, []);

  // ── BASE CVAC: confirm import ───────────────────────────────
  const handleBaseCvacImport = async () => {
    if (!allMappedRows.length) return;
    setIsImportingBase(true);
    setImportResult(null);
    try {
      const result = await fluxoApi.entities.FinanceContract.importBaseCvac(allMappedRows);
      setImportResult(result);
      toast.success(`Importação concluída! ${result.created_attestations} atestação(ões) criada(s).`);
      onImportComplete();
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      setImportResult({ error: msg });
      toast.error("Erro na importação: " + msg);
    }
    setIsImportingBase(false);
  };

  const resetBaseCvac = () => {
    setPreviewRows(null);
    setAllMappedRows([]);
    setImportResult(null);
    setBaseFileName('');
  };

  // ── FATURAMENTO MULTA logic ──────────────────────────────────
  const handleFaturamentoFileSelect = async (event) => {
    if (!fatAnalyst) {
      toast.error("Por favor, selecione o Analista responsável antes de continuar.");
      return;
    }
    const file = event.target.files[0];
    if (!file) return;

    setFatFileName(file.name);
    try {
      const XLSX = await import('xlsx');
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const wb = XLSX.read(data, { type: 'array' });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const rawData = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });

          const rows = rawData.slice(1);
          const groups = {};
          rows.forEach((r, idx) => {
            const client = r[0];
            const pd = r[1];
            const esp = r[2];
            const rawDate = r[5]; // DT_INICIO_SERVICO
            const rawVal = r[16]; // VALOR_AUTORIZADO

            if (!pd || !esp) return;
            
            let month = null;
            if (rawDate) {
              const s = String(rawDate).trim();
              const dmyMatch = s.match(/^(\d{2})[\/\-\.](\d{2})[\/\-\.](\d{4})$/);
              if (dmyMatch) {
                // MM/DD/YYYY might be different, but Excel usually shows DD/MM/YYYY. dmyMatch parses as DD-MM-YYYY
                month = `${dmyMatch[3]}-${dmyMatch[2]}`;
              } else {
                 month = parseReferenceMonth(s);
              }
            }
            if (!month) return; 

            const val = parseCurrency(rawVal);
            const key = `${pd}|${esp}|${month}`;
            if (!groups[key]) {
              groups[key] = {
                client_name: client ? String(client).trim() : null,
                pd_number: String(pd).trim(),
                esp_number: String(esp).trim(),
                reference_month: month,
                measurement_value: 0,
                billed_amount: 0,
                responsible_analyst: fatAnalyst
              };
            }
            
            const num = val || 0;
            groups[key].measurement_value += num;
            groups[key].billed_amount += num;
          });

          const aggregated = Object.values(groups);
          setFatMappedRows(aggregated);
          setFatPreviewRows(aggregated.slice(0, 5));
          toast.success(`${rows.length} linha(s) lidas e agrupadas em ${aggregated.length} atestações.`);
        } catch (err) {
          toast.error("Erro interno ao ler arquivo: " + err.message);
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      toast.error('Erro ao ler a planilha de Faturamento');
    }
  };

  const confirmFaturamentoImport = async () => {
    if (fatMappedRows.length === 0) return;
    setIsImportingFat(true);
    try {
      const response = await fluxoApi.entities.FinanceContract.importBaseCvac(fatMappedRows);
      setFatImportResult(response);
      toast.success(`Importação concluída!`);
      if (onImportComplete) onImportComplete();
    } catch (err) {
      setFatImportResult({
        error: err.response?.data?.error || err.message
      });
      toast.error("Erro na importação: " + (err.response?.data?.error || err.message));
    } finally {
      setIsImportingFat(false);
    }
  };

  const resetFaturamento = () => {
     setFatPreviewRows(null);
     setFatMappedRows([]);
     setFatFileName('');
     setFatImportResult(null);
  };


  // ── Preview helpers ─────────────────────────────────────────
  const PREVIEW_COLS = [
    { key: 'pd_number',       label: 'Contrato' },
    { key: 'client_name',     label: 'Cliente' },
    { key: 'esp_number',      label: 'ESP' },
    { key: 'reference_month', label: 'Mês Ref.' },
    { key: 'billed_amount',   label: 'Val. Fat.' },
  ];

  const fmtVal = (key, val) => {
    if (val === null || val === undefined) return <span className="text-slate-300">—</span>;
    if (['billed_amount', 'measurement_value'].includes(key))
      return `R$ ${Number(val).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    return String(val);
  };

  // ─────────────────────────────────────────────────────────
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Importar / Exportar Atestações</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="import-base" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="import-base" className="flex items-center gap-1.5">
              <TableProperties className="w-4 h-4" />
              BASE CVAC
            </TabsTrigger>
            <TabsTrigger value="faturamento" className="flex items-center gap-1.5">
              Faturamento
            </TabsTrigger>
            <TabsTrigger value="export">Exportar</TabsTrigger>
            <TabsTrigger value="import">Importar (padrão)</TabsTrigger>
          </TabsList>

          {/* ══════════════════════════════════════════════════
              TAB: Importar BASE CVAC
          ══════════════════════════════════════════════════ */}
          <TabsContent value="import-base" className="space-y-4 pt-2">

            {/* Instruction notice */}
            <Alert className="border-blue-200 bg-blue-50">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 text-sm">
                Selecione a planilha <strong>BASE CVAC</strong> (colunas A—AA).
                O sistema verifica automaticamente se o contrato (coluna C) já existe.
                Atestações duplicadas são ignoradas.
              </AlertDescription>
            </Alert>

            {/* File selector */}
            {!previewRows && !importResult && (
              <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-blue-200 rounded-xl bg-blue-50/30 gap-4">
                <TableProperties className="w-14 h-14 text-blue-400" />
                <div className="text-center">
                  <p className="font-semibold text-slate-700">Selecione a planilha BASE CVAC</p>
                  <p className="text-sm text-slate-500 mt-1">Formato .xlsx ou .xls</p>
                </div>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleBaseCvacFileSelect}
                  className="hidden"
                  id="base-cvac-upload"
                />
                <Button
                  onClick={() => document.getElementById('base-cvac-upload').click()}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Selecionar Arquivo
                </Button>
              </div>
            )}

            {/* Preview */}
            {previewRows && !importResult && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      📄 {baseFileName}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {allMappedRows.length} linhas lidas — preview das primeiras 5
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={resetBaseCvac} className="text-slate-500">
                    Trocar arquivo
                  </Button>
                </div>

                {/* Preview table */}
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-50">
                      <tr>
                        {PREVIEW_COLS.map(c => (
                          <th key={c.key} className="px-3 py-2 text-left font-semibold text-slate-600 whitespace-nowrap">
                            {c.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewRows.map((row, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                          {PREVIEW_COLS.map(c => (
                            <td key={c.key} className="px-3 py-2 text-slate-700 whitespace-nowrap max-w-[160px] truncate">
                              {fmtVal(c.key, row[c.key])}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Warn rows with missing reference_month */}
                {(() => {
                  const bad = allMappedRows.filter(r => !r.reference_month).length;
                  return bad > 0 ? (
                    <Alert className="border-amber-200 bg-amber-50">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <AlertDescription className="text-amber-800 text-sm">
                        <strong>{bad}</strong> linha(s) com mês de referência não reconhecido —
                        serão ignoradas na importação.
                      </AlertDescription>
                    </Alert>
                  ) : null;
                })()}

                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={handleBaseCvacImport}
                    disabled={isImportingBase}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1"
                  >
                    {isImportingBase
                      ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Importando {allMappedRows.length} linhas…</>
                      : <><Upload className="w-4 h-4 mr-2" />Confirmar e Importar {allMappedRows.length} linhas</>
                    }
                  </Button>
                  <Button variant="outline" onClick={resetBaseCvac} disabled={isImportingBase}>
                    Cancelar
                  </Button>
                </div>
              </div>
            )}

            {/* Result report */}
            {importResult && (
              <div className="space-y-3">
                {importResult.error ? (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>{importResult.error}</AlertDescription>
                  </Alert>
                ) : (
                  <>
                    <Alert className="border-emerald-200 bg-emerald-50">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <AlertDescription className="text-emerald-800">
                        <strong>Importação concluída com sucesso!</strong>
                      </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 text-center">
                        <p className="text-2xl font-bold text-emerald-600">{importResult.created_attestations}</p>
                        <p className="text-xs text-slate-600 mt-1">Atestações criadas</p>
                      </div>
                      <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 text-center">
                        <p className="text-2xl font-bold text-slate-500">{importResult.merged_attestations}</p>
                        <p className="text-xs text-slate-600 mt-1">Atestações mescladas (já existiam)</p>
                      </div>
                      <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 text-center">
                        <p className="text-2xl font-bold text-blue-600">{importResult.created_contracts}</p>
                        <p className="text-xs text-slate-600 mt-1">Contratos criados</p>
                      </div>
                      <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 text-center">
                        <p className="text-2xl font-bold text-slate-500">{importResult.reused_contracts}</p>
                        <p className="text-xs text-slate-600 mt-1">Contratos reutilizados</p>
                      </div>
                    </div>

                    {importResult.errors?.length > 0 && (
                      <Alert className="border-amber-200 bg-amber-50">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        <AlertDescription>
                          <p className="font-semibold text-amber-800 mb-1">
                            {importResult.errors.length} erro(s) durante a importação:
                          </p>
                          <ul className="text-xs text-amber-700 space-y-0.5 max-h-32 overflow-y-auto">
                            {importResult.errors.map((e, i) => (
                              <li key={i}>• {e}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}
                  </>
                )}

                <Button variant="outline" onClick={resetBaseCvac} className="w-full">
                  Importar outro arquivo
                </Button>
              </div>
            )}
          </TabsContent>

          {/* ══════════════════════════════════════════════════
              TAB: Faturamento Multa
          ══════════════════════════════════════════════════ */}
          <TabsContent value="faturamento" className="space-y-4 p-4">
            <Alert className="border-blue-200 bg-blue-50">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                A importação agrupará linhas pelo <strong>Contrato + ESP + Mês</strong> e somará os Valores. 
                Os valores agregados preencherão simultaneamente Medição, Faturado e Pago da atestação correspondente.
              </AlertDescription>
            </Alert>

            {!fatPreviewRows && !fatImportResult && (
              <div className="space-y-4 border-2 border-dashed border-slate-200 rounded-xl p-6 bg-slate-50">
                 <div className="max-w-md mx-auto space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-slate-700 block mb-1">
                        1. Selecione o Analista CVAC
                      </label>
                      <Select value={fatAnalyst} onValueChange={setFatAnalyst}>
                          <SelectTrigger className="w-full bg-white">
                              <SelectValue placeholder="Selecione um analista" />
                          </SelectTrigger>
                          <SelectContent>
                              {analysts.map((a) => (
                                  <SelectItem key={a.id} value={a.name}>
                                      {a.name}
                                  </SelectItem>
                              ))}
                          </SelectContent>
                      </Select>
                    </div>

                    <div className="pt-2">
                      <label className="text-sm font-semibold text-slate-700 block mb-1">
                        2. Selecione a Planilha
                      </label>
                      <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleFaturamentoFileSelect}
                        className="hidden"
                        id="fat-upload"
                      />
                      <Button
                        onClick={() => document.getElementById('fat-upload').click()}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={!fatAnalyst}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Escolher e Processar Planilha
                      </Button>
                    </div>
                 </div>
              </div>
            )}

            {fatPreviewRows && !fatImportResult && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">📄 {fatFileName}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {fatMappedRows.length} atestações geradas (preview de 5)
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={resetFaturamento} className="text-slate-500">
                    Cancelar
                  </Button>
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-3 py-2 text-left">Contrato</th>
                        <th className="px-3 py-2 text-left">ESP</th>
                        <th className="px-3 py-2 text-left">Mês</th>
                        <th className="px-3 py-2 text-right">Valor Somado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fatPreviewRows.map((row, i) => (
                        <tr key={i} className="border-t border-slate-100">
                          <td className="px-3 py-2">{row.pd_number}</td>
                          <td className="px-3 py-2">{row.esp_number}</td>
                          <td className="px-3 py-2">{row.reference_month}</td>
                          <td className="px-3 py-2 text-right font-medium text-emerald-700">
                            {fmtVal('billed_amount', row.billed_amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={confirmFaturamentoImport}
                    disabled={isImportingFat}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1"
                  >
                    {isImportingFat
                      ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Importando...</>
                      : <><Upload className="w-4 h-4 mr-2" />Confirmar Importação de {fatMappedRows.length} Atestações</>
                    }
                  </Button>
                </div>
              </div>
            )}

            {fatImportResult && (
              <div className="space-y-3">
                {fatImportResult.error ? (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>{fatImportResult.error}</AlertDescription>
                  </Alert>
                ) : (
                  <>
                    <Alert className="border-emerald-200 bg-emerald-50">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <AlertDescription className="text-emerald-800">
                        <strong>Importação concluída com sucesso!</strong>
                      </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 text-center">
                        <p className="text-2xl font-bold text-emerald-600">{fatImportResult.created_attestations}</p>
                        <p className="text-xs text-slate-600 mt-1">Nuevas Criadas</p>
                      </div>
                      <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 text-center">
                        <p className="text-2xl font-bold text-slate-500">{fatImportResult.merged_attestations}</p>
                        <p className="text-xs text-slate-600 mt-1">Atestações Atualizadas</p>
                      </div>
                    </div>
                  </>
                )}
                <Button variant="outline" onClick={resetFaturamento} className="w-full">
                  Importar outro faturamento
                </Button>
              </div>
            )}
          </TabsContent>

          {/* ══════════════════════════════════════════════════
              TAB: Exportar
          ══════════════════════════════════════════════════ */}
          <TabsContent value="export" className="space-y-4">
            <div className="text-center py-6">
              <FileText className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Exportar Atestações</h3>
              <p className="text-gray-600 mb-6">Baixe o histórico atual em formato Excel.</p>
              <Button
                onClick={exportToExcel}
                disabled={isExporting || attestations.length === 0}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isExporting
                  ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Exportando...</>
                  : <><Download className="w-4 h-4 mr-2" />Baixar {attestations.length} Registros</>
                }
              </Button>
            </div>
          </TabsContent>

          {/* ══════════════════════════════════════════════════
              TAB: Importar (formato padrão)
          ══════════════════════════════════════════════════ */}
          <TabsContent value="import" className="space-y-4 p-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Importante:</strong> Use o campo "id" para atualizar registros existentes.
                Deixe vazio para criar novos.
                {contractId && " As atestações serão vinculadas automaticamente ao contrato atual."}
              </AlertDescription>
            </Alert>

            <div className="text-center py-6 border-2 border-dashed rounded-lg">
              <Upload className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Importar Arquivo</h3>
              <div className="flex justify-center gap-4">
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileImport}
                  className="hidden"
                  id="attestation-upload"
                  disabled={isImporting}
                />
                <Button
                  onClick={() => document.getElementById('attestation-upload').click()}
                  disabled={isImporting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isImporting
                    ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Importando...</>
                    : <><Upload className="w-4 h-4 mr-2" />Selecionar Excel</>
                  }
                </Button>
                <Button variant="outline" onClick={downloadTemplate}>
                  <Download className="w-4 h-4 mr-2" />Modelo
                </Button>
              </div>
            </div>

            {importStatus && (
              <Alert
                variant={importStatus.type === "error" ? "destructive" : "default"}
                className={importStatus.type === "success" ? "bg-green-50 border-green-200" : ""}
              >
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
