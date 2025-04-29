// src/__tests__/LoginService.test.ts
import { LoginService } from '../services/userServices';
import User from '../model/userModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('../model/userModel');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('LoginService - loginUser', () => {
  const loginService = new LoginService();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return token on successful login', async () => {
    const mockUser = { _id: '123', email: 'test', password: 'hashedPass' };
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue('mockToken');

    const result = await loginService.loginUser('test', 'password123');

    expect(User.findOne).toHaveBeenCalledWith({ email: 'test' });
    expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPass');
    expect(jwt.sign).toHaveBeenCalledWith({ id: '123' }, expect.any(String), { expiresIn: '1h' });
    expect(result).toBe('mockToken');
  });

  it('should throw error on invalid password', async () => {
    const mockUser = { email: 'test', password: 'hashedPass' };
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(loginService.loginUser('test', 'wrongPass')).rejects.toThrow('Invalid password for the user');
  });

  it('should throw error if user not found', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);

    await expect(loginService.loginUser('unknown', 'password123')).rejects.toThrow('User not found');
  });
});
