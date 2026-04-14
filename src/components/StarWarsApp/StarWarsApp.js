/**
 * COMPONENT — StarWarsApp.js
 *
 * Design Pattern: Facade (Orquestrador)
 * Responsabilidade: Ocultar a complexidade de instanciação de
 * todas as classes MVC independentes. Atua como o único ponto
 * de entrada que inicializa todo o sistema em cascata.
 *
 * Princípio SOLID aplicado: Dependency Inversion
 * Views recebem o Repositório e o EventBus via injeção de
 * dependência, nunca os constroem internamente.
 */
import { Logger } from '../../core/Logger.js';
import { EventEmitter } from '../../core/EventEmitter.js';
import { DataRepository } from '../DataRepository/index.js';
import { ChartComponent } from '../ChartComponent/index.js';
import { TimelineComponent } from '../TimelineComponent/index.js';

// Instância global do Event Bus (Singleton neste módulo)
const EventBus = new EventEmitter();

export class StarWarsApp {
    constructor() {
        Logger.info('StarWarsApp', 'Iniciando sistema Jedi...');

        // 1. Instancia e carrega o Model em isolamento
        this.repository = new DataRepository();
        this.repository.loadData();

        // 2. Instancia as Views injetando dependências (DI)
        this.chartView = new ChartComponent('timelineChart', this.repository, EventBus);
        this.timelineView = new TimelineComponent('timelineContainer', this.repository, EventBus);
    }

    /**
     * Monta as Views no DOM e vincula todos os controles de UI ao EventBus.
     */
    init() {
        this.chartView.render();
        this.timelineView.render();
        this._bindControls();
        Logger.info('StarWarsApp', 'Aplicação POO montada e pronta para operação.');
    }

    /**
     * Vincula os controles de UI (botões de filtro, busca) ao EventBus.
     * A lógica de debounce para a busca evita emissões excessivas de eventos.
     */
    _bindControls() {
        // --- Controle: Campo de Busca com Debounce ---
        let debounceTimer;
        const searchEl = document.getElementById('searchInput');
        if (searchEl) {
            searchEl.addEventListener('input', (e) => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    Logger.info('StarWarsApp', `Debouncer: emitindo SEARCH → "${e.target.value}"`);
                    EventBus.emit('SEARCH_QUERY_CHANGED', e.target.value);
                }, 200);
            });
        }

        // --- Controle: Botões de Filtro por Tipo ---
        const typeBtns = document.querySelectorAll('.filter-btn');
        typeBtns.forEach(btn => btn.addEventListener('click', (e) => {
            const type = e.currentTarget.getAttribute('data-filter');
            typeBtns.forEach(b => {
                b.classList.remove('bg-white', 'text-slate-900', 'shadow-lg');
                b.classList.add('bg-slate-800/50', 'text-slate-300');
            });
            e.currentTarget.classList.remove('bg-slate-800/50', 'text-slate-300');
            e.currentTarget.classList.add('bg-white', 'text-slate-900', 'shadow-lg');
            Logger.info('StarWarsApp', `Botão de Categoria: TYPE → "${type}"`);
            EventBus.emit('FILTER_TYPE_CHANGED', type);
        }));

        // --- Controle: Botões de Zoom por Era ---
        const eraBtns = document.querySelectorAll('.era-btn');
        eraBtns.forEach(btn => btn.addEventListener('click', (e) => {
            const min = e.currentTarget.getAttribute('data-min');
            const max = e.currentTarget.getAttribute('data-max');
            eraBtns.forEach(b => {
                b.classList.remove('bg-sky-500/20', 'text-sky-200', 'border-sky-500/30', 'active');
                b.classList.add('bg-slate-800', 'text-slate-300', 'border-slate-700');
            });
            e.currentTarget.classList.remove('bg-slate-800', 'text-slate-300', 'border-slate-700');
            e.currentTarget.classList.add('bg-sky-500/20', 'text-sky-200', 'border-sky-500/30', 'active');
            Logger.info('StarWarsApp', `Botão de Era: ZOOM → [Min: ${min} | Max: ${max}]`);
            EventBus.emit('FILTER_ZOOM_CHANGED', { min, max });
        }));
    }
}
