import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Download, 
    ArrowUpDown, 
    SlidersHorizontal,
    FileText,
    Settings,
    Check
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { fluxoApi } from '@/api/fluxoClient';
// navigate is used below inside the component
import DemandFilters from '@/components/demands/DemandFilters';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency } from '@/utils';

// Status color badges mapping
const STATUS_BADGES = {
    'PENDENTE TRIAGEM': 'bg-blue-50 text-blue-700 border-blue-200',
    'TRIAGEM NÃO ELEGÍVEL': 'bg-red-50 text-red-700 border-red-200',
    'DESIGNADA': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'EM QUALIFICAÇÃO': 'bg-sky-50 text-sky-700 border-sky-200',
    'EM ANDAMENTO': 'bg-amber-50 text-amber-700 border-amber-200',
    'CORREÇÃO': 'bg-rose-50 text-rose-700 border-rose-200',
    'PENDÊNCIA DDS': 'bg-purple-50 text-purple-700 border-purple-200',
    'PENDÊNCIA DOP': 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
    'PENDÊNCIA DOP E DDS': 'bg-pink-50 text-pink-700 border-pink-200',
    'PENDÊNCIA COMERCIAL': 'bg-orange-50 text-orange-700 border-orange-200',
    'PENDÊNCIA SUPRIMENTOS': 'bg-amber-50 text-amber-700 border-amber-200',
    'PENDÊNCIA FORNECEDOR': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    'CONGELADA': 'bg-slate-100 text-slate-600 border-slate-300',
    'ENTREGUE': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'CANCELADA': 'bg-slate-50 text-slate-500 border-slate-200',
    'REABERTA': 'bg-amber-50 text-amber-800 border-amber-300',
    'ASSINADA': 'bg-teal-50 text-teal-700 border-teal-200',
};

// Priority weight formatting
const PRIORITY_LABELS = {
    0: { text: 'P0 - Estratégico', color: 'text-violet-700 bg-violet-50 border-violet-200' },
    1: { text: 'P1 - Muito Alta', color: 'text-red-700 bg-red-50 border-red-200' },
    2: { text: 'P2 - Alta', color: 'text-orange-700 bg-orange-50 border-orange-200' },
    3: { text: 'P3 - Média', color: 'text-amber-700 bg-amber-50 border-amber-200' },
    4: { text: 'P4 - Baixa', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
};

const STAGES = [
    { id: 'Triagem', label: 'Triagem' },
    { id: 'Qualificação', label: 'Qualificação' },
    { id: 'PO', label: 'PO' },
    { id: 'OO', label: 'OO' },
    { id: 'RT', label: 'RT' },
    { id: 'ESP', label: 'ESP', legacyId: 'KIT' }
];

// Helper functions for PDF and dynamic styling
const hexToRgb = (hex) => {
    if (!hex) return [100, 116, 139];
    const cleanHex = hex.replace('#', '');
    if (cleanHex.length === 3) {
        const r = parseInt(cleanHex[0] + cleanHex[0], 16);
        const g = parseInt(cleanHex[1] + cleanHex[1], 16);
        const b = parseInt(cleanHex[2] + cleanHex[2], 16);
        return [r, g, b];
    }
    if (cleanHex.length === 6) {
        const r = parseInt(cleanHex.substring(0, 2), 16);
        const g = parseInt(cleanHex.substring(2, 4), 16);
        const b = parseInt(cleanHex.substring(4, 6), 16);
        return [r, g, b];
    }
    return [100, 116, 139];
};

const hexToRgbPastel = (hex) => {
    const [r, g, b] = hexToRgb(hex);
    return [
        Math.round(r * 0.1 + 255 * 0.9),
        Math.round(g * 0.1 + 255 * 0.9),
        Math.round(b * 0.1 + 255 * 0.9)
    ];
};

const STATUS_KEYS = [
    'PENDENTE TRIAGEM',
    'TRIAGEM NÃO ELEGÍVEL',
    'DESIGNADA',
    'EM QUALIFICAÇÃO',
    'EM ANDAMENTO',
    'CORREÇÃO',
    'PENDÊNCIA DDS',
    'PENDÊNCIA DOP',
    'PENDÊNCIA DOP E DDS',
    'PENDÊNCIA COMERCIAL',
    'PENDÊNCIA SUPRIMENTOS',
    'PENDÊNCIA FORNECEDOR',
    'CONGELADA',
    'ENTREGUE',
    'CANCELADA',
    'REABERTA',
    'ASSINADA'
];

const DEFAULT_STATUS_COLORS = {
    'PENDENTE TRIAGEM': '#3b82f6',
    'TRIAGEM NÃO ELEGÍVEL': '#ef4444',
    'DESIGNADA': '#6366f1',
    'EM QUALIFICAÇÃO': '#0ea5e9',
    'EM ANDAMENTO': '#f59e0b',
    'CORREÇÃO': '#f43f5e',
    'PENDÊNCIA DDS': '#f97316',
    'PENDÊNCIA DOP': '#d946ef',
    'PENDÊNCIA DOP E DDS': '#ef4444',
    'PENDÊNCIA COMERCIAL': '#2563eb',
    'PENDÊNCIA SUPRIMENTOS': '#eab308',
    'PENDÊNCIA FORNECEDOR': '#78350f',
    'CONGELADA': '#64748b',
    'ENTREGUE': '#10b981',
    'CANCELADA': '#94a3b8',
    'REABERTA': '#d97706',
    'ASSINADA': '#14b8a6',
};

const COLUMN_DEFINITIONS = [
    { id: 'demand_number', label: 'Nº Demanda', category: 'Campos Principais' },
    { id: 'clientName', label: 'Cliente', category: 'Campos Principais' },
    { id: 'product', label: 'Produto', category: 'Campos Principais' },
    { id: 'cycleName', label: 'Ciclo', category: 'Campos Principais' },
    { id: 'artifact', label: 'Artefato', category: 'Campos Principais' },
    { id: 'stage', label: 'Etapa', category: 'Campos Principais' },
    { id: 'status', label: 'Status', category: 'Campos Principais' },
    { id: 'weight', label: 'Prioridade', category: 'Campos Principais' },
    { id: 'value', label: 'Valor Estimado', category: 'Campos Principais' },
    { id: 'age', label: 'Idade (Dias Corridos)', category: 'Campos Principais' },
    { id: 'qualification_date', label: 'Data Qualificação', category: 'Datas' },
    { id: 'expected_delivery_date', label: 'Previsão Entrega', category: 'Datas' },
    { id: 'analystName', label: 'Analista de Propostas', category: 'Atores' },
    { id: 'requesterName', label: 'Executivo de Vendas', category: 'Atores' },
    { id: 'supportName', label: 'Suporte Pré-Vendas', category: 'Atores' },
    { id: 'architectName', label: 'Suporte Arquiteto', category: 'Atores' },
    { id: 'observation', label: 'Última Anotação', category: 'Anotações e Histórico' },
    { id: 'reopenCount', label: 'Qtd Reaberturas', category: 'Anotações e Histórico' },
    { id: 'lastReopenDate', label: 'Última Reabertura', category: 'Anotações e Histórico' },
    { id: 'stage_Triagem', label: 'Dias em Triagem', category: 'Etapas (Dias)' },
    { id: 'stage_Qualificação', label: 'Dias em Qualificação', category: 'Etapas (Dias)' },
    { id: 'stage_PO', label: 'Dias em PO', category: 'Etapas (Dias)' },
    { id: 'stage_OO', label: 'Dias em OO', category: 'Etapas (Dias)' },
    { id: 'stage_RT', label: 'Dias em RT', category: 'Etapas (Dias)' },
    { id: 'stage_ESP', label: 'Dias em ESP', category: 'Etapas (Dias)' },
    { id: 'status_PENDENTE TRIAGEM', label: 'Dias em PENDENTE TRIAGEM', category: 'Status (Dias)' },
    { id: 'status_TRIAGEM NÃO ELEGÍVEL', label: 'Dias em TRIAGEM NÃO ELEGÍVEL', category: 'Status (Dias)' },
    { id: 'status_DESIGNADA', label: 'Dias em DESIGNADA', category: 'Status (Dias)' },
    { id: 'status_EM QUALIFICAÇÃO', label: 'Dias em EM QUALIFICAÇÃO', category: 'Status (Dias)' },
    { id: 'status_EM ANDAMENTO', label: 'Dias em EM ANDAMENTO', category: 'Status (Dias)' },
    { id: 'status_CORREÇÃO', label: 'Dias em CORREÇÃO', category: 'Status (Dias)' },
    { id: 'status_PENDÊNCIA DDS', label: 'Dias em PENDÊNCIA DDS', category: 'Status (Dias)' },
    { id: 'status_PENDÊNCIA DOP', label: 'Dias em PENDÊNCIA DOP', category: 'Status (Dias)' },
    { id: 'status_PENDÊNCIA DOP E DDS', label: 'Dias em PENDÊNCIA DOP E DDS', category: 'Status (Dias)' },
    { id: 'status_PENDÊNCIA COMERCIAL', label: 'Dias em PENDÊNCIA COMERCIAL', category: 'Status (Dias)' },
    { id: 'status_PENDÊNCIA SUPRIMENTOS', label: 'Dias em PENDÊNCIA SUPRIMENTOS', category: 'Status (Dias)' },
    { id: 'status_PENDÊNCIA FORNECEDOR', label: 'Dias em PENDÊNCIA FORNECEDOR', category: 'Status (Dias)' },
    { id: 'status_CONGELADA', label: 'Dias em CONGELADA', category: 'Status (Dias)' },
    { id: 'status_ENTREGUE', label: 'Dias em ENTREGUE', category: 'Status (Dias)' },
    { id: 'status_CANCELADA', label: 'Dias em CANCELADA', category: 'Status (Dias)' },
    { id: 'status_REABERTA', label: 'Dias em REABERTA', category: 'Status (Dias)' },
    { id: 'status_ASSINADA', label: 'Dias em ASSINADA', category: 'Status (Dias)' },
];

const DEFAULT_COLUMNS = {
    demand_number: true,
    clientName: true,
    product: true,
    cycleName: true,
    artifact: true,
    stage: true,
    status: true,
    weight: true,
    value: true,
    age: true,
    qualification_date: true,
    expected_delivery_date: true,
    analystName: true,
    requesterName: true,
    supportName: true,
    architectName: true,
    observation: true,
    reopenCount: true,
    lastReopenDate: true,
    stage_Triagem: true,
    stage_Qualificação: true,
    stage_PO: true,
    stage_OO: true,
    stage_RT: true,
    stage_ESP: true,
    'status_PENDENTE TRIAGEM': false,
    'status_TRIAGEM NÃO ELEGÍVEL': false,
    'status_DESIGNADA': false,
    'status_EM QUALIFICAÇÃO': false,
    'status_EM ANDAMENTO': false,
    'status_CORREÇÃO': false,
    'status_PENDÊNCIA DDS': false,
    'status_PENDÊNCIA DOP': false,
    'status_PENDÊNCIA DOP E DDS': false,
    'status_PENDÊNCIA COMERCIAL': false,
    'status_PENDÊNCIA SUPRIMENTOS': false,
    'status_PENDÊNCIA FORNECEDOR': false,
    'status_CONGELADA': false,
    'status_ENTREGUE': false,
    'status_CANCELADA': false,
    'status_REABERTA': false,
    'status_ASSINADA': false,
};

const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        const utcDate = new Date(d.getTime() + d.getTimezoneOffset() * 60000);
        return utcDate.toLocaleDateString('pt-BR');
    } catch (e) {
        return dateStr;
    }
};

export default function PresidencialTab({
    demands = [],
    users = [],
    clients = [],
    cycles = [],
    isLoading = false
}) {
    const navigate = useNavigate();
    // Exact same filters state as the demands page
    const [filters, setFilters] = useState({
        search: '',
        status: 'active',
        analyst_id: 'all',
        analyst_type: 'analyst_id',
        client_id: 'all',
        cycle_id: 'all',
        cycle_ids: [],
        weight: 'all',
        weights: [],
        product_type: 'all',
        demand_types: [],
        stage: 'all',
        sortBy: 'date_desc'
    });

    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const topScrollRef = useRef(null);
    const tableScrollRef = useRef(null);
    const tableElRef = useRef(null);
    const [tableWidth, setTableWidth] = useState(1500);

    const [visibleColumns, setVisibleColumns] = useState(() => {
        try {
            const saved = localStorage.getItem('cdpc_presidencial_visible_cols');
            return saved ? JSON.parse(saved) : DEFAULT_COLUMNS;
        } catch (e) {
            return DEFAULT_COLUMNS;
        }
    });

    const [columnOrder, setColumnOrder] = useState(() => {
        try {
            const saved = localStorage.getItem('cdpc_presidencial_col_order');
            return saved ? JSON.parse(saved) : COLUMN_DEFINITIONS.map(col => col.id);
        } catch (e) {
            return COLUMN_DEFINITIONS.map(col => col.id);
        }
    });

    const [columnWidths, setColumnWidths] = useState(() => {
        try {
            const saved = localStorage.getItem('cdpc_presidencial_col_widths');
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            return {};
        }
    });

    // Drag and Drop state & handlers
    const [draggedColumn, setDraggedColumn] = useState(null);

    const handleDragStart = (e, colId) => {
        setDraggedColumn(colId);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', colId);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, targetColId) => {
        e.preventDefault();
        if (!draggedColumn || draggedColumn === targetColId) return;

        const newOrder = [...columnOrder];
        const draggedIdx = newOrder.indexOf(draggedColumn);
        const targetIdx = newOrder.indexOf(targetColId);

        if (draggedIdx !== -1 && targetIdx !== -1) {
            newOrder.splice(draggedIdx, 1);
            newOrder.splice(targetIdx, 0, draggedColumn);
            setColumnOrder(newOrder);
        }
        setDraggedColumn(null);
    };

    // Column Resizing handlers
    const resizeRef = useRef({ colId: null, startX: 0, startWidth: 0 });

    const handleResizeStart = (e, colId) => {
        e.preventDefault();
        e.stopPropagation();
        
        const headerEl = e.target.parentElement;
        const currentWidth = headerEl.getBoundingClientRect().width;
        
        resizeRef.current = {
            colId,
            startX: e.clientX,
            startWidth: currentWidth
        };

        document.addEventListener('mousemove', handleResizeMove);
        document.addEventListener('mouseup', handleResizeEnd);
    };

    const handleResizeMove = (e) => {
        const { colId, startX, startWidth } = resizeRef.current;
        if (!colId) return;

        const diffX = e.clientX - startX;
        const newWidth = Math.max(50, startWidth + diffX);

        setColumnWidths(prev => ({
            ...prev,
            [colId]: newWidth
        }));
    };

    const handleResizeEnd = () => {
        resizeRef.current = { colId: null, startX: 0, startWidth: 0 };
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
    };

    useEffect(() => {
        try {
            localStorage.setItem('cdpc_presidencial_col_order', JSON.stringify(columnOrder));
        } catch (e) { /* ignore */ }
    }, [columnOrder]);

    useEffect(() => {
        try {
            localStorage.setItem('cdpc_presidencial_col_widths', JSON.stringify(columnWidths));
        } catch (e) { /* ignore */ }
    }, [columnWidths]);

    const [statusColors, setStatusColors] = useState(() => {
        try {
            const saved = localStorage.getItem('cdpc_presidencial_status_colors');
            return saved ? { ...DEFAULT_STATUS_COLORS, ...JSON.parse(saved) } : DEFAULT_STATUS_COLORS;
        } catch (e) {
            return DEFAULT_STATUS_COLORS;
        }
    });

    const [settingsTab, setSettingsTab] = useState('columns'); // 'columns' | 'colors'

    const [isColumnDropdownOpen, setIsColumnDropdownOpen] = useState(false);
    const columnDropdownRef = useRef(null);

    useEffect(() => {
        try {
            localStorage.setItem('cdpc_presidencial_visible_cols', JSON.stringify(visibleColumns));
        } catch (e) { /* ignore */ }
    }, [visibleColumns]);

    useEffect(() => {
        try {
            localStorage.setItem('cdpc_presidencial_status_colors', JSON.stringify(statusColors));
        } catch (e) { /* ignore */ }
    }, [statusColors]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (columnDropdownRef.current && !columnDropdownRef.current.contains(event.target)) {
                setIsColumnDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleColumn = (id) => {
        setVisibleColumns(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const activeHeaders = useMemo(() => {
        const active = COLUMN_DEFINITIONS.filter(col => visibleColumns[col.id]);
        return [...active].sort((a, b) => {
            const indexA = columnOrder.indexOf(a.id);
            const indexB = columnOrder.indexOf(b.id);
            const posA = indexA === -1 ? 999 : indexA;
            const posB = indexB === -1 ? 999 : indexB;
            return posA - posB;
        });
    }, [visibleColumns, columnOrder]);

    // Fetch demand services and active roles mapping
    const { data: demandServices = [] } = useQuery({
        queryKey: ['demand_services'],
        queryFn: () => fluxoApi.entities.DemandService.list()
    });

    const { data: activeRoleMap = {} } = useQuery({
        queryKey: ['activeRoleMap'],
        queryFn: () => fluxoApi.demands.getActiveRoles(),
        staleTime: 120000
    });

    const { data: allStageHistory = [], isLoading: loadingStageHistory } = useQuery({
        queryKey: ['all_stage_history'],
        queryFn: () => fluxoApi.entities.StageHistory.list(),
        staleTime: 60000
    });

    const { data: allStatusHistory = [], isLoading: loadingStatusHistory } = useQuery({
        queryKey: ['all_status_history'],
        queryFn: () => fluxoApi.entities.StatusHistory.list(),
        staleTime: 60000
    });

    const isLocalLoading = isLoading || loadingStageHistory || loadingStatusHistory;

    // Synchronize top and table horizontal scrollbars
    useEffect(() => {
        const topScroll = topScrollRef.current;
        const tableScroll = tableScrollRef.current;
        if (!topScroll || !tableScroll) return;

        let isSyncingTop = false;
        let isSyncingTable = false;

        const handleTopScroll = () => {
            if (isSyncingTable) return;
            isSyncingTop = true;
            tableScroll.scrollLeft = topScroll.scrollLeft;
            isSyncingTop = false;
        };

        const handleTableScroll = () => {
            if (isSyncingTop) return;
            isSyncingTable = true;
            topScroll.scrollLeft = tableScroll.scrollLeft;
            isSyncingTable = false;
        };

        topScroll.addEventListener('scroll', handleTopScroll, { passive: true });
        tableScroll.addEventListener('scroll', handleTableScroll, { passive: true });

        return () => {
            topScroll.removeEventListener('scroll', handleTopScroll);
            tableScroll.removeEventListener('scroll', handleTableScroll);
        };
    }, [isLocalLoading, demands]);

    // Reset column header click sorting when filter sorting changes to avoid conflicts
    useEffect(() => {
        setSortConfig({ key: null, direction: 'asc' });
    }, [filters.sortBy]);

    // Create lookup maps
    const usersMap = useMemo(() => new Map(users.map(u => [String(u.id), u.name])), [users]);
    const clientsMap = useMemo(() => new Map(clients.map(c => [String(c.id), c.name])), [clients]);
    const cyclesMap = useMemo(() => new Map(cycles.map(c => [String(c.id), c.name])), [cycles]);

    // Filter analysts and requesters for CDPC
    const { cdpcAnalysts, cdpcRequesters } = useMemo(() => {
        const cdpcAnalysts = users.filter(u =>
            ['analyst', 'manager', 'admin'].includes(u.role) &&
            (!u.department || u.department === 'CDPC')
        );
        const cdpcRequesters = users.filter(u =>
            ['requester', 'analyst', 'manager', 'admin'].includes(u.role) &&
            (!u.department || u.department === 'CDPC')
        );
        return { cdpcAnalysts, cdpcRequesters };
    }, [users]);

    // Handle header click sorting
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Map of demand_id -> Array of stage history entries
    const stageHistoryByDemand = useMemo(() => {
        const map = new Map();
        allStageHistory.forEach(h => {
            const demandIdStr = String(h.demand_id);
            if (!map.has(demandIdStr)) {
                map.set(demandIdStr, []);
            }
            map.get(demandIdStr).push(h);
        });
        return map;
    }, [allStageHistory]);

    // Map of demand_id -> Array of status history entries
    const statusHistoryByDemand = useMemo(() => {
        const map = new Map();
        allStatusHistory.forEach(h => {
            const demandIdStr = String(h.demand_id);
            if (!map.has(demandIdStr)) {
                map.set(demandIdStr, []);
            }
            map.get(demandIdStr).push(h);
        });
        return map;
    }, [allStatusHistory]);

    // Map demand rows to represent complete data fields
    const processedDemands = useMemo(() => {
        return demands.map(d => {
            const demandIdStr = String(d.id);
            const clientName = clientsMap.get(String(d.client_id)) || '-';
            const cycleName = cyclesMap.get(String(d.cycle_id)) || '-';
            const analystName = usersMap.get(String(d.analyst_id)) || '-';
            const requesterName = usersMap.get(String(d.requester_id)) || '-';
            const supportName = usersMap.get(String(d.support_analyst_id)) || '-';
            const architectName = usersMap.get(String(d.architect_support_analyst_id)) || '-';
            const priorityObj = PRIORITY_LABELS[d.weight ?? 4] || PRIORITY_LABELS[4];

            // Reopenings calculation
            const statusHist = statusHistoryByDemand.get(demandIdStr) || [];
            const reopenHistory = statusHist.filter(h => h.to_status === 'REABERTA');
            const reopenCount = reopenHistory.length;
            
            // Find last reopen date
            let lastReopenDateStr = '-';
            let lastReopenTime = 0;
            if (reopenCount > 0) {
                const sortedReopens = [...reopenHistory].sort((a, b) => 
                    new Date(b.changed_at).getTime() - new Date(a.changed_at).getTime()
                );
                lastReopenDateStr = formatDate(sortedReopens[0].changed_at);
                lastReopenTime = new Date(sortedReopens[0].changed_at).getTime();
            }

            // Status duration calculation for each status
            const statusDurations = {};
            STATUS_KEYS.forEach(statusName => {
                statusDurations[statusName] = 0;
            });
            statusHist.forEach(h => {
                const status = h.from_status;
                if (status && statusDurations[status] !== undefined) {
                    statusDurations[status] += h.time_in_previous_status_minutes || 0;
                }
            });
            const ACTIVE_STATUSES = [
                "PENDENTE TRIAGEM",
                "DESIGNADA",
                "EM QUALIFICAÇÃO",
                "EM ANDAMENTO",
                "CORREÇÃO",
                "PENDÊNCIA DDS",
                "PENDÊNCIA DOP",
                "PENDÊNCIA DOP E DDS",
                "PENDÊNCIA COMERCIAL",
                "PENDÊNCIA SUPRIMENTOS",
                "PENDÊNCIA FORNECEDOR",
                "REABERTA",
                "ASSINADA"
            ];
            if (ACTIVE_STATUSES.includes(d.status) && statusDurations[d.status] !== undefined) {
                let latestTransitionTime = null;
                if (statusHist.length > 0) {
                    const sortedHist = [...statusHist].sort((a, b) => new Date(b.changed_at).getTime() - new Date(a.changed_at).getTime());
                    latestTransitionTime = new Date(sortedHist[0].changed_at).getTime();
                } else if (d.created_date) {
                    latestTransitionTime = new Date(d.created_date).getTime();
                }
                if (latestTransitionTime) {
                    const diffMinutes = Math.max(0, Math.round((Date.now() - latestTransitionTime) / (1000 * 60)));
                    statusDurations[d.status] += diffMinutes;
                }
            }
            const statusDurationsDays = {};
            STATUS_KEYS.forEach(statusName => {
                statusDurationsDays[statusName] = statusDurations[statusName] > 0 ? (statusDurations[statusName] / 1440).toFixed(1) : '0.0';
            });

            // Stage duration calculation for each workflow stage
            const stageHist = stageHistoryByDemand.get(demandIdStr) || [];
            const stageDurations = {};
            STAGES.forEach(stageObj => {
                const entries = stageHist.filter(h => h.stage === stageObj.id || (stageObj.legacyId && h.stage === stageObj.legacyId));
                let totalMinutes = 0;
                entries.forEach(e => {
                    if (e.duration_minutes) {
                        totalMinutes += e.duration_minutes;
                    } else if (e.entered_at && !e.exited_at) {
                        const start = new Date(e.entered_at);
                        const now = new Date();
                        const diff = Math.round((now - start) / (1000 * 60));
                        totalMinutes += diff;
                    }
                });
                stageDurations[stageObj.id] = totalMinutes > 0 ? (totalMinutes / 1440).toFixed(1) : '0.0';
            });

            // Age calculation (calendar days) with freezing on final status
            let ageDays = 0;
            if (d.created_date) {
                const createdTime = new Date(d.created_date).getTime();
                let endTime = Date.now();
                
                if (!ACTIVE_STATUSES.includes(d.status)) {
                    // Find the last transition to the final status
                    const finalTransitions = statusHist.filter(h => h.to_status === d.status);
                    if (finalTransitions.length > 0) {
                        const sortedTransitions = [...finalTransitions].sort((a, b) => 
                            new Date(b.changed_at).getTime() - new Date(a.changed_at).getTime()
                        );
                        endTime = new Date(sortedTransitions[0].changed_at).getTime();
                    } else if (d.updated_at) {
                        endTime = new Date(d.updated_at).getTime();
                    }
                }
                
                const diffTime = Math.max(0, endTime - createdTime);
                ageDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            }

            const formattedValue = d.value !== undefined && d.value !== null ? formatCurrency(d.value) : '-';

            return {
                ...d,
                clientName,
                cycleName,
                analystName,
                requesterName,
                supportName,
                architectName,
                priorityLabel: priorityObj.text,
                priorityColor: priorityObj.color,
                formattedQualDate: formatDate(d.qualification_date),
                formattedExpectedDate: formatDate(d.expected_delivery_date),
                rawQualDate: d.qualification_date ? new Date(d.qualification_date).getTime() : 0,
                rawExpectedDate: d.expected_delivery_date ? new Date(d.expected_delivery_date).getTime() : 0,
                
                // Computed fields
                reopenCount,
                lastReopenDateStr,
                lastReopenTime,
                stageDurations,
                statusDurations: statusDurationsDays,
                
                // Value and Age fields
                ageDays,
                formattedValue
            };
        });
    }, [demands, clientsMap, cyclesMap, usersMap, stageHistoryByDemand, statusHistoryByDemand]);

    // Apply exact filtration logic client-side
    const filteredDemands = useMemo(() => {
        return processedDemands.filter(d => {
            // 1. Text Search
            const term = (filters.search || '').toLowerCase().trim();
            if (term) {
                const demandNum = String(d.demand_number || '').toLowerCase();
                const client = String(d.clientName || '').toLowerCase();
                const product = String(d.product || '').toLowerCase();
                const analyst = String(d.analystName || '').toLowerCase();
                const requester = String(d.requesterName || '').toLowerCase();
                const status = String(d.status || '').toLowerCase();
                const stage = String(d.stage || '').toLowerCase();

                const matchesSearch = 
                    demandNum.includes(term) ||
                    client.includes(term) ||
                    product.includes(term) ||
                    analyst.includes(term) ||
                    requester.includes(term) ||
                    status.includes(term) ||
                    stage.includes(term);
                
                if (!matchesSearch) return false;
            }

            // 2. Status
            if (filters.status === 'active') {
                const ACTIVE_STATUSES = [
                    "PENDENTE TRIAGEM",
                    "DESIGNADA",
                    "EM QUALIFICAÇÃO",
                    "EM ANDAMENTO",
                    "CORREÇÃO",
                    "PENDÊNCIA DDS",
                    "PENDÊNCIA DOP",
                    "PENDÊNCIA DOP E DDS",
                    "PENDÊNCIA COMERCIAL",
                    "PENDÊNCIA SUPRIMENTOS",
                    "PENDÊNCIA FORNECEDOR",
                    "REABERTA",
                    "ASSINADA"
                ];
                if (!ACTIVE_STATUSES.includes(d.status)) return false;
            } else if (filters.status !== 'all') {
                if (d.status !== filters.status) return false;
            }

            // 3. Perfil / Responsável
            if (filters.analyst_id !== 'all') {
                let match = false;
                const roleType = filters.analyst_type || 'analyst_id';
                if (roleType === 'analyst_id' && String(d.analyst_id) === String(filters.analyst_id)) match = true;
                if (roleType === 'support_analyst_id' && String(d.support_analyst_id) === String(filters.analyst_id)) match = true;
                if (roleType === 'architect_support_analyst_id' && String(d.architect_support_analyst_id) === String(filters.analyst_id)) match = true;
                if (roleType === 'executive_id' && String(d.requester_id) === String(filters.analyst_id)) match = true;
                if (!match) return false;
            }

            // 4. Cliente
            if (filters.client_id && filters.client_id !== 'all') {
                if (String(d.client_id) !== String(filters.client_id)) return false;
            }

            // 5. Ciclo
            if (filters.cycle_ids && filters.cycle_ids.length > 0) {
                if (!filters.cycle_ids.includes(String(d.cycle_id))) return false;
            } else if (filters.cycle_id && filters.cycle_id !== 'all') {
                if (String(d.cycle_id) !== String(filters.cycle_id)) return false;
            }

            // 6. Tipo de Demanda (Serviço)
            if (filters.demand_types && filters.demand_types.length > 0) {
                let dTypes = [];
                try {
                    dTypes = Array.isArray(d.demand_types) 
                        ? d.demand_types 
                        : JSON.parse(d.demand_types || '[]');
                } catch (e) { /* ignore */ }
                const hasMatch = dTypes.some(t => filters.demand_types.includes(String(t.id)));
                if (!hasMatch) return false;
            }

            // 7. Tipo Produto
            if (filters.product_type && filters.product_type !== 'all') {
                if (d.product_type !== filters.product_type) return false;
            }

            // 8. Etapa
            if (filters.stage && filters.stage !== 'all') {
                if (d.stage !== filters.stage) return false;
            }

            // 9. Prioridade (Weights)
            if (filters.weights && filters.weights.length > 0) {
                if (!filters.weights.includes(String(d.weight ?? 4))) return false;
            } else if (filters.weight && filters.weight !== 'all') {
                if (String(d.weight ?? 4) !== String(filters.weight)) return false;
            }

            return true;
        });
    }, [processedDemands, filters]);

    // Apply sorting logic
    const sortedDemands = useMemo(() => {
        const sortable = [...filteredDemands];
        if (sortConfig.key !== null) {
            sortable.sort((a, b) => {
                let aVal = a[sortConfig.key];
                let bVal = b[sortConfig.key];

                if (sortConfig.key === 'priority_label' || sortConfig.key === 'weight') {
                    aVal = a.weight ?? 4;
                    bVal = b.weight ?? 4;
                } else if (sortConfig.key === 'qualification_date') {
                    aVal = a.rawQualDate;
                    bVal = b.rawQualDate;
                } else if (sortConfig.key === 'expected_delivery_date') {
                    aVal = a.rawExpectedDate;
                    bVal = b.rawExpectedDate;
                } else if (sortConfig.key === 'reopenCount') {
                    aVal = a.reopenCount;
                    bVal = b.reopenCount;
                } else if (sortConfig.key === 'lastReopenDate') {
                    aVal = a.lastReopenTime;
                    bVal = b.lastReopenTime;
                } else if (sortConfig.key === 'value') {
                    aVal = a.value ?? 0;
                    bVal = b.value ?? 0;
                } else if (sortConfig.key === 'age') {
                    aVal = a.ageDays ?? 0;
                    bVal = b.ageDays ?? 0;
                } else if (sortConfig.key.startsWith('stage_')) {
                    const stageId = sortConfig.key.replace('stage_', '');
                    aVal = parseFloat(a.stageDurations[stageId] || 0);
                    bVal = parseFloat(b.stageDurations[stageId] || 0);
                } else if (sortConfig.key.startsWith('status_')) {
                    const statusId = sortConfig.key.replace('status_', '');
                    aVal = parseFloat(a.statusDurations[statusId] || 0);
                    bVal = parseFloat(b.statusDurations[statusId] || 0);
                } else {
                    aVal = String(aVal || '').toLowerCase();
                    bVal = String(bVal || '').toLowerCase();
                }

                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        } else {
            // Fallback to active filters.sortBy Selection
            const sortBy = filters.sortBy || 'date_desc';
            sortable.sort((a, b) => {
                let aVal, bVal;
                if (sortBy === 'date_asc' || sortBy === 'date_desc') {
                    aVal = a.created_date ? new Date(a.created_date).getTime() : 0;
                    bVal = b.created_date ? new Date(b.created_date).getTime() : 0;
                    return sortBy === 'date_desc' ? bVal - aVal : aVal - bVal;
                } else if (sortBy === 'alpha_asc' || sortBy === 'alpha_desc') {
                    aVal = String(a.product || '').toLowerCase();
                    bVal = String(b.product || '').toLowerCase();
                    if (aVal < bVal) return sortBy === 'alpha_asc' ? -1 : 1;
                    if (aVal > bVal) return sortBy === 'alpha_asc' ? 1 : -1;
                    return 0;
                } else if (sortBy === 'priority') {
                    aVal = a.weight ?? 4;
                    bVal = b.weight ?? 4;
                    return aVal - bVal;
                }
                return 0;
            });
        }
        return sortable;
    }, [filteredDemands, sortConfig, filters.sortBy]);

    // Update top scroll helper inner width dynamically based on table's scrollWidth
    useEffect(() => {
        const tableEl = tableElRef.current;
        if (!tableEl) return;

        const updateWidth = () => {
            if (tableEl) {
                setTableWidth(tableEl.offsetWidth || tableEl.scrollWidth || 1500);
            }
        };

        // Initial measurement
        updateWidth();

        // Observe container size changes (like screen resizing or data loading)
        const observer = new ResizeObserver(() => {
            updateWidth();
        });
        observer.observe(tableEl);

        return () => {
            observer.disconnect();
        };
    }, [isLocalLoading, sortedDemands, visibleColumns]);

    // Export to Excel function
    const exportToExcel = () => {
        if (sortedDemands.length === 0) {
            toast.error('Sem dados para exportar');
            return;
        }

        try {
            const rows = sortedDemands.map(d => {
                const row = {};
                activeHeaders.forEach(col => {
                    if (col.id === 'demand_number') {
                        row[col.label] = d.demand_number || d.id || '';
                    } else if (col.id === 'weight') {
                        row[col.label] = d.priorityLabel || '-';
                    } else if (col.id === 'qualification_date') {
                        row[col.label] = d.formattedQualDate || '-';
                    } else if (col.id === 'expected_delivery_date') {
                        row[col.label] = d.formattedExpectedDate || '-';
                    } else if (col.id === 'reopenCount') {
                        row[col.label] = d.reopenCount;
                    } else if (col.id === 'lastReopenDate') {
                        row[col.label] = d.lastReopenDateStr;
                    } else if (col.id === 'value') {
                        row[col.label] = d.formattedValue || '-';
                    } else if (col.id === 'age') {
                        row[col.label] = `${d.ageDays} dias`;
                    } else if (col.id.startsWith('stage_')) {
                        const stageId = col.id.replace('stage_', '');
                        row[col.label] = `${d.stageDurations[stageId]} dias`;
                    } else if (col.id.startsWith('status_')) {
                        const statusId = col.id.replace('status_', '');
                        row[col.label] = `${d.statusDurations[statusId]} dias`;
                    } else {
                        row[col.label] = d[col.id] || '-';
                    }
                });
                return row;
            });

            const ws = XLSX.utils.json_to_sheet(rows);

            // Auto-adjust column widths
            const colWidths = Object.keys(rows[0] || {}).map(key => ({
                wch: Math.max(
                    key.length,
                    ...rows.map(row => String(row[key] || '').length)
                ) + 3
            }));
            ws['!cols'] = colWidths;

            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Visão Presidencial');
            
            const dateStr = new Date().toISOString().slice(0, 10);
            XLSX.writeFile(wb, `CDPC_Visao_Presidencial_${dateStr}.xlsx`);
            toast.success('Visão exportada com sucesso!');
        } catch (e) {
            console.error('Erro ao exportar:', e);
            toast.error('Erro ao exportar dados para o Excel');
        }
    };

    // Export to PDF function
    const exportToPDF = () => {
        if (sortedDemands.length === 0) {
            toast.error('Sem dados para exportar');
            return;
        }

        try {
            const doc = new jsPDF({
                orientation: 'landscape',
                unit: 'pt',
                format: 'a3', // A3 landscape
            });

            // Add Title
            doc.setFontSize(16);
            doc.setTextColor(30, 41, 59); // slate-800
            doc.text('Visão Presidencial CDPC', 40, 40);
            
            // Add metadata
            doc.setFontSize(10);
            doc.setTextColor(100, 116, 139); // slate-500
            doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')} | Total de demandas: ${sortedDemands.length}`, 40, 55);

            // Table headers and body mapping based on active columns
            const headers = activeHeaders.map(col => col.label);
            const rows = sortedDemands.map(d => {
                return activeHeaders.map(col => {
                    if (col.id === 'demand_number') {
                        return d.demand_number || d.id || '';
                    } else if (col.id === 'weight') {
                        return d.priorityLabel || '-';
                    } else if (col.id === 'qualification_date') {
                        return d.formattedQualDate || '-';
                    } else if (col.id === 'expected_delivery_date') {
                        return d.formattedExpectedDate || '-';
                    } else if (col.id === 'reopenCount') {
                        return String(d.reopenCount);
                    } else if (col.id === 'lastReopenDate') {
                        return d.lastReopenDateStr;
                    } else if (col.id === 'value') {
                        return d.formattedValue || '-';
                    } else if (col.id === 'age') {
                        return `${d.ageDays}d`;
                    } else if (col.id.startsWith('stage_')) {
                        const stageId = col.id.replace('stage_', '');
                        return `${d.stageDurations[stageId]}d`;
                    } else if (col.id.startsWith('status_')) {
                        const statusId = col.id.replace('status_', '');
                        return `${d.statusDurations[statusId]}d`;
                    } else {
                        return d[col.id] || '-';
                    }
                });
            });

            const columnStyles = {};
            const activeWidthsPx = activeHeaders.map(col => columnWidths[col.id] || 120);
            const totalWidthPx = activeWidthsPx.reduce((sum, w) => sum + w, 0);

            activeHeaders.forEach((col, index) => {
                if (Object.keys(columnWidths).length > 0) {
                    // Convert pixel width to proportional PDF points (A3 printable width: 1110.55pt)
                    const cellWidth = (activeWidthsPx[index] / totalWidthPx) * 1110.55;
                    columnStyles[index] = { cellWidth };
                } else {
                    // Fallback to default absolute widths
                    if (col.id === 'product') {
                        columnStyles[index] = { cellWidth: 100 };
                    } else if (col.id === 'observation') {
                        columnStyles[index] = { cellWidth: 120 };
                    } else if (col.id.startsWith('stage_')) {
                        columnStyles[index] = { cellWidth: 45 };
                    } else if (col.id.startsWith('status_')) {
                        columnStyles[index] = { cellWidth: 45 };
                    } else if (col.id === 'reopenCount') {
                        columnStyles[index] = { cellWidth: 50 };
                    }
                }
            });

            const statusColIndex = activeHeaders.findIndex(col => col.id === 'status');

            autoTable(doc, {
                head: [headers],
                body: rows,
                startY: 70,
                theme: 'striped',
                styles: {
                    fontSize: 8,
                    cellPadding: 4,
                    overflow: 'linebreak',
                },
                headStyles: {
                    fillColor: [79, 70, 229], // Indigo-600
                    textColor: [255, 255, 255],
                    fontStyle: 'bold',
                },
                columnStyles: columnStyles,
                margin: { left: 40, right: 40 },
                didParseCell: function(data) {
                    if (data.column.index === statusColIndex && data.section === 'body') {
                        const statusVal = data.cell.raw;
                        if (statusVal && statusVal !== '-') {
                            const hexColor = statusColors[statusVal] || DEFAULT_STATUS_COLORS[statusVal];
                            if (hexColor) {
                                data.cell.styles.fillColor = hexToRgbPastel(hexColor);
                                data.cell.styles.textColor = hexToRgb(hexColor);
                            }
                        }
                    }
                }
            });

            const dateStr = new Date().toISOString().slice(0, 10);
            doc.save(`CDPC_Visao_Presidencial_${dateStr}.pdf`);
            toast.success('PDF gerado com sucesso!');
        } catch (e) {
            console.error('Erro ao exportar PDF:', e);
            toast.error('Erro ao exportar dados para PDF');
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-300 space-y-6">
            {/* Header and filters section */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col gap-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <SlidersHorizontal className="w-5 h-5 text-indigo-500" />
                            Visão Presidencial CDPC
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                            Relatório executivo completo com os mesmos filtros avançados e ordenações da página de demandas.
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {/* Colunas Visíveis Dropdown */}
                        <div className="relative" ref={columnDropdownRef}>
                            <button
                                onClick={() => setIsColumnDropdownOpen(!isColumnDropdownOpen)}
                                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0"
                                title="Personalizar colunas e cores"
                            >
                                <Settings className="w-4 h-4 text-slate-500 animate-hover-spin" />
                                Ajustes
                            </button>

                            {isColumnDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-200 max-h-[450px] flex flex-col">
                                    {/* Tabs */}
                                    <div className="flex border-b border-slate-100 mb-3 pb-1 shrink-0">
                                        <button
                                            onClick={() => setSettingsTab('columns')}
                                            className={`flex-1 pb-1.5 text-xs font-bold text-center border-b-2 transition-all ${
                                                settingsTab === 'columns'
                                                    ? 'border-indigo-600 text-indigo-600'
                                                    : 'border-transparent text-slate-400 hover:text-slate-600'
                                            }`}
                                        >
                                            Colunas
                                        </button>
                                        <button
                                            onClick={() => setSettingsTab('colors')}
                                            className={`flex-1 pb-1.5 text-xs font-bold text-center border-b-2 transition-all ${
                                                settingsTab === 'colors'
                                                    ? 'border-indigo-600 text-indigo-600'
                                                    : 'border-transparent text-slate-400 hover:text-slate-600'
                                            }`}
                                        >
                                            Cores
                                        </button>
                                    </div>

                                    {settingsTab === 'columns' ? (
                                        <div className="flex-1 overflow-y-auto pr-1 space-y-3">
                                            <div className="flex items-center justify-between pb-2 border-b border-slate-100/50">
                                                <span className="font-extrabold text-slate-400 text-[9px] uppercase tracking-wider">Colunas Visíveis</span>
                                                <button 
                                                    onClick={() => {
                                                        setVisibleColumns(DEFAULT_COLUMNS);
                                                        setColumnOrder(COLUMN_DEFINITIONS.map(col => col.id));
                                                        setColumnWidths({});
                                                    }}
                                                    className="text-[9px] text-indigo-600 hover:text-indigo-800 font-bold uppercase transition-colors"
                                                >
                                                    Restaurar Padrão
                                                </button>
                                            </div>
                                            
                                            <div className="space-y-3">
                                                {['Campos Principais', 'Datas', 'Atores', 'Anotações e Histórico', 'Etapas (Dias)', 'Status (Dias)'].map(category => {
                                                    const catCols = COLUMN_DEFINITIONS.filter(col => col.category === category);
                                                    return (
                                                        <div key={category} className="space-y-1">
                                                            <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">{category}</h4>
                                                            <div className="grid grid-cols-1 gap-1 pl-1">
                                                                {catCols.map(col => (
                                                                    <label 
                                                                        key={col.id} 
                                                                        className="flex items-center gap-2 py-1 px-2 hover:bg-slate-50 rounded-lg cursor-pointer text-slate-700 font-medium text-xs transition-colors select-none"
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={visibleColumns[col.id]}
                                                                            onChange={() => toggleColumn(col.id)}
                                                                            className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-colors"
                                                                        />
                                                                        {col.label}
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex-1 overflow-y-auto pr-1 space-y-3">
                                            <div className="flex items-center justify-between pb-2 border-b border-slate-100/50">
                                                <span className="font-extrabold text-slate-400 text-[9px] uppercase tracking-wider">Cores dos Status</span>
                                                <button 
                                                    onClick={() => setStatusColors(DEFAULT_STATUS_COLORS)}
                                                    className="text-[9px] text-indigo-600 hover:text-indigo-800 font-bold uppercase transition-colors"
                                                >
                                                    Restaurar Cores
                                                </button>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                {STATUS_KEYS.map(statusName => {
                                                    const color = statusColors[statusName] || DEFAULT_STATUS_COLORS[statusName];
                                                    return (
                                                        <div key={statusName} className="flex items-center justify-between gap-3 py-1 px-2 hover:bg-slate-50 rounded-lg">
                                                            <span className="text-xs text-slate-700 font-medium truncate max-w-[190px]" title={statusName}>
                                                                {statusName}
                                                            </span>
                                                            <div className="flex items-center gap-2">
                                                                <input
                                                                    type="color"
                                                                    value={color}
                                                                    onChange={(e) => {
                                                                        setStatusColors(prev => ({
                                                                            ...prev,
                                                                            [statusName]: e.target.value
                                                                        }));
                                                                    }}
                                                                    className="w-6 h-6 border-0 rounded cursor-pointer p-0 bg-transparent shrink-0"
                                                                />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={exportToExcel}
                            disabled={sortedDemands.length === 0}
                            className="flex items-center gap-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed border border-emerald-200 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 shadow-sm transition-all"
                            title="Exportar esta tabela para Excel"
                        >
                            <Download className="w-4 h-4" />
                            Exportar Excel
                        </button>
                        
                        <button
                            onClick={exportToPDF}
                            disabled={sortedDemands.length === 0}
                            className="flex items-center gap-2 bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed border border-red-200 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 shadow-sm transition-all"
                            title="Exportar esta tabela para PDF"
                        >
                            <FileText className="w-4 h-4" />
                            Exportar PDF
                        </button>
                    </div>
                </div>

                {/* Render the full-featured filters */}
                <DemandFilters
                    filters={filters}
                    setFilters={setFilters}
                    analysts={cdpcAnalysts}
                    requesters={cdpcRequesters}
                    clients={clients}
                    cycles={cycles}
                    demandServices={demandServices}
                    activeRoleMap={activeRoleMap}
                />
            </div>

            {/* Custom Styles to force scrollbars to be always visible */}
            <style dangerouslySetInnerHTML={{__html: `
                .force-visible-scrollbar {
                    overflow-x: scroll !important;
                    overflow-y: scroll !important;
                    scrollbar-color: #cbd5e1 #f8fafc; /* Firefox */
                    scrollbar-width: auto;
                }
                .force-visible-scrollbar-x {
                    overflow-x: scroll !important;
                    overflow-y: hidden !important;
                    scrollbar-color: #cbd5e1 #f8fafc; /* Firefox */
                    scrollbar-width: auto;
                }
                /* Chrome, Safari, Edge, Opera */
                .force-visible-scrollbar::-webkit-scrollbar,
                .force-visible-scrollbar-x::-webkit-scrollbar {
                    width: 10px !important;
                    height: 10px !important;
                    display: block !important;
                }
                .force-visible-scrollbar::-webkit-scrollbar-track,
                .force-visible-scrollbar-x::-webkit-scrollbar-track {
                    background: #f1f5f9 !important;
                    border-radius: 8px !important;
                    border: 1px solid #e2e8f0 !important;
                }
                .force-visible-scrollbar::-webkit-scrollbar-thumb,
                .force-visible-scrollbar-x::-webkit-scrollbar-thumb {
                    background: #94a3b8 !important;
                    border-radius: 8px !important;
                    border: 2px solid #f1f5f9 !important;
                }
                .force-visible-scrollbar::-webkit-scrollbar-thumb:hover,
                .force-visible-scrollbar-x::-webkit-scrollbar-thumb:hover {
                    background: #64748b !important;
                }
                .animate-hover-spin {
                    transition: transform 0.3s ease-in-out;
                }
                .animate-hover-spin:hover {
                    transform: rotate(45deg);
                }
            `}} />

            {/* Table Area with Top Scroll Synchronizer */}
            <div className="flex flex-col border-t border-slate-100">
                {/* Top Horizontal Scrollbar Helper */}
                <div 
                    ref={topScrollRef} 
                    className="overflow-x-scroll force-visible-scrollbar-x bg-slate-50/30 border-b border-slate-100/50"
                    style={{ width: '100%' }}
                >
                    <div style={{ width: `${tableWidth}px`, height: '1px' }}></div>
                </div>

                {/* Main Table Scroll Container */}
                <div 
                    ref={tableScrollRef} 
                    className="relative max-h-[600px] force-visible-scrollbar bg-white"
                >
                    <table className="w-full min-w-[1500px] text-xs text-left" style={{ tableLayout: Object.keys(columnWidths).length > 0 ? 'fixed' : 'auto' }}>
                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-600 uppercase font-black text-[9px] tracking-wider sticky top-0 z-10">
                        <tr>
                            {activeHeaders.map(col => {
                                const isSorted = sortConfig.key === col.id;
                                const headerWidth = columnWidths[col.id] ? `${columnWidths[col.id]}px` : undefined;
                                return (
                                    <th 
                                        key={col.id} 
                                        onClick={() => requestSort(col.id)}
                                        draggable={true}
                                        onDragStart={(e) => handleDragStart(e, col.id)}
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => handleDrop(e, col.id)}
                                        title={col.label}
                                        className="px-4 py-3.5 cursor-move hover:bg-slate-100 hover:text-slate-900 transition-colors select-none group relative active:bg-slate-200"
                                        style={{ 
                                            width: headerWidth, 
                                            minWidth: headerWidth, 
                                            maxWidth: headerWidth,
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <div className="flex items-center gap-1.5 pr-2 overflow-hidden">
                                            <span className="truncate">{col.label}</span>
                                            <ArrowUpDown className={`w-3 h-3 flex-shrink-0 transition-opacity ${
                                                isSorted ? 'opacity-100 text-indigo-500' : 'opacity-20 group-hover:opacity-60'
                                            }`} />
                                        </div>
                                        {/* Resize Handle */}
                                        <div 
                                            onMouseDown={(e) => handleResizeStart(e, col.id)}
                                            onClick={(e) => e.stopPropagation()}
                                            className="absolute top-0 right-0 h-full w-2 cursor-col-resize hover:bg-indigo-500/30 select-none z-20"
                                        />
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                        {isLocalLoading ? (
                            <tr>
                                <td colSpan={activeHeaders.length} className="py-12 text-center text-slate-400 font-bold uppercase tracking-wider animate-pulse">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-slate-300 border-t-indigo-500 rounded-full animate-spin" />
                                        Carregando Visão Presidencial...
                                    </div>
                                </td>
                            </tr>
                        ) : sortedDemands.length === 0 ? (
                            <tr>
                                <td colSpan={activeHeaders.length} className="py-12 text-center text-slate-400 font-bold uppercase tracking-wider">
                                    Nenhuma demanda encontrada
                                </td>
                            </tr>
                        ) : (
                            sortedDemands.map((d) => (
                                <tr
                                    key={d.id}
                                    className="hover:bg-indigo-50/60 transition-colors cursor-pointer group"
                                    onClick={() => navigate(`/demand-detail?id=${d.id}`, { state: { from: 'presidencial' } })}
                                    title={`Abrir demanda ${d.demand_number || d.id}`}
                                >
                                    {activeHeaders.map(col => {
                                        const cellWidth = columnWidths[col.id] ? `${columnWidths[col.id]}px` : undefined;
                                        const cellStyle = cellWidth ? { width: cellWidth, minWidth: cellWidth, maxWidth: cellWidth, overflow: 'hidden', textOverflow: 'ellipsis' } : {};
                                        
                                        switch (col.id) {
                                            case 'demand_number':
                                                return (
                                                    <td key={col.id} style={cellStyle} className="px-4 py-3 font-bold text-slate-900 whitespace-nowrap">
                                                        {d.demand_number || `#${d.id}`}
                                                    </td>
                                                );
                                            case 'clientName':
                                                return (
                                                    <td key={col.id} style={cellStyle} className="px-4 py-3 max-w-[150px] truncate" title={d.clientName}>
                                                        {d.clientName}
                                                    </td>
                                                );
                                            case 'product':
                                                return (
                                                    <td key={col.id} style={cellStyle} className="px-4 py-3 font-semibold text-slate-800 max-w-[200px] truncate" title={d.product}>
                                                        {d.product}
                                                    </td>
                                                );
                                            case 'cycleName':
                                                return (
                                                    <td key={col.id} style={cellStyle} className="px-4 py-3 max-w-[120px] truncate" title={d.cycleName}>
                                                        {d.cycleName}
                                                    </td>
                                                );
                                            case 'artifact':
                                                return (
                                                    <td key={col.id} style={cellStyle} className="px-4 py-3 whitespace-nowrap">
                                                        {d.artifact || '-'}
                                                    </td>
                                                );
                                            case 'stage':
                                                return (
                                                    <td key={col.id} style={cellStyle} className="px-4 py-3 whitespace-nowrap">
                                                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                                                            {d.stage || '-'}
                                                        </span>
                                                    </td>
                                                );
                                            case 'status':
                                                return (
                                                    <td key={col.id} style={cellStyle} className="px-4 py-3 whitespace-nowrap">
                                                        <span 
                                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors duration-150"
                                                            style={{
                                                                backgroundColor: `${statusColors[d.status] || '#64748b'}1a`,
                                                                borderColor: `${statusColors[d.status] || '#64748b'}33`,
                                                                color: statusColors[d.status] || '#64748b'
                                                            }}
                                                        >
                                                            {d.status || '-'}
                                                        </span>
                                                    </td>
                                                );
                                            case 'weight':
                                                return (
                                                    <td key={col.id} style={cellStyle} className="px-4 py-3 whitespace-nowrap">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${d.priorityColor}`}>
                                                            {d.priorityLabel}
                                                        </span>
                                                    </td>
                                                );
                                            case 'value':
                                                return (
                                                    <td key={col.id} style={cellStyle} className="px-4 py-3 font-semibold text-slate-900 whitespace-nowrap">
                                                        {d.formattedValue}
                                                    </td>
                                                );
                                            case 'age':
                                                return (
                                                    <td key={col.id} style={cellStyle} className="px-4 py-3 font-mono whitespace-nowrap">
                                                        {d.ageDays} dias
                                                    </td>
                                                );
                                            case 'qualification_date':
                                                return (
                                                    <td key={col.id} style={cellStyle} className="px-4 py-3 font-mono whitespace-nowrap">
                                                        {d.formattedQualDate}
                                                    </td>
                                                );
                                            case 'expected_delivery_date':
                                                return (
                                                    <td key={col.id} style={cellStyle} className="px-4 py-3 font-mono whitespace-nowrap">
                                                        {d.formattedExpectedDate}
                                                    </td>
                                                );
                                            case 'analystName':
                                                return (
                                                    <td key={col.id} style={cellStyle} className="px-4 py-3 max-w-[150px] truncate" title={d.analystName}>
                                                        {d.analystName}
                                                    </td>
                                                );
                                            case 'requesterName':
                                                return (
                                                    <td key={col.id} style={cellStyle} className="px-4 py-3 max-w-[150px] truncate" title={d.requesterName}>
                                                        {d.requesterName}
                                                    </td>
                                                );
                                            case 'supportName':
                                                return (
                                                    <td key={col.id} style={cellStyle} className="px-4 py-3 max-w-[150px] truncate" title={d.supportName}>
                                                        {d.supportName}
                                                    </td>
                                                );
                                            case 'architectName':
                                                return (
                                                    <td key={col.id} style={cellStyle} className="px-4 py-3 max-w-[150px] truncate" title={d.architectName}>
                                                        {d.architectName}
                                                    </td>
                                                );
                                            case 'observation':
                                                return (
                                                    <td key={col.id} style={cellStyle} className="px-4 py-3 max-w-[250px] truncate text-slate-500 font-normal italic" title={d.observation || ''}>
                                                        {d.observation || '-'}
                                                    </td>
                                                );
                                            case 'reopenCount':
                                                return (
                                                    <td key={col.id} style={cellStyle} className="px-4 py-3 text-center whitespace-nowrap">
                                                        <span className={d.reopenCount > 0 ? "font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md" : "text-slate-400 font-normal"}>
                                                            {d.reopenCount}
                                                        </span>
                                                    </td>
                                                );
                                            case 'lastReopenDate':
                                                return (
                                                    <td key={col.id} style={cellStyle} className="px-4 py-3 font-mono whitespace-nowrap">
                                                        {d.lastReopenDateStr}
                                                    </td>
                                                );
                                            default:
                                                if (col.id.startsWith('stage_')) {
                                                    const stageId = col.id.replace('stage_', '');
                                                    const days = d.stageDurations[stageId];
                                                    return (
                                                        <td key={col.id} style={cellStyle} className="px-4 py-3 font-mono text-center whitespace-nowrap">
                                                            <span className={parseFloat(days) > 0 ? "font-semibold text-slate-700 bg-slate-100 border border-slate-200/60 px-1.5 py-0.5 rounded-md" : "text-slate-400 font-normal"}>
                                                                {days}d
                                                            </span>
                                                        </td>
                                                    );
                                                }
                                                if (col.id.startsWith('status_')) {
                                                    const statusId = col.id.replace('status_', '');
                                                    const days = d.statusDurations[statusId];
                                                    return (
                                                        <td key={col.id} style={cellStyle} className="px-4 py-3 font-mono text-center whitespace-nowrap">
                                                            <span className={parseFloat(days) > 0 ? "font-semibold text-slate-700 bg-slate-100 border border-slate-200/60 px-1.5 py-0.5 rounded-md" : "text-slate-400 font-normal"}>
                                                                {days}d
                                                            </span>
                                                        </td>
                                                    );
                                                }
                                                return null;
                                        }
                                    })}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
            {/* Footer Summary Bar */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                <span>Total de Registros: {sortedDemands.length}</span>
                {filters.search && <span>(Filtrado de {demands.length} demandas)</span>}
            </div>
        </div>
    );
}
