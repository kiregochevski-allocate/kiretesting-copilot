import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Tenants from './pages/Tenants';
import Components from './pages/Components';
import Environments from './pages/Environments';
import Layout from './components/Layout';
import NotFound from './pages/NotFound';

const App: React.FC = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/tenants" element={<Tenants />} />
          <Route path="/components" element={<Components />} />
          <Route path="/environments" element={<Environments />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Box>
  );
};

export default App;
