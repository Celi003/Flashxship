import React from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box
      className="min-h-screen flex flex-col bg-flashxship-very-light-gray"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'background.default'
      }}
    >
      <Header />
      <Box
        component="main"
        className="flex-1 animate-fade-in"
        sx={{
          flex: 1,
          pt: { xs: 1, sm: 2 },
          pb: { xs: 2, sm: 3 }
        }}
      >
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout; 