// Database service para browser usando localStorage
class DatabaseService {
  constructor() {
    this.dbName = 'aloha_sorveteria_db';
    this.data = {};
  }

  async init() {
    try {
      // Carregar dados do localStorage
      const storedData = localStorage.getItem(this.dbName);
      if (storedData) {
        this.data = JSON.parse(storedData);
      } else {
        await this.createTables();
        await this.insertInitialData();
      }
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }

  async createTables() {
    this.data = {
      empresas: [],
      unidades: [],
      categorias: [],
      produtos: [],
      sabores: [],
      promocoes: [],
      galeria: [],
      configuracoes: []
    };
    this.saveToLocalStorage();
  }

  async insertInitialData() {
    // Verificar se já existe dados
    if (this.data.empresas.length === 0) {
      // Inserir empresa
      this.data.empresas.push({
        id: 1,
        nome_fantasia: 'Aloha Sorveteria',
        razao_social: 'Fernanda Santos Sorveteria Ltda',
        whatsapp: '(12) 99724-2694',
        instagram: '@alohasorveteria.pinda',
        email: 'contato@alohasorveteria.com.br'
      });

      // Inserir categorias
      const categorias = [
        { id: 1, nome: 'Sorvetes de Massa', descricao: 'Mais de 30 sabores artesanais', ordem: 1, ativa: 1 },
        { id: 2, nome: 'Picolés', descricao: 'Mais de 20 opções deliciosas', ordem: 2, ativa: 1 },
        { id: 3, nome: 'Especiais', descricao: 'Taças, fondue e sobremesas', ordem: 3, ativa: 1 },
        { id: 4, nome: 'Açaí', descricao: 'Açaí cremoso e acompanhamentos', ordem: 4, ativa: 1 }
      ];

      categorias.forEach(categoria => {
        this.data.categorias.push(categoria);
      });

      // Inserir unidades
      this.data.unidades.push({
        id: 1,
        empresa_id: 1,
        nome: 'Aloha Sorveteria (Mombaça)',
        endereco: 'Av. Maj. Domingos Marcondes de Andrade, 309',
        bairro: 'Mombaça',
        cidade: 'Pindamonhangaba',
        estado: 'SP',
        cep: '12420-000',
        telefone: '(12) 99724-2694',
        horario_funcionamento: 'Segunda a sexta: 11h às 21h\nSábado e domingo: 10h às 21h',
        descricao: 'Unidade principal com área kids, pula-pula e piscina de bolinhas',
        tipo: 'matriz'
      });

      this.data.unidades.push({
        id: 2,
        empresa_id: 1,
        nome: 'Aloha Express (Centro)',
        endereco: 'Rua Dr. Campos Sales, 130',
        bairro: 'Centro',
        cidade: 'Pindamonhangaba',
        estado: 'SP',
        cep: '12420-000',
        telefone: '(12) 99724-2694',
        horario_funcionamento: 'Segunda a sexta: 11h às 18h\nSábado e domingo: 09h às 15h',
        descricao: 'Atendimento rápido dentro de estacionamento',
        tipo: 'express'
      });

      this.saveToLocalStorage();
      console.log('Initial data inserted successfully');
    }
  }

  saveToLocalStorage() {
    localStorage.setItem(this.dbName, JSON.stringify(this.data));
  }

  getNextId(table) {
    const items = this.data[table] || [];
    if (items.length === 0) return 1;
    return Math.max(...items.map(item => item.id)) + 1;
  }

  // Métodos CRUD genéricos
  async get(table, filters = {}) {
    if (!this.data[table]) await this.init();
    
    let items = [...this.data[table]];
    
    if (Object.keys(filters).length > 0) {
      items = items.filter(item => {
        return Object.entries(filters).every(([key, value]) => {
          if (key.includes('__')) {
            const [field, operator] = key.split('__');
            if (operator === 'lte') {
              return item[field] <= value;
            } else if (operator === 'gte') {
              return item[field] >= value;
            }
          } else {
            return item[key] == value;
          }
          return false;
        });
      });
    }
    
    return items;
  }

  async create(table, data) {
    if (!this.data[table]) await this.init();
    
    const newItem = {
      id: this.getNextId(table),
      ...data
    };
    
    this.data[table].push(newItem);
    this.saveToLocalStorage();
    
    return newItem;
  }

  async update(table, id, data) {
    if (!this.data[table]) await this.init();
    
    const index = this.data[table].findIndex(item => item.id == id);
    if (index === -1) {
      throw new Error(`Item with id ${id} not found in ${table}`);
    }
    
    this.data[table][index] = { ...this.data[table][index], ...data };
    this.saveToLocalStorage();
    
    return this.data[table][index];
  }

  async delete(table, id) {
    if (!this.data[table]) await this.init();
    
    const index = this.data[table].findIndex(item => item.id == id);
    if (index === -1) {
      throw new Error(`Item with id ${id} not found in ${table}`);
    }
    
    this.data[table].splice(index, 1);
    this.saveToLocalStorage();
    
    return true;
  }

  close() {
    // Não necessário para localStorage
  }
}

export default new DatabaseService();
