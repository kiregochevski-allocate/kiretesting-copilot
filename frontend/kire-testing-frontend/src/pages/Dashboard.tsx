import React, { useEffect, useState } from 'react';
import { Container, Paper, Typography, Box, Stack, CircularProgress } from '@mui/material';
import apiClient from '../services/apiClient';

const Dashboard: React.FC = () => {
  const [productCount, setProductCount] = useState<number | null>(null);
  const [tenantCount, setTenantCount] = useState<number | null>(null);
  const [componentCount, setComponentCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [productResponse, tenantResponse, componentResponse] = await Promise.all([
          apiClient.get('/products'),
          apiClient.get('/tenants'),
          apiClient.get('/components')
        ]);

        setProductCount(productResponse.data.length);
        setTenantCount(tenantResponse.data.length);
        setComponentCount(componentResponse.data.length);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Summary Cards */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          <Box flex={1}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: 140,
              }}
            >
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Products
              </Typography>
              <Typography component="p" variant="h4">
                {loading ? <CircularProgress size={24} /> : productCount ?? '--'}
              </Typography>
              <Typography color="text.secondary" sx={{ flex: 1 }}>
                Total products in the system
              </Typography>
            </Paper>
          </Box>
          <Box flex={1}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: 140,
              }}
            >
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Tenants
              </Typography>
              <Typography component="p" variant="h4">
                {loading ? <CircularProgress size={24} /> : tenantCount ?? '--'}
              </Typography>
              <Typography color="text.secondary" sx={{ flex: 1 }}>
                Active tenants
              </Typography>
            </Paper>
          </Box>
          <Box flex={1}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: 140,
              }}
            >
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Components
              </Typography>
              <Typography component="p" variant="h4">
                {loading ? <CircularProgress size={24} /> : componentCount ?? '--'}
              </Typography>
              <Typography color="text.secondary" sx={{ flex: 1 }}>
                Registered components
              </Typography>
            </Paper>
          </Box>
        </Stack>
        
        {/* Additional info */}
        <Box>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Recent Updates
            </Typography>
            <Typography variant="body1" paragraph>
              Welcome to the Kire Testing Platform. This dashboard provides an overview of the 
              testing environment. Use the navigation menu to access detailed information about 
              products, tenants, components, and environments.
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;
