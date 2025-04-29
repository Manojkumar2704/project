import { UserService } from '../services/userServices';
import bcrypt from 'bcrypt';
import User from '../model/userModel';

jest.mock('bcrypt');
jest.mock('../model/userModel');

describe('UserService.registerUser', () => {
    const mockUserService = new UserService();
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should throw an error if email already exists', async () => {
        (User.findOne as jest.Mock).mockResolvedValue({ email: 'test@example.com' });

        await expect(
            mockUserService.registerUser('TestUser', 'test@example.com', 'password123')
        ).rejects.toThrow('Email already in use');
    });

    it('should register a new user if email does not exist', async () => {
        const mockSavedUser = { userName: 'TestUser', email: 'test@example.com' };
        (User.findOne as jest.Mock).mockResolvedValue(null);
        (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (User as any).mockImplementation(() => ({
            save: jest.fn().mockResolvedValue(mockSavedUser),
        }));
        const result = await mockUserService.registerUser('TestUser', 'test@example.com', 'password123');
        expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
        expect(result).toEqual(mockSavedUser);
    });
});
