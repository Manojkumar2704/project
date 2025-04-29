import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from '@mui/material';
import axios from 'axios';

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.userName) newErrors.userName = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Email is invalid';
    if (!formData.password || formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const register=async(data:any)=>{
    const result=await axios.post("http://localhost:7000/user/register",data)
    if(result.status===201){
        alert(result.data.message);
        setFormData({
            userName: '',
            email: '',
            password: '',
        })
        window.location.href="/login"
    }else {
        alert(result.data.message)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    console.log('Registered:', formData);
     register(formData)
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Typography variant="h5" gutterBottom>
          Register
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <div>
            <div >
              <TextField
                fullWidth
                label="userName"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                error={!!errors.userName}
                helperText={errors.userName}
              />
            </div>
            <br/>
            <div >
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
            </div>
            <br/>

            <div>
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
            </div>
            <br/>

            <div>
              <Button variant="contained" fullWidth type="submit">
                Register
              </Button>
            </div>
            <p>Already have an Accoun ? <a href='/login'>Login</a></p>
          </div>
        </Box>
      </Paper>
    </Container>
  );
};

export default Registration;

