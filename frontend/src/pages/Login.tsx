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

// Styled Paper component for layout and scoped styling
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const login = async () => {
    try {
      const response = await axios.post('http://localhost:7000/user/login', formData);
      if (response.status === 201) {
        alert('Logged in successfully');
        localStorage.setItem('token', response.data.token);
        setFormData({ email: '', password: '' });
        window.location.href = '/home';
      } else {
        alert(response.data.message || 'Login failed');
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'An error occurred');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login();
  };

  return (
    <Container maxWidth="sm">
      {/* ✅ Wrap form around the styled component */}
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
