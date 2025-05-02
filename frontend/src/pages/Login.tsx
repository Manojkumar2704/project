import React, { useState } from 'react';
import {
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Link,
  styled,
} from '@mui/material';
import axios from 'axios';

type FormData = {
  email: string;
  password: string;
};

const LoginWrapper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(8),
  boxShadow: theme.shadows[3],
  '& .MuiTextField-root': {
    marginTop: theme.spacing(2),
  },
  '& .MuiButton-root': {
    marginTop: theme.spacing(2),
    textTransform: 'none',
  },
  '& a': {
    textDecoration: 'none',
    color: theme.palette.primary.main,
  },
}));

const Login: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });

  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const login = async () => {
    try {
      const response = await axios.post('http://localhost:7000/user/login', formData);
      if (response.status === 201) {
        localStorage.setItem('token', response.data.token);
        setFormData({ email: '', password: '' });
        window.location.href = '/home';
      } else {
        setError(response.data.message || 'Login failed');
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error.response?.data?.message || 'Invalid credentials');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous error before new attempt
    login();
  };

  return (
    <Container maxWidth="sm">
      <form onSubmit={handleSubmit} noValidate>
        <LoginWrapper>
          <Typography variant="h5" gutterBottom>
            Login
          </Typography>

          <TextField
            required
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />

          <TextField
            required
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />

          {error && (
            <Typography color="error" data-testid="error-message">
              {error}
            </Typography>
          )}

          <Button variant="contained" fullWidth type="submit">
            Login
          </Button>

          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Don&apos;t have an account? <Link href="/">Register</Link>
          </Typography>
        </LoginWrapper>
      </form>
    </Container>
  );
};

export default Login;
