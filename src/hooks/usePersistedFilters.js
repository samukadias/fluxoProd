import { useState, useEffect } from 'react';

/**
 * Hook que mantém os filtros persistidos no sessionStorage.
 * Os filtros sobrevivem à navegação entre páginas, mas são limpos
 * quando o usuário fecha ou recarrega o browser.
 *
 * @param {string} storageKey - Chave única no sessionStorage (ex: "cocr_filters")
 * @param {object} defaultFilters - Valores padrão dos filtros
 * @returns {[object, function]} - [filters, setFilters] igual ao useState
 */
export function usePersistedFilters(storageKey, defaultFilters) {
    const [filters, setFilters] = useState(() => {
        try {
            const saved = sessionStorage.getItem(storageKey);
            if (saved) {
                // Mescla com defaults para garantir que novos campos
                // tenham valor padrão caso não existam no dado salvo
                return { ...defaultFilters, ...JSON.parse(saved) };
            }
        } catch {
            // Se der erro ao parsear, usa o default
        }
        return defaultFilters;
    });

    // Salva no sessionStorage sempre que os filtros mudarem
    useEffect(() => {
        try {
            sessionStorage.setItem(storageKey, JSON.stringify(filters));
        } catch {
            // sessionStorage pode estar indisponível (modo privado restrito, etc.)
        }
    }, [filters, storageKey]);

    return [filters, setFilters];
}
