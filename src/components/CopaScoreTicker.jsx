import React, { useState, useEffect, useRef } from 'react';
import { isBrazilThemeActive } from '../utils/brazilTheme';

// ESPN public API — sem necessidade de chave
const ESPN_API_URL =
    'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard';

const REFRESH_INTERVAL_MS = 60_000; // Atualiza a cada 60 segundos

function parseMatches(data) {
    try {
        const events = data?.events ?? [];
        return events.map((event) => {
            const competition = event.competitions?.[0];
            const home = competition?.competitors?.find((c) => c.homeAway === 'home');
            const away = competition?.competitors?.find((c) => c.homeAway === 'away');
            const status = competition?.status;
            const statusType = status?.type?.name ?? '';
            const displayClock = status?.displayClock ?? '';
            const period = status?.period ?? 0;

            const homeTeam = home?.team?.abbreviation ?? home?.team?.displayName ?? '?';
            const awayTeam = away?.team?.abbreviation ?? away?.team?.displayName ?? '?';
            const homeFlag = home?.team?.flag ?? home?.team?.logo ?? null;
            const awayFlag = away?.team?.flag ?? away?.team?.logo ?? null;
            const homeScore = home?.score ?? '-';
            const awayScore = away?.score ?? '-';

            let statusLabel = '';
            let isLive = false;

            if (statusType === 'STATUS_IN_PROGRESS') {
                isLive = true;
                statusLabel = period === 2 ? `2T ${displayClock}` : `1T ${displayClock}`;
            } else if (statusType === 'STATUS_HALFTIME') {
                isLive = true;
                statusLabel = 'Intervalo';
            } else if (statusType === 'STATUS_FINAL') {
                statusLabel = 'Encerrado';
            } else if (statusType === 'STATUS_SCHEDULED') {
                const date = new Date(event.date);
                statusLabel = date.toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'America/Sao_Paulo',
                });
            } else {
                statusLabel = status?.type?.shortDetail ?? '';
            }

            return {
                id: event.id,
                homeTeam,
                awayTeam,
                homeFlag,
                awayFlag,
                homeScore,
                awayScore,
                statusLabel,
                isLive,
                isScheduled: statusType === 'STATUS_SCHEDULED',
                isFinished: statusType === 'STATUS_FINAL',
            };
        });
    } catch {
        return [];
    }
}

function MatchChip({ match }) {
    return (
        <span className="copa-ticker-chip">
            {match.isLive && (
                <span className="copa-ticker-live">
                    <span className="copa-ticker-live-dot" />
                    AO VIVO
                </span>
            )}
            {/* Flag home */}
            {match.homeFlag ? (
                <img src={match.homeFlag} alt={match.homeTeam} className="copa-ticker-flag" />
            ) : (
                <span className="copa-ticker-abbr">{match.homeTeam}</span>
            )}
            {!match.isScheduled ? (
                <span className={`copa-ticker-score ${match.isLive ? 'copa-ticker-score-live' : ''}`}>
                    {match.homeScore} <span className="copa-ticker-score-sep">×</span> {match.awayScore}
                </span>
            ) : (
                <span className="copa-ticker-vs">vs</span>
            )}
            {/* Flag away */}
            {match.awayFlag ? (
                <img src={match.awayFlag} alt={match.awayTeam} className="copa-ticker-flag" />
            ) : (
                <span className="copa-ticker-abbr">{match.awayTeam}</span>
            )}
            <span className="copa-ticker-status">{match.statusLabel}</span>
        </span>
    );
}

export default function CopaScoreTicker() {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const tickerRef = useRef(null);

    const fetchScores = async () => {
        try {
            const res = await fetch(ESPN_API_URL, { cache: 'no-store' });
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const json = await res.json();
            const parsed = parseMatches(json);
            setMatches(parsed);
            setError(false);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchScores();
        const interval = setInterval(fetchScores, REFRESH_INTERVAL_MS);
        return () => clearInterval(interval);
    }, []);

    // Só renderiza durante o período da Copa
    if (!isBrazilThemeActive()) return null;
    if (loading) return null;
    if (error || matches.length === 0) {
        // Fallback silencioso — não mostra nada se não houver dados
        return null;
    }

    // Duplica a lista para criar o efeito de loop contínuo
    const items = [...matches, ...matches];

    return (
        <div className="copa-ticker-bar" aria-label="Placar Copa do Mundo 2026">
            <div className="copa-ticker-label">
                <span>⚽</span>
                <span>Copa 2026</span>
            </div>
            <div className="copa-ticker-track-wrapper" ref={tickerRef}>
                <div className="copa-ticker-track">
                    {items.map((match, idx) => (
                        <MatchChip key={`${match.id}-${idx}`} match={match} />
                    ))}
                </div>
            </div>
        </div>
    );
}
