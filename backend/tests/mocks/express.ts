import { Request, Response } from 'express';
import { vi } from 'vitest';

export const mockRequest = (options: any = {}): Partial<Request> => {
  const {
    body = {},
    params = {},
    query = {},
    headers = {},
  } = options;
  
  return {
    body,
    params,
    query,
    headers,
  };
};

export const mockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.send = vi.fn().mockReturnValue(res);
  res.end = vi.fn().mockReturnValue(res);
  
  return res;
};

export const mockNext = vi.fn();