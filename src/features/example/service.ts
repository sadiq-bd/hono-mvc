import { Context } from 'hono';

export const exampleService = {
  async getAll(c: Context) {
    return [{ id: '1', name: 'Example Example' }];
  },
  
  async getById(c: Context, id: string) {
    return { id, name: `Example ${id}` };
  },
  
  async create(c: Context, data: any) {
    return { id: Math.random().toString(36).slice(2), ...data };
  },
  
  async update(c: Context, id: string, data: any) {
    return { id, ...data };
  },
  
  async delete(c: Context, id: string) {
    return true;
  }
};
