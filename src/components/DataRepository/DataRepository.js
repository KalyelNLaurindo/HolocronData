/**
 * COMPONENT — DataRepository/DataRepository.js
 *
 * Design Pattern: Repository
 * Responsabilidade: Isolar a fonte de dados (starWarsData).
 * Gerencia a alocação em memória e atua como a única fonte de
 * verdade para toda a aplicação. Nenhum componente de View deve
 * acessar os dados brutos diretamente.
 *
 * Se no futuro os dados vierem de uma API, apenas este arquivo muda.
 */
import { Logger } from '../../core/Logger.js';
import { starWarsData } from '../../data/starWarsData.js';

export class DataRepository {
    constructor() {
        /** @type {import('../../data/starWarsData').StarWarsEntry[]} */
        this._data = [];
    }

    /**
     * Carrega e valida os dados da fonte configurada.
     * Em caso de falha de validação, loga o erro e retorna um array vazio (fallback resiliente).
     */
    loadData() {
        try {
            Logger.info('DataRepository', 'Decodificando arquivos locais do Holocron...');
            this._validate(starWarsData);
            this._data = starWarsData;
            Logger.info('DataRepository', `Leitura rigorosa concluída: ${this._data.length} registros blindados.`);
        } catch (error) {
            Logger.error('DataRepository', 'Falha crítica de corrupção nos registros Jedi.', error);
            this._data = []; // Fallback resiliente
        }
    }

    /**
     * Valida a integridade estrutural dos dados brutos.
     * @param {any[]} dataArr
     * @throws {Error} Se o array for inválido ou os itens não seguirem o contrato.
     */
    _validate(dataArr) {
        if (!Array.isArray(dataArr)) {
            throw new Error('A fonte de dados matriz não obedece ao contrato de Array.');
        }
        if (dataArr.length === 0) {
            Logger.warn('DataRepository', 'Aviso: O repositório retornou 0 arquivos válidos (base em branco).');
        }
        if (dataArr.length > 0 && typeof dataArr[0].title !== 'string') {
            throw new Error('Integridade estrutural ausente: Falta do campo restrito "title".');
        }
    }

    /**
     * Retorna todos os registros carregados.
     * @returns {import('../../data/starWarsData').StarWarsEntry[]}
     */
    getAll() {
        return this._data;
    }
}
