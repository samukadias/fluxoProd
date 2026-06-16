import React, { useState, useEffect, useRef } from 'react';
import { Bell, CheckCheck, Clock, AlertTriangle, FileText, X, AtSign, RefreshCw } from 'lucide-react';
import { fluxoApi } from '@/api/fluxoClient';
import { useAuth } from '@/context/AuthContext';

const NOTIFICATION_ICONS = {
    contract_expiring_30: <AlertTriangle className="w-4 h-4 text-red-500" />,
    contract_expiring_60: <AlertTriangle className="w-4 h-4 text-amber-500" />,
    contract_expiring_90: <Clock className="w-4 h-4 text-yellow-500" />,
    demand_overdue: <Clock className="w-4 h-4 text-red-500" />,
    demand_aging: <Clock className="w-4 h-4 text-orange-500" />,
    mention_annotation: <AtSign className="w-4 h-4 text-indigo-500" />,
    default: <FileText className="w-4 h-4 text-slate-400" />,
};

const NotificationCenter = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [generating, setGenerating] = useState(false);
    const panelRef = useRef(null);

    const isManager = user?.role && ['manager', 'admin', 'general_manager'].includes(user.role);

    // Fetch unread count periodically
    useEffect(() => {
        if (!user) return;

        const fetchCount = async () => {
            try {
                const result = await fluxoApi.notifications.unreadCount();
                setUnreadCount(result.count);
            } catch (err) {
                // Silently fail - notifications are not critical
            }
        };

        fetchCount();
        const interval = setInterval(fetchCount, 60000); // Every minute
        return () => clearInterval(interval);
    }, [user]);

    // Fetch full list when panel opens
    useEffect(() => {
        if (isOpen && user) {
            loadNotifications();
        }
    }, [isOpen, user]);

    const loadNotifications = () => {
        setLoading(true);
        setError(null);
        fluxoApi.notifications.list({ limit: 20 })
            .then(data => setNotifications(data))
            .catch((err) => {
                console.error('[NotificationCenter] Failed to load notifications:', err);
                setError('Não foi possível carregar as notificações.');
            })
            .finally(() => setLoading(false));
    };

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = async (id) => {
        try {
            await fluxoApi.notifications.markRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Failed to mark notification as read:', err);
        }
    };

    const markAllRead = async () => {
        try {
            await fluxoApi.notifications.markAllRead();
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error('Failed to mark all as read:', err);
        }
    };

    const handleGenerateNotifications = async () => {
        setGenerating(true);
        setError(null);
        try {
        await fluxoApi.notifications.generate();
            // Reload after generation
            loadNotifications();
            const countResult = await fluxoApi.notifications.unreadCount();
            setUnreadCount(countResult.count);
        } catch (err) {
            console.error('Failed to generate notifications:', err);
            setError('Erro ao gerar notificações. Tente novamente.');
        } finally {
            setGenerating(false);
        }
    };

    const formatTime = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Agora';
        if (diffMins < 60) return `${diffMins}min atrás`;
        if (diffHours < 24) return `${diffHours}h atrás`;
        if (diffDays < 7) return `${diffDays}d atrás`;
        return date.toLocaleDateString('pt-BR');
    };

    if (!user) return null;

    return (
        <div className="relative" ref={panelRef}>
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all duration-200"
                aria-label="Notificações"
            >
                <div className="relative">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </div>
                Notificações
            </button>

            {/* Notification Panel */}
            {isOpen && (
                <div
                    className="fixed left-64 bottom-16 w-96 max-h-[480px] bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-[100]"
                    style={{ animation: 'fadeInDown 0.2s ease-out' }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
                        <h3 className="text-sm font-semibold text-white">Notificações</h3>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllRead}
                                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                                >
                                    <CheckCheck className="w-3 h-3" />
                                    Marcar todas como lidas
                                </button>
                            )}
                            <button
                                onClick={loadNotifications}
                                className="text-slate-400 hover:text-white"
                                title="Atualizar lista"
                            >
                                <RefreshCw className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-slate-400 hover:text-white"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="overflow-y-auto max-h-[400px]">
                        {loading ? (
                            <div className="p-8 text-center text-slate-400 text-sm">
                                <RefreshCw className="w-6 h-6 mx-auto mb-2 opacity-50 animate-spin" />
                                Carregando...
                            </div>
                        ) : error ? (
                            <div className="p-8 text-center text-sm">
                                <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-amber-500 opacity-70" />
                                <p className="text-slate-300 mb-3">{error}</p>
                                <button
                                    onClick={loadNotifications}
                                    className="text-xs text-indigo-400 hover:text-indigo-300"
                                >
                                    Tentar novamente
                                </button>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-8 text-center text-sm">
                                <Bell className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" />
                                <p className="text-slate-400 mb-1">Nenhuma notificação</p>
                                <p className="text-slate-500 text-xs mb-4">
                                    As notificações são geradas automaticamente às 8h.
                                </p>
                                {isManager && (
                                    <button
                                        onClick={handleGenerateNotifications}
                                        disabled={generating}
                                        className="flex items-center gap-1.5 mx-auto text-xs text-indigo-400 hover:text-indigo-300 disabled:opacity-50 transition-colors"
                                    >
                                        <RefreshCw className={`w-3 h-3 ${generating ? 'animate-spin' : ''}`} />
                                        {generating ? 'Gerando...' : 'Gerar notificações agora'}
                                    </button>
                                )}
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <div
                                    key={notification.id}
                                    className={`flex items-start gap-3 px-4 py-3 border-b border-slate-700/50 cursor-pointer transition-colors ${
                                        notification.read ? 'bg-transparent' : 'bg-indigo-500/5'
                                    } hover:bg-slate-700/30`}
                                    onClick={() => !notification.read && markAsRead(notification.id)}
                                >
                                    <div className="mt-0.5">
                                        {NOTIFICATION_ICONS[notification.type] || NOTIFICATION_ICONS.default}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm ${notification.read ? 'text-slate-300' : 'text-white font-medium'}`}>
                                            {notification.title}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                                            {notification.message}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {formatTime(notification.created_at)}
                                        </p>
                                    </div>
                                    {!notification.read && (
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default NotificationCenter;
