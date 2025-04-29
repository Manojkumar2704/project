import { FilterProductController } from '../controllers/productController';
import { FilterProductService } from '../services/productService';
import { Request, Response } from 'express';

describe('FilterProductController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;
  let filterProductServiceMock: jest.Mocked<FilterProductService>;

  beforeEach(() => {
    req = { body: { filter: 'phone' } };

    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    res = {
      status: statusMock,
    };

    filterProductServiceMock = {
      filter: jest.fn(),
    } as unknown as jest.Mocked<FilterProductService>;
  });

  it('should return 200 and filtered products', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockData:any[] = [
      { _id: '1', name: 'iPhone', description: 'Smartphone', price: 999, created: '2023-01-01' },
    ];

    filterProductServiceMock.filter.mockResolvedValue(mockData);

    const controller = new FilterProductController(filterProductServiceMock);
    await controller.filter(req as Request, res as Response);

    expect(filterProductServiceMock.filter).toHaveBeenCalledWith('phone');
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({ success: true, result: mockData });
  });

  it('should handle errors and return 404', async () => {
    const error = new Error('Something went wrong');
    filterProductServiceMock.filter.mockRejectedValue(error);

    const controller = new FilterProductController(filterProductServiceMock);
    await controller.filter(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: 'Server Error',
      error,
    });
  });
});
