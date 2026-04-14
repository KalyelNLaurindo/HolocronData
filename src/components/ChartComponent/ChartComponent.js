/**
 * COMPONENT — ChartComponent.js
 *
 * Responsabilidade: Gerenciar a instância do Chart.js.
 * Renderiza o scatter plot e controla atualizações visuais
 * reagindo EXCLUSIVAMENTE a eventos do EventBus (Observer).
 * Não possui conhecimento direto dos controles de UI.
 *
 * Eventos escutados:
 *   - 'FILTER_TYPE_CHANGED' → filtra datasets visíveis por tipo
 *   - 'FILTER_ZOOM_CHANGED' → ajusta o range do eixo X
 */
import { Logger } from '../../core/Logger.js';
import { UIManager } from '../UIManager/UIManager.js';

export class ChartComponent {
    /**
     * @param {string} containerId - ID do elemento <canvas> no DOM.
     * @param {import('../DataRepository/DataRepository').DataRepository} repo - Repositório de dados.
     * @param {import('../../core/EventEmitter').EventEmitter} eventBus - Barramento de eventos global.
     */
    constructor(containerId, repo, eventBus) {
        this.canvas = document.getElementById(containerId);
        this.repo = repo;
        this.eventBus = eventBus;
        /** @type {Chart|null} */
        this.chartInstance = null;
    }

    /**
     * Monta e renderiza o gráfico Chart.js no canvas.
     * Inscreve os listeners no EventBus após a renderização.
     */
    render() {
        if (!this.canvas) {
            Logger.error('ChartComponent', 'Canvas do gráfico não encontrado na tela.');
            return;
        }

        try {
            const ctx = this.canvas.getContext('2d');
            const datasets = [
                { label: 'Filmes', data: [], backgroundColor: UIManager.getStyle('Filme').color, borderColor: '#fff', borderWidth: 1, pointRadius: 8, pointHoverRadius: 12 },
                { label: 'Séries Live-action', data: [], backgroundColor: UIManager.getStyle('Live-action').color, borderColor: '#fff', borderWidth: 1, pointRadius: 8, pointHoverRadius: 12 },
                { label: 'Animações', data: [], backgroundColor: UIManager.getStyle('Animação').color, borderColor: '#fff', borderWidth: 1, pointRadius: 8, pointHoverRadius: 12 }
            ];

            this.repo.getAll().forEach(item => {
                let dIndex = item.type.includes('Filme') ? 0 : (item.type.includes('Live-action') ? 1 : 2);
                let yPos = dIndex + 1 + (Math.random() * 0.4 - 0.2);
                datasets[dIndex].data.push({ x: item.year, y: yPos, title: item.title, time: item.time });
            });

            this.chartInstance = new Chart(ctx, {
                type: 'scatter',
                data: { datasets },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    color: '#cbd5e1',
                    plugins: {
                        legend: {
                            labels: {
                                color: '#cbd5e1',
                                font: { family: "'Outfit', sans-serif", size: 14 },
                                usePointStyle: true,
                                padding: 20
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                            titleFont: { family: "'Outfit', sans-serif", size: 15, weight: 'bold' },
                            bodyFont: { family: "'Outfit', sans-serif", size: 13 },
                            padding: 14,
                            cornerRadius: 16,
                            borderColor: 'rgba(255,255,255,0.1)',
                            borderWidth: 1,
                            displayColors: false,
                            callbacks: {
                                label: (ctx) => [ctx.raw.title, `Período: ${ctx.raw.time}`]
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: { color: 'rgba(255,255,255,0.05)' },
                            ticks: {
                                color: '#94a3b8',
                                font: { family: "'Outfit', sans-serif", weight: '500' },
                                callback: val => val === 0
                                    ? 'Batalha de Yavin (0)'
                                    : (val < 0 ? Math.abs(val) + ' BBY' : val + ' ABY')
                            },
                            title: {
                                display: true,
                                text: 'Cronologia (Anos)',
                                color: '#64748b',
                                font: { family: "'Outfit', sans-serif" }
                            },
                            min: -250,
                            max: 40
                        },
                        y: { min: 0, max: 4, grid: { display: false }, ticks: { display: false } }
                    },
                    animation: { duration: 800, easing: 'easeOutQuart' }
                }
            });

            Logger.info('ChartComponent', 'Gráfico instanciado via API.');

            // Inscreve reações a eventos do barramento
            this.eventBus.on('FILTER_TYPE_CHANGED', (type) => this._filterByType(type));
            this.eventBus.on('FILTER_ZOOM_CHANGED', (ranges) => this._updateZoom(ranges.min, ranges.max));

        } catch (e) {
            Logger.error('ChartComponent', 'Erro ao renderizar dados iterativos no ChartJS.', e);
        }
    }

    /**
     * Filtra a visibilidade dos datasets por tipo de mídia.
     * @param {string} typeFilter - "All" | "Filme" | "Live-action" | "Animação"
     */
    _filterByType(typeFilter) {
        if (!this.chartInstance) return;
        Logger.info('ChartComponent', `Ajustando visibilidade por tipo: ${typeFilter}`);
        const ds = this.chartInstance.data.datasets;
        ds[0].hidden = typeFilter !== 'All' && typeFilter !== 'Filme';
        ds[1].hidden = typeFilter !== 'All' && typeFilter !== 'Live-action';
        ds[2].hidden = typeFilter !== 'All' && typeFilter !== 'Animação';
        this.chartInstance.update();
    }

    /**
     * Atualiza o zoom (range do eixo X) do gráfico.
     * @param {string|number} minX
     * @param {string|number} maxX
     */
    _updateZoom(minX, maxX) {
        if (!this.chartInstance) return;
        Logger.info('ChartComponent', `Escalando Range (X) temporal: [Min: ${minX} | Max: ${maxX}]`);
        this.chartInstance.options.scales.x.min = parseInt(minX);
        this.chartInstance.options.scales.x.max = parseInt(maxX);
        this.chartInstance.update();
    }
}
