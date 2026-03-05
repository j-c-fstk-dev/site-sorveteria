
import { createClient } from '@supabase/supabase-js';

class SupabaseService {
  constructor() {
    this.client = null;
    this.supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
    this.supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
  }

  init() {
    if (!this.supabaseUrl || !this.supabaseKey) {
      console.error('Supabase credentials not found. Check your environment variables.');
      return false;
    }
    if (this.client) {
      return true;
    }
    this.client = createClient(this.supabaseUrl, this.supabaseKey);
    return true;
  }

  async get(table, params = {}) {
    if (!this.client && !this.init()) {
      console.error("Supabase client not initialized.");
      throw new Error("Supabase client not initialized");
    }

    let query;

    // --- INÍCIO DO TESTE DE DEPURACÃO ---
    // Ignora os parâmetros recebidos e força uma consulta que sabemos ser válida.
    if (table === 'empresas') {
      console.log('[DEBUG] Executando consulta hardcoded para a tabela: empresas');
      query = this.client.from('empresas').select('*').limit(1);
    } else if (table === 'categorias') {
      console.log('[DEBUG] Executando consulta hardcoded para a tabela: categorias');
      query = this.client.from('categorias').select('*').eq('ativo', true).order('ordem', { ascending: true });
    } else {
      // Mantém a lógica original para qualquer outra tabela
      query = this.client.from(table).select();
      const { _sort, _limit, ...filters } = params;
      for (const key in filters) {
        const value = filters[key];
        if (typeof value === 'string' && value.includes('.')) {
          const [operator, ...rest] = value.split('.');
          let filterValue = rest.join('.');
          if (filterValue === 'true') filterValue = true;
          else if (filterValue === 'false') filterValue = false;
          query = query.filter(key, operator, filterValue);
        } else {
          query = query.eq(key, value);
        }
      }
      if (_sort) {
        const [field, direction] = _sort.split('.');
        query = query.order(field, { ascending: direction !== 'desc' });
      }
      if (_limit) {
        query = query.limit(Number(_limit));
      }
    }
    // --- FIM DO TESTE DE DEPURACÃO ---

    const { data, error } = await query;

    if (error) {
      console.error(`Supabase 'get' error on table '${table}':`, error);
      throw error;
    }

    return data;
  }

  async create(table, data) {
    if (!this.client && !this.init()) {
      throw new Error('Supabase client not initialized');
    }
    
    const { data: result, error } = await this.client
      .from(table)
      .insert(data)
      .select();
    
    if (error) throw error;
    return result[0];
  }

  async update(table, id, data) {
    if (!this.client && !this.init()) {
      throw new Error('Supabase client not initialized');
    }
    
    const { data: result, error } = await this.client
      .from(table)
      .update(data)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return result[0];
  }

  async delete(table, id) {
    if (!this.client && !this.init()) {
      throw new Error('Supabase client not initialized');
    }
    
    const { error } = await this.client
      .from(table)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
}

export default new SupabaseService();
