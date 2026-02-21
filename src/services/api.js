
import supabaseService from './supabase'; // Importa diretamente o serviço supabase

// Classe que delega todas as chamadas para o supabaseService
class ApiService {
  constructor(client) {
    this.client = client;
  }

  // Garante que o cliente esteja inicializado antes de qualquer chamada
  async _ensureClient() {
    if (typeof this.client.init === 'function' && !this.client.client) {
        await this.client.init();
    }
  }

  // Métodos genéricos delegados
  async get(table, filters = {}) {
    await this._ensureClient();
    return this.client.get(table, filters);
  }

  async create(table, data) {
    await this._ensureClient();
    return this.client.create(table, data);
  }

  async update(table, id, data) {
    await this._ensureClient();
    return this.client.update(table, id, data);
  }

  async delete(table, id) {
    await this._ensureClient();
    return this.client.delete(table, id);
  }

  // Métodos específicos do negócio que agora usam a sintaxe correta do Supabase
  async getProdutosDestaque() {
    return this.get('produtos', { destaque: 'eq.true', ativo: 'eq.true' });
  }

  async getUnidadesAtivas() {
    // Supondo que unidades não tenham um campo 'ativo', mas se tiver, adicione o filtro
    return this.get('unidades');
  }

  async getPromocoesAtivas() {
    const hoje = new Date().toISOString();
    return this.get('promocoes', {
      ativa: 'eq.true',
      data_inicio: `lte.${hoje}`,
      data_fim: `gte.${hoje}`
    });
  }

  async getEmpresaInfo() {
    const empresas = await this.get('empresa', { '_limit': 1 });
    return empresas[0] || null;
  }

  async getCategoriasAtivas() {
    return this.get('categorias', { ativa: 'eq.true' });
  }

  async getProdutosPorCategoria(categoriaId) {
    return this.get('produtos', { categoria_id: `eq.${categoriaId}`, ativo: 'eq.true' });
  }

  async getGaleriaAtiva() {
    return this.get('galeria', { ativa: 'eq.true' });
  }
}

// Exporta uma instância única do ApiService, já configurada com o supabaseService
export default new ApiService(supabaseService);
