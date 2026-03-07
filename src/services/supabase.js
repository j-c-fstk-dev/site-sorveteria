
import { createClient } from '@supabase/supabase-js';

// Esta é uma solução alternativa radical. Vamos usar o fetch diretamente
// para contornar um problema desconhecido que está corrompendo a URL final.
const manualFetch = async (url, supabaseKey) => {
  const response = await fetch(url, {
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`
    }
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

class SupabaseService {
  constructor() {
    this.client = null; // O cliente ainda será usado para métodos que não são o GET
    this.supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
    this.supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
  }

  init() {
    if (!this.supabaseUrl || !this.supabaseKey) {
      console.error('Supabase credentials not found.');
      return false;
    }
    if (this.client) {
      return true;
    }
    // A inicialização do cliente continua sendo útil para outros métodos
    this.client = createClient(this.supabaseUrl, this.supabaseKey);
    return true;
  }

  async get(table, params = {}) {
    if (!this.init()) {
      throw new Error("Supabase client not initialized");
    }

    // Transforma os parâmetros em uma query string manualmente
    const queryParams = new URLSearchParams();
    queryParams.append('select', '*'); // Seleciona todas as colunas

    for (const key in params) {
      if (key === '_limit') {
        // Pula _limit, será tratado após o loop
        continue;
      } else if (key === '_sort') {
        // Converte _sort para order do Supabase
        queryParams.append('order', `${params[key]}.asc`);
      } else {
        // Adiciona outros parâmetros normalmente
        queryParams.append(key, params[key]);
      }
    }

    // Adiciona limit se foi passado
    if (params._limit) {
      queryParams.append('limit', params._limit);
    }

    const queryString = queryParams.toString();

    const url = `${this.supabaseUrl}/rest/v1/${table}?${queryString}`;

    console.log(`[DEBUG] URL GET para '${table}': ${url}`);

    try {
      const data = await manualFetch(url, this.supabaseKey);
      return data;
    } catch (error) {
      console.error(`Erro ao buscar '${table}':`, error);
      throw error;
    }
  }

  // Os outros métodos (create, update, delete) permanecem inalterados, 
  // pois não parecem estar afetados pelo problema.
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
