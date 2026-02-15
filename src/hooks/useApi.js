import { useState, useEffect } from 'react';
import api from '../services/api';

export function useApi(table, filters = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.get(table, filters);
      setData(result);
    } catch (err) {
      console.error(`Error fetching ${table}:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [table, JSON.stringify(filters)]);

  const refetch = () => fetchData();

  return { data, loading, error, refetch };
}

export function useCrud(table) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const create = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.create(table, data);
      return result;
    } catch (err) {
      console.error(`Error creating ${table}:`, err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id, data) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.update(table, id, data);
      return result;
    } catch (err) {
      console.error(`Error updating ${table}:`, err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await api.delete(table, id);
      return true;
    } catch (err) {
      console.error(`Error deleting ${table}:`, err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { create, update, delete: remove, loading, error };
}

export function useApiMethod(method, ...args) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (...executeArgs) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api[method](...executeArgs);
      setData(result);
      return result;
    } catch (err) {
      console.error(`Error executing ${method}:`, err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (args.length > 0) {
      execute(...args);
    }
  }, []);

  return { data, loading, error, execute };
}
