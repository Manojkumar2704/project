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
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

  };

  const login=async(formData:any)=>{
    const result= await axios.post("http://localhost:7000/user/login",formData)
    if(result.status===201){
     alert("Loged in successfully")
     localStorage.setItem("token",result.data.token)
     setFormData({
         email: '',
     password: '',
     })
     window.location.href="/home"
    }else{
         alert(result.data.message)
    }
   }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registered:', formData);
    login(formData)
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <div>
            <br/>
            <div >
              <TextField
              required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}

              />
            </div>
            <br/>

            <div>
              <TextField
              required
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <br/>

            <div>
              <Button variant="contained" fullWidth type="submit">
                Login
              </Button>
            </div>
            <p>Dont't have an Accoun ? <a href='/'>Register</a></p>
          </div>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;


