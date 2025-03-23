import { vi } from 'vitest';

export const mockDynamoDBClient = {
  scan: vi.fn().mockReturnValue({
    promise: vi.fn().mockResolvedValue({ Items: [] })
  }),
  get: vi.fn().mockReturnValue({
    promise: vi.fn().mockResolvedValue({ Item: null })
  }),
  put: vi.fn().mockReturnValue({
    promise: vi.fn().mockResolvedValue({})
  }),
  update: vi.fn().mockReturnValue({
    promise: vi.fn().mockResolvedValue({ Attributes: {} })
  }),
  delete: vi.fn().mockReturnValue({
    promise: vi.fn().mockResolvedValue({ Attributes: {} })
  })
};

export const mockDynamoDBScan = (mockItems: any[]) => {
  mockDynamoDBClient.scan.mockReturnValue({
    promise: vi.fn().mockResolvedValue({ Items: mockItems })
  });
};

export const mockDynamoDBGet = (mockItem: any) => {
  mockDynamoDBClient.get.mockReturnValue({
    promise: vi.fn().mockResolvedValue({ Item: mockItem })
  });
};

export const mockDynamoDBPut = (mockResponse: any = {}) => {
  mockDynamoDBClient.put.mockReturnValue({
    promise: vi.fn().mockResolvedValue(mockResponse)
  });
};

export const mockDynamoDBUpdate = (mockAttributes: any) => {
  mockDynamoDBClient.update.mockReturnValue({
    promise: vi.fn().mockResolvedValue({ Attributes: mockAttributes })
  });
};

export const mockDynamoDBDelete = (mockAttributes: any) => {
  mockDynamoDBClient.delete.mockReturnValue({
    promise: vi.fn().mockResolvedValue({ Attributes: mockAttributes })
  });
};

export const mockDynamoDBError = (method: keyof typeof mockDynamoDBClient, error: Error) => {
  mockDynamoDBClient[method].mockReturnValue({
    promise: vi.fn().mockRejectedValue(error)
  });
};