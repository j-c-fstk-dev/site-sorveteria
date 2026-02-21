
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
    const controlParams = ['_sort', '_limit'];

    // Handle filters
    for (const key in params) {
      if (controlParams.includes(key)) continue;

      const value = params[key];

      if (typeof value === 'string' && value.includes('.')) {
        let [operator, ...rest] = value.split('.');
        let filterValue = rest.join('.');

        // Convert common string literals to their actual types
        if (filterValue === 'true') filterValue = true;
        else if (filterValue === 'false') filterValue = false;
        else if (filterValue === 'null') filterValue = null;

        // Apply Supabase filter, e.g., .filter('id', 'eq', 1)
        query = query.filter(key, operator, filterValue);
      } else {
        // Handle simple equality for cases like { id: 5 }
        query = query.eq(key, value);
      }
    }

    // Handle sorting, e.g., _sort=ordem.desc
    if (params._sort) {
        const [field, direction] = params._sort.split('.');
        const ascending = direction !== 'desc';
        query = query.order(field, { ascending });
    }

    // Handle limit
    if (params._limit) {
        query = query.limit(Number(params._limit));
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
