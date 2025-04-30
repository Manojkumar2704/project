import React from 'react';
import { Box, Typography, Container, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#1976d2',
        color: 'white',
        py: 3,
        mt: 5,
        textAlign: 'center',
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body1">
          &copy; {new Date().getFullYear()} My Product App. All rights reserved.
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Link href="/about" color="inherit" underline="hover" sx={{ mx: 1 }}>
            About
          </Link>
          <Link href="/contact" color="inherit" underline="hover" sx={{ mx: 1 }}>
            Contact
          </Link>
          <Link href="/privacy" color="inherit" underline="hover" sx={{ mx: 1 }}>
            Privacy
          </Link>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
