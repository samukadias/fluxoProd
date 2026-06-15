/**
 * 🇧🇷 Tema Copa do Mundo Brasil 2026
 *
 * Este módulo controla a ativação automática do tema especial da Copa do Mundo.
 * O tema fica ativo no período: 10/06/2026 → 19/07/2026
 *
 * ⚠️  LEMBRETE: Após 19/07/2026 o layout volta automaticamente ao padrão.
 *     Não é necessária nenhuma intervenção manual — a data é verificada em runtime.
 *
 * Se precisar reativar ou ajustar o período, altere BRAZIL_THEME_END_DATE abaixo.
 */

// Data de início do tema Copa (10 de junho de 2026)
export const BRAZIL_THEME_START_DATE = new Date('2026-06-10T00:00:00-03:00');

// ⚠️ Data de fim: Final da Copa do Mundo 2026 — 19 de julho de 2026
export const BRAZIL_THEME_END_DATE = new Date('2026-07-19T23:59:59-03:00');

/**
 * Verifica se o tema da Copa do Mundo deve estar ativo no momento atual.
 * @returns {boolean} true se dentro do período da Copa, false caso contrário
 */
export function isBrazilThemeActive() {
    const now = new Date();
    return now >= BRAZIL_THEME_START_DATE && now <= BRAZIL_THEME_END_DATE;
}

/**
 * Retorna o número de dias restantes até o fim da Copa.
 * @returns {number} dias restantes (0 se já terminou)
 */
export function getDaysRemainingForCopa() {
    const now = new Date();
    if (now > BRAZIL_THEME_END_DATE) return 0;
    const diff = BRAZIL_THEME_END_DATE - now;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Formata a data de fim do tema para exibição.
 * @returns {string} ex: "19/07/2026"
 */
export function getCopaEndDateFormatted() {
    return BRAZIL_THEME_END_DATE.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'America/Sao_Paulo',
    });
}
