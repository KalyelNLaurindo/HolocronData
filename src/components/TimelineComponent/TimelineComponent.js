/**
 * COMPONENT — TimelineComponent.js
 *
 * Responsabilidade: Construir e gerenciar os elementos DOM da
 * lista expansível de mídias. Em vez de re-renderizar o DOM a
 * cada mudança de filtro, a classe:
 *   1. Constrói os nós DOM UMA ÚNICA VEZ na chamada de render().
 *   2. Armazena as referências no cache `this.domNodes`.
 *   3. Usa Event Delegation (um único listener na raiz) para expansão.
 *   4. Aplica/remove 'hidden' nos nós cacheados para filtros (O(1) acesso).
 *
 * Eventos escutados:
 *   - 'SEARCH_QUERY_CHANGED' → atualiza filtro de busca e re-aplica
 *   - 'FILTER_TYPE_CHANGED'  → atualiza filtro de tipo e re-aplica
 */
import { Logger } from '../../core/Logger.js';
import { UIManager } from '../UIManager/UIManager.js';

export class TimelineComponent {
    /**
     * @param {string} containerId - ID do elemento container no DOM.
     * @param {import('../DataRepository/DataRepository').DataRepository} repo
     * @param {import('../../core/EventEmitter').EventEmitter} eventBus
     */
    constructor(containerId, repo, eventBus) {
        this.container = document.getElementById(containerId);
        this.repo = repo;
        this.eventBus = eventBus;
        /** @type {HTMLElement[]} */
        this.domNodes = [];
        this.searchQuery = '';
        this.typeFilter = 'All';

        if (!this.container) {
            Logger.error('TimelineComponent', 'Elemento de montagem de lista não existe (DOM).');
        } else {
            this._setupDelegation();
        }
    }

    /**
     * Constrói todos os nós DOM da lista e inscreve nos eventos do EventBus.
     * Chamado UMA única vez pelo orquestrador (StarWarsApp).
     */
    render() {
        if (!this.container) return;
        this.container.innerHTML = '';
        this.domNodes = [];

        // Mensagem de estado vazio
        const emptyMessage = document.createElement('div');
        emptyMessage.id = 'timelineEmptyMessage';
        emptyMessage.className = 'glass-panel rounded-3xl p-8 text-center text-slate-400 font-medium hidden';
        emptyMessage.textContent = 'Os arquivos Jedi estão incompletos. Nenhum registro encontrado.';
        this.container.appendChild(emptyMessage);

        this.repo.getAll().forEach((item, index) => {
            const style = UIManager.getStyle(item.type);
            const itemEl = document.createElement('div');
            itemEl.className = 'relative group timeline-item';
            itemEl.style.animation = `slideUp 0.4s ease-out ${index * 0.04}s both`;
            itemEl.innerHTML = this._buildCardTemplate(item, style);
            this.container.appendChild(itemEl);
            this.domNodes.push(itemEl);
        });

        Logger.info('TimelineComponent', 'Nós do DOM da lista instanciados estaticamente.');

        // Inscreve reações a eventos do EventBus
        this.eventBus.on('SEARCH_QUERY_CHANGED', (query) => {
            this.searchQuery = query;
            this._applyFilters();
        });
        this.eventBus.on('FILTER_TYPE_CHANGED', (type) => {
            this.typeFilter = type;
            this._applyFilters();
        });
    }

    /**
     * Gera o HTML interno de um card de item da timeline.
     * Separado em método próprio para facilitar testes e customização futura.
     * @param {import('../../data/starWarsData').StarWarsEntry} item
     * @param {import('../UIManager/UIManager').MediaStyle} style
     * @returns {string} HTML string do card
     */
    _buildCardTemplate(item, style) {
        return `
            <div class="absolute -left-[26px] md:-left-[45px] top-6 w-3 h-3 md:w-4 md:h-4 rounded-full bg-[${style.color}] border-2 border-[#0f172a] shadow-[0_0_10px_${style.color}] z-20 transform -translate-x-1/2 md:translate-x-0"></div>
            <div class="glass-panel-interactive rounded-3xl overflow-hidden cursor-pointer js-expandable-card">
                <div class="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div class="flex items-center gap-3 mb-2">
                            <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${style.bg} ${style.text} border ${style.border}">
                                ${item.type}
                            </span>
                            <span class="text-slate-400 text-sm font-medium">▶ ${item.time}</span>
                        </div>
                        <h3 class="text-2xl font-bold text-white tracking-tight">${item.title}</h3>
                    </div>
                    <div class="flex items-center justify-center w-10 h-10 rounded-full bg-slate-800/50 border border-slate-700 text-slate-300 transition-transform duration-300 icon-chevron shrink-0">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </div>
                </div>
                <div class="expandable-content border-t border-slate-700/50">
                    <div class="expandable-inner">
                        <div class="p-6 bg-slate-900/40">
                            <p class="text-slate-300 text-lg mb-6 leading-relaxed font-light">"${item.context}"</p>
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div class="bg-slate-800/40 rounded-2xl p-4 border border-slate-700/50">
                                    <p class="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">Duração</p>
                                    <p class="text-white font-medium">${item.duration}</p>
                                </div>
                                <div class="bg-slate-800/40 rounded-2xl p-4 border border-slate-700/50">
                                    <p class="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">Lançamento</p>
                                    <p class="text-white font-medium">${item.releaseDate}</p>
                                </div>
                                <div class="bg-slate-800/40 rounded-2xl p-4 border border-slate-700/50">
                                    <p class="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">Período Exato</p>
                                    <p class="text-white font-medium">${item.time}</p>
                                </div>
                                <div class="bg-slate-800/40 rounded-2xl p-4 border border-slate-700/50">
                                    <p class="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">Nota IMDb</p>
                                    <p class="text-yellow-400 font-bold flex items-center gap-1">★ ${item.imdb}</p>
                                </div>
                            </div>
                            <div class="bg-sky-900/20 rounded-2xl p-5 border border-sky-500/20">
                                <div class="flex gap-3 items-start">
                                    <span class="text-sky-400 text-xl mt-1">ⓘ</span>
                                    <div>
                                        <p class="text-sky-300 text-xs uppercase font-bold tracking-wider mb-1">Holocron Trivia</p>
                                        <p class="text-sky-100/80 text-sm leading-relaxed">${item.trivia}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Reavalia todos os filtros ativos (busca + tipo) contra os nós DOM
     * cacheados. Toggle 'hidden' sem reconstruir o DOM.
     */
    _applyFilters() {
        Logger.info('TimelineComponent', `Filtros → Busca: "${this.searchQuery}" | Tipo: "${this.typeFilter}"`);
        let visibleCount = 0;
        const emptyMessage = document.getElementById('timelineEmptyMessage');
        const data = this.repo.getAll();

        data.forEach((item, index) => {
            const searchMatch = item.title.toLowerCase().includes(this.searchQuery.toLowerCase());
            const typeMatch = this.typeFilter === 'All' || item.type.includes(this.typeFilter);
            const element = this.domNodes[index];

            if (searchMatch && typeMatch) {
                element.classList.remove('hidden');
                visibleCount++;
            } else {
                element.classList.add('hidden');
            }
        });

        if (visibleCount === 0) emptyMessage.classList.remove('hidden');
        else emptyMessage.classList.add('hidden');
    }

    /**
     * Configura 'Event Delegation' para a expansão dos cards.
     * Um único listener na raiz captura eventos com bubbling,
     * evitando alocação O(N) de listeners e memory leaks.
     */
    _setupDelegation() {
        this.container.addEventListener('click', (e) => {
            const cardEl = e.target.closest('.js-expandable-card');
            if (!cardEl) return;

            Logger.info('TimelineComponent', 'Expansão de Card Interativo acionada.');
            const content = cardEl.querySelector('.expandable-content');
            const icon = cardEl.querySelector('.icon-chevron');

            if (content.classList.contains('expanded')) {
                content.classList.remove('expanded');
                icon.classList.remove('rotate-180');
                cardEl.classList.remove('ring-1', 'ring-slate-500');
            } else {
                // Colapsa qualquer outro card expandido antes
                document.querySelectorAll('.expandable-content.expanded').forEach(el => {
                    el.classList.remove('expanded');
                    const siblingIcon = el.parentElement.querySelector('.icon-chevron');
                    if (siblingIcon) siblingIcon.classList.remove('rotate-180');
                    el.parentElement.classList.remove('ring-1', 'ring-slate-500');
                });
                content.classList.add('expanded');
                icon.classList.add('rotate-180');
                cardEl.classList.add('ring-1', 'ring-slate-500');
            }
        });
    }
}
