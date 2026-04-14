/**
 * ENTRY POINT — main.js
 *
 * Responsabilidade: Ponto de entrada seguro da aplicação.
 * Aguarda o DOM estar completamente carregado (DOMContentLoaded)
 * antes de instanciar e inicializar o orquestrador principal.
 *
 * Nenhuma lógica de negócio deve residir aqui. Este arquivo
 * é somente o "gatilho" que acende o motor da aplicação.
 */
import { StarWarsApp } from './components/StarWarsApp/index.js';

document.addEventListener('DOMContentLoaded', () => {
    const App = new StarWarsApp();
    App.init();
});
