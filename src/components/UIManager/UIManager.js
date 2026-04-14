/**
 * COMPONENT — UIManager.js
 *
 * Design Pattern: Factory Method (parcial) + Strategy
 * Responsabilidade: Centralizar o mapeamento entre tipos de mídia
 * e seus tokens visuais correspondentes (cores Tailwind).
 * Isso garante consistência visual em todos os componentes que
 * precisam estilizar itens com base no tipo.
 *
 * Para adicionar um novo tipo de mídia, basta estender o objeto `styles`.
 */

/** @typedef {{ color: string, bg: string, text: string, border: string }} MediaStyle */

export class UIManager {
    /**
     * Retorna o conjunto de tokens de estilo para um dado tipo de mídia.
     * @param {string} type - Tipo da mídia (ex: "Filme", "Série Live-action", "Animação").
     * @returns {MediaStyle}
     */
    static getStyle(type) {
        /** @type {Object.<string, MediaStyle>} */
        const styles = {
            'Filme': {
                color: '#eab308',
                bg: 'bg-yellow-500/10',
                text: 'text-yellow-400',
                border: 'border-yellow-500/30'
            },
            'Live-action': {
                color: '#0ea5e9',
                bg: 'bg-sky-500/10',
                text: 'text-sky-400',
                border: 'border-sky-500/30'
            },
            'Animação': {
                color: '#a855f7',
                bg: 'bg-purple-500/10',
                text: 'text-purple-400',
                border: 'border-purple-500/30'
            },
        };

        if (type.includes('Filme')) return styles['Filme'];
        if (type.includes('Live-action')) return styles['Live-action'];
        return styles['Animação']; // Fallback para séries de animação
    }
}
