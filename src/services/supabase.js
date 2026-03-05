
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

    let query = this.client.from(table).select('*');

    // Handle control parameters first
    if (params._sort) {
      const [field, direction] = params._sort.split('.');
      const ascending = direction !== 'desc';
      query = query.order(field, { ascending });
    }
    if (params._limit) {
      query = query.limit(Number(params._limit));
    }

    // Handle filters, explicitly skipping control parameters
    const controlParams = ['_sort', '_limit'];
    for (const key in params) {
      if (controlParams.includes(key)) {
        continue; // Skip control parameters in this loop
      }

      const value = params[key];

      if (typeof value === 'string' && value.includes('.')) {
        let [operator, ...rest] = value.split('.');
        let filterValue = rest.join('.');

        if (filterValue === 'true') filterValue = true;
        else if (filterValue === 'false') filterValue = false;
        else if (filterValue === 'null') filterValue = null;

        query = query.filter(key, operator, filterValue);
      } else {
        query = query.eq(key, value);
      }
    }

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
