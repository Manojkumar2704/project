
import { UploadManyService } from '../services/productService';
import Products from '../model/productModel';

jest.mock('../model/productModel');

describe('UploadManyService - uploadMany', () => {
  const service = new UploadManyService();

  it('should create and save a new product', async () => {
    const mockData = {
      name: 'Test Product',
      description: 'Test Description',
      price: 100,
      quantity: 5,
    };
    const mockImages = ['image1.jpg', 'image2.jpg'];

    const mockSavedProduct = {
      ...mockData,
      image: mockImages,
      _id: 'mock-id',
    };

    (Products as unknown as jest.Mock).mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(mockSavedProduct),
    }));

    const result = await service.uploadMany(mockData, mockImages);

    expect(result).toEqual(mockSavedProduct);
  });
});
