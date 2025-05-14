import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Snackbar,
  Alert,
  Chip
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import type { Tenant } from '../models/types';
import { TenantService } from '../services/tenantService';

const Tenants: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [formValues, setFormValues] = useState<Partial<Tenant>>({
    code: '',
    name: '',
    description: '',
    isActive: true
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const data = await TenantService.getAll();
      setTenants(data);
    } catch (error) {
      console.error('Error fetching tenants:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load tenants',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (tenant: Tenant | null = null) => {
    if (tenant) {
      setCurrentTenant(tenant);
      setFormValues({
        code: tenant.code,
        name: tenant.name,
        description: tenant.description,
        isActive: tenant.isActive
      });
    } else {
      setCurrentTenant(null);
      setFormValues({
        code: '',
        name: '',
        description: '',
        isActive: true
      });
    }
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleOpenDelete = (tenant: Tenant) => {
    setCurrentTenant(tenant);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormValues({
      ...formValues,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async () => {
    try {
      if (currentTenant) {
        // Update existing tenant
        await TenantService.update(currentTenant.id, {
          ...currentTenant,
          ...formValues
        } as Tenant);
        setSnackbar({
          open: true,
          message: 'Tenant updated successfully',
          severity: 'success'
        });
      } else {
        // Create new tenant
        await TenantService.create(formValues as Omit<Tenant, 'id'>);
        setSnackbar({
          open: true,
          message: 'Tenant created successfully',
          severity: 'success'
        });
      }
      handleCloseForm();
      fetchTenants();
    } catch (error) {
      console.error('Error saving tenant:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save tenant',
        severity: 'error'
      });
    }
  };

  const handleDelete = async () => {
    if (!currentTenant) return;
    
    try {
      await TenantService.delete(currentTenant.id);
      setSnackbar({
        open: true,
        message: 'Tenant deleted successfully',
        severity: 'success'
      });
      handleCloseDelete();
      fetchTenants();
    } catch (error) {
      console.error('Error deleting tenant:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete tenant',
        severity: 'error'
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" gutterBottom>
          Tenants
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
        >
          Add Tenant
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tenants.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell>{tenant.code}</TableCell>
                  <TableCell>{tenant.name}</TableCell>
                  <TableCell>{tenant.description}</TableCell>
                  <TableCell>
                    <Chip 
                      label={tenant.isActive ? 'Active' : 'Inactive'} 
                      color={tenant.isActive ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Button 
                      startIcon={<EditIcon />} 
                      size="small" 
                      onClick={() => handleOpenForm(tenant)}
                    >
                      Edit
                    </Button>
                    <Button 
                      startIcon={<DeleteIcon />} 
                      color="secondary" 
                      size="small"
                      onClick={() => handleOpenDelete(tenant)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {tenants.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No tenants found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Tenant Form Dialog */}
      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="md" fullWidth>
        <DialogTitle>{currentTenant ? 'Edit Tenant' : 'Add New Tenant'}</DialogTitle>
        <DialogContent>
          <Box mt={2} display="flex" flexDirection="column" gap={3}>
            <TextField
              label="Code"
              name="code"
              fullWidth
              required
              value={formValues.code || ''}
              onChange={handleInputChange}
            />
            <TextField
              label="Name"
              name="name"
              fullWidth
              required
              value={formValues.name || ''}
              onChange={handleInputChange}
            />
            <TextField
              label="Description"
              name="description"
              fullWidth
              multiline
              rows={3}
              value={formValues.description || ''}
              onChange={handleInputChange}
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="isActive"
                  checked={formValues.isActive || false}
                  onChange={handleInputChange}
                />
              }
              label="Active"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDelete} onClose={handleCloseDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete tenant "{currentTenant?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Cancel</Button>
          <Button onClick={handleDelete} color="secondary" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Tenants;

