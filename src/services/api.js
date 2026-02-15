class ApiService {
  constructor() {
    this.client = null;
    this.clientType = 'sqlite';
  }

  // Configuração dinâmica do cliente
  configureClient(type = 'sqlite') {
    this.clientType = type;
    if (type === 'supabase') {
      this.client = require('./supabase').default;
    } else {
      this.client = require('./database').default;
    }
  }

  // Inicializar o serviço
  async init() {
    if (!this.client) {
      this.configureClient(this.clientType);
    }
    if (typeof this.client.init === 'function') {
      await this.client.init();
    }
  }

  // Métodos genéricos
  async get(table, filters = {}) {
    await this.init();
    return this.client.get(table, filters);
  }

  async create(table, data) {
    await this.init();
    return this.client.create(table, data);
  }

  async update(table, id, data) {
    await this.init();
    return this.client.update(table, id, data);
  }

  async delete(table, id) {
    await this.init();
    return this.client.delete(table, id);
  }

  // Métodos específicos do negócio
  async getProdutosDestaque() {
    return this.get('produtos', { destaque: 1, ativo: 1 });
  }

  async getUnidadesAtivas() {
    return this.get('unidades');
  }

  async getPromocoesAtivas() {
    const hoje = new Date().toISOString().split('T')[0];
    return this.get('promocoes', {
      ativa: 1,
      data_inicio__lte: hoje,
      data_fim__gte: hoje
    });
  }

  async getEmpresaInfo() {
    const empresas = await this.get('empresas');
    return empresas[0] || null;
  }

  async getCategoriasAtivas() {
    return this.get('categorias', { ativa: 1 });
  }

  async getProdutosPorCategoria(categoriaId) {
    return this.get('produtos', { categoria_id: categoriaId, ativo: 1 });
  }

  async getGaleriaAtiva() {
    return this.get('galeria', { ativa: 1 });
  }
}

export default new ApiService();
