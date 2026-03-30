import { describe, expect, it } from 'bun:test';
import { AppError, globalErrorHandler, notFoundHandler } from '../src/core/errors';
import utils from '../src/core/utils';
import { Hono } from 'hono';

import { contextStorage } from 'hono/context-storage';

describe('Core Utilities', () => {
  it('should base64 encode and decode correctly', () => {
    const raw = 'hello world';
    const encoded = utils.base64encode(raw);
    const decoded = utils.base64decode(encoded);
    
    expect(encoded).not.toBe(raw);
    expect(decoded).toBe(raw);
  });

  it('should correctly format jsonSuccess', async () => {
    const app = new Hono();
    app.use(contextStorage());
    app.get('/', (c) => utils.jsonSuccess('test message', { foo: 'bar' }, 201));
    const res = await app.request('/');
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json).toEqual({ status: 'success', message: 'test message', foo: 'bar' });
  });

  it('should correctly format jsonError', async () => {
    const app = new Hono();
    app.use(contextStorage());
    app.get('/', (c) => utils.jsonError('error message', {}, 400));
    const res = await app.request('/');
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json).toEqual({ status: 'error', message: 'error message' });
  });
});

describe('Core Errors', () => {
  it('should create an AppError with a custom status code', () => {
    const err = new AppError('Custom Error', 403);
    expect(err.message).toBe('Custom Error');
    expect(err.statusCode).toBe(403);
    expect(err.name).toBe('AppError');
  });

  it('should handle AppError inside globalErrorHandler', async () => {
    const app = new Hono();
    app.onError(globalErrorHandler);
    app.get('/', () => { throw new AppError('Caught Error', 402); });
    
    const res = await app.request('/');
    expect(res.status).toBe(402);
    const json = await res.json();
    expect(json).toEqual({ status: 'error', message: 'Caught Error' });
  });

  it('should handle standard Error as 500 in globalErrorHandler', async () => {
    const app = new Hono();
    app.onError(globalErrorHandler);
    
    // We mock console.error to avoid polluting test logs
    const originalConsoleError = console.error;
    console.error = () => {};
    
    app.get('/', () => { throw new Error('Unknown Error'); });
    const res = await app.request('/');
    
    console.error = originalConsoleError;
    
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json).toEqual({ status: 'error', message: 'Internal server error' });
  });
});
