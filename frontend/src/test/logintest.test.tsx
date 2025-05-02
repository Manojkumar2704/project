import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../pages/Login';
import userEvent from '@testing-library/user-event';
import axios from 'axios';


jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Login Component', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renders login form', () => {
    render(<Login />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('allows user to login successfully', async () => {
    mockedAxios.post.mockResolvedValue({
      status: 201,
      data: { token: 'mock-token' },
    });

    render(<Login />);

    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:7000/user/login', {
        email: 'test@example.com',
        password: 'password123',
      });
      expect(localStorage.getItem('token')).toBe('mock-token');
    });
  });

  test('shows error on failed login', async () => {
    mockedAxios.post.mockRejectedValue({
      response: { data: { message: 'Invalid credentials' } },
    });

    render(<Login />);

    await userEvent.type(screen.getByLabelText(/email/i), 'wrong@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'wrongpass');
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalled();
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});
