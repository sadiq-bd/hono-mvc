import { describe, expect, it, mock } from 'bun:test';
import { Hono } from 'hono';
import authRoutes from '../src/features/auth/routes';
import { contextStorage } from 'hono/context-storage';
import * as authService from '../src/features/auth/service';

// Mock the auth service to bypass the actual database
mock.module('../src/features/auth/service', () => {
  return {
    createToken: mock(() => Promise.resolve({ token: 'mock-token', refresh_token: 'mock-refresh' })),
    refreshToken: mock(() => Promise.resolve({ token: 'mock-token-2', refresh_token: 'mock-refresh-2' })),
    removeToken: mock(() => Promise.resolve(true))
  };
});

describe('Auth Feature Routes', () => {
  const app = new Hono<{ Bindings: CloudflareBindings }>();
  app.use(contextStorage()); // needed for utils.jsonSuccess
  app.route('/token', authRoutes);

  it('should create a token when valid body is provided', async () => {
    const res = await app.request('/token/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'X-App-Key': 'my-key',
        'X-App-Secret': 'my-secret'
      })
    });
    
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('status', 'success');
  });

  it('should fail creating token if missing X-App-Key', async () => {
    const res = await app.request('/token/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    
    expect(res.status).toBe(400);
  });

  it('should refresh a token', async () => {
    const res = await app.request('/token/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: 'valid-refresh-token' })
    });
    
    expect(res.status).toBe(200);
  });

  it('should remove a token', async () => {
    const res = await app.request('/token/remove', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: 'mock-token' })
    });
    
    expect(res.status).toBe(200);
  });
});
