/**
 * CORE — EventEmitter.js
 *
 * Design Pattern: Observer (Publish/Subscribe)
 * Responsabilidade: Desacoplar Módulos (Views vs Data) usando um
 * sistema de comunicação baseado em eventos. Nenhum componente
 * precisa conhecer diretamente a existência dos outros.
 *
 * Uso:
 *   EventBus.on('MEU_EVENTO', (payload) => { ... });
 *   EventBus.emit('MEU_EVENTO', { dado: 'valor' });
 */
import { Logger } from './Logger.js';

export class EventEmitter {
    constructor() {
        /** @type {Object.<string, Function[]>} */
        this.events = {};
        Logger.info('EventBus', 'Sistema de eventos inicializado na memória local.');
    }

    /**
     * Inscreve um listener para um evento específico.
     * @param {string} eventName - Nome do evento a escutar.
     * @param {Function} listener - Callback executado quando o evento é emitido.
     */
    on(eventName, listener) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(listener);
    }

    /**
     * Emite/Publica um evento, notificando todos os assinantes ativos.
     * @param {string} eventName - Nome do evento a publicar.
     * @param {*} payload - Dados carregados pelo evento (opcional).
     */
    emit(eventName, payload = null) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(listener => {
                try {
                    listener(payload);
                } catch (e) {
                    Logger.error('EventBus', `Falha ao executar listener do evento: ${eventName}`, e);
                }
            });
        } else {
            Logger.warn('EventBus', `Nenhum ouvinte alocado para o evento despachado: ${eventName}`);
        }
    }
}
