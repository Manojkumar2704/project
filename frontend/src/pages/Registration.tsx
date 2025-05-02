import React, { useState, useEffect } from 'react';
import "./Registration.css";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from '@mui/material';
import { useAppDispatch,useAppSelector } from '../store/hooks';
import { registerUser } from '../store/slice/authSlice';

type FormData = {
  userName: string;
  email: string;
  password: string;
};

const Registration: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    userName: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const dispatch = useAppDispatch();
  const { error } = useAppSelector((state) => state.auth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.userName) newErrors.userName = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password || formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    dispatch(registerUser(formData)).then((res: any) => {
      if (res.meta.requestStatus === 'fulfilled') {
        alert('User registered successfully');
        setFormData({ userName: '', email: '', password: '' });
        window.location.href = '/login';
      } else {
        // this will be handled by the useEffect below
      }
    });
  };

  useEffect(() => {
    if (error) alert(error);
  }, [error]);

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Typography variant="h5" gutterBottom>
          Register
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <div>
            <TextField
              fullWidth
              label="User Name"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              error={!!errors.userName}
              helperText={errors.userName}
            />
            <br /><br />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />
            <br /><br />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
            />
            <br /><br />
            <Button variant="contained" fullWidth type="submit">
              Register
            </Button>
            <p>Already have an Account? <a href='/login'>Login</a></p>
          </div>
        </Box>
      </Paper>
    </Container>
  );
};

export default Registration;
