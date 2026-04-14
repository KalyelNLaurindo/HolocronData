/**
 * CORE — Logger.js
 *
 * Responsabilidade: Centralizar a consistência, o estilo e o
 * tratamento dos outputs de log. Substitui chamadas brutas ao
 * console espalhadas pelo código.
 *
 * Uso: Logger.info('NomeDoModulo', 'Mensagem descritiva');
 */
export class Logger {
    /**
     * Loga uma mensagem informativa em azul.
     * @param {string} namespace - Nome do módulo/classe que emite o log.
     * @param {string} message - Mensagem a ser exibida.
     */
    static info(namespace, message) {
        console.log(`%c[INFO] [${namespace}]`, 'color: #38bdf8; font-weight: bold;', message);
    }

    /**
     * Loga um aviso em amarelo.
     * @param {string} namespace
     * @param {string} message
     */
    static warn(namespace, message) {
        console.warn(`%c[WARN] [${namespace}]`, 'color: #eab308; font-weight: bold;', message);
    }

    /**
     * Loga um erro crítico em vermelho, com stack trace opcional.
     * @param {string} namespace
     * @param {string} message
     * @param {Error|null} error - Objeto de erro nativo (opcional).
     */
    static error(namespace, message, error = null) {
        console.error(
            `%c[ERROR] [${namespace}]`,
            'color: #f43f5e; font-weight: bold;',
            message,
            error ? '\n' + error.stack : ''
        );
    }
}
