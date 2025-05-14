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
  CircularProgress,
  Snackbar,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import type { Component, Product } from '../models/types';
import { ComponentService } from '../services/componentService';
import { ProductService } from '../services/productService';

const Components: React.FC = () => {
  const [components, setComponents] = useState<Component[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [currentComponent, setCurrentComponent] = useState<Component | null>(null);
  const [formValues, setFormValues] = useState<Partial<Component>>({
    code: '',
    name: '',
    description: '',
    productId: 0,
    componentType: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  useEffect(() => {
    fetchComponents();
    fetchProducts();
  }, []);

  const fetchComponents = async () => {
    try {
      setLoading(true);
      const data = await ComponentService.getAll();
      setComponents(data);
    } catch (error) {
      console.error('Error fetching components:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load components',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await ProductService.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleOpenForm = (component: Component | null = null) => {
    if (component) {
      setCurrentComponent(component);
      setFormValues({
        code: component.code,
        name: component.name,
        description: component.description,
        productId: component.productId,
        componentType: component.componentType
      });
    } else {
      setCurrentComponent(null);
      setFormValues({
        code: '',
        name: '',
        description: '',
        productId: products.length > 0 ? products[0].id : 0,
        componentType: ''
      });
    }
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleOpenDelete = (component: Component) => {
    setCurrentComponent(component);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const handleSelectChange = (e: SelectChangeEvent<number>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      if (currentComponent) {
        // Update existing component
        await ComponentService.update(currentComponent.id, {
          ...currentComponent,
          ...formValues
        } as Component);
        setSnackbar({
          open: true,
          message: 'Component updated successfully',
          severity: 'success'
        });
      } else {
        // Create new component
        await ComponentService.create(formValues as Omit<Component, 'id'>);
        setSnackbar({
          open: true,
          message: 'Component created successfully',
          severity: 'success'
        });
      }
      handleCloseForm();
      fetchComponents();
    } catch (error) {
      console.error('Error saving component:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save component',
        severity: 'error'
      });
    }
  };

  const handleDelete = async () => {
    if (!currentComponent) return;
    
    try {
      await ComponentService.delete(currentComponent.id);
      setSnackbar({
        open: true,
        message: 'Component deleted successfully',
        severity: 'success'
      });
      handleCloseDelete();
      fetchComponents();
    } catch (error) {
      console.error('Error deleting component:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete component',
        severity: 'error'
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getProductName = (productId: number): string => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Unknown';
  };

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" gutterBottom>
          Components
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
        >
          Add Component
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
                <TableCell>Product</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {components.map((component) => (
                <TableRow key={component.id}>
                  <TableCell>{component.code}</TableCell>
                  <TableCell>{component.name}</TableCell>
                  <TableCell>{component.description}</TableCell>
                  <TableCell>{getProductName(component.productId)}</TableCell>
                  <TableCell>{component.componentType}</TableCell>
                  <TableCell>
                    <Button 
                      startIcon={<EditIcon />} 
                      size="small" 
                      onClick={() => handleOpenForm(component)}
                    >
                      Edit
                    </Button>
                    <Button 
                      startIcon={<DeleteIcon />} 
                      color="secondary" 
                      size="small"
                      onClick={() => handleOpenDelete(component)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {components.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No components found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Component Form Dialog */}
      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="md" fullWidth>
        <DialogTitle>{currentComponent ? 'Edit Component' : 'Add New Component'}</DialogTitle>
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
            <FormControl fullWidth>
              <InputLabel id="product-select-label">Product</InputLabel>
              <Select
                labelId="product-select-label"
                id="product-select"
                name="productId"
                value={formValues.productId || ''}
                label="Product"
                onChange={handleSelectChange}
              >
                {products.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Component Type"
              name="componentType"
              fullWidth
              required
              value={formValues.componentType || ''}
              onChange={handleInputChange}
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
            Are you sure you want to delete component "{currentComponent?.name}"? This action cannot be undone.
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

export default Components;
