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
  Alert
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import type { Environment } from '../models/types';
import { EnvironmentService } from '../services/environmentService';

const Environments: React.FC = () => {
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [currentEnvironment, setCurrentEnvironment] = useState<Environment | null>(null);
  const [formValues, setFormValues] = useState<Partial<Environment>>({
    code: '',
    name: '',
    description: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  useEffect(() => {
    fetchEnvironments();
  }, []);

  const fetchEnvironments = async () => {
    try {
      setLoading(true);
      const data = await EnvironmentService.getAll();
      setEnvironments(data);
    } catch (error) {
      console.error('Error fetching environments:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load environments',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (environment: Environment | null = null) => {
    if (environment) {
      setCurrentEnvironment(environment);
      setFormValues({
        code: environment.code,
        name: environment.name,
        description: environment.description
      });
    } else {
      setCurrentEnvironment(null);
      setFormValues({
        code: '',
        name: '',
        description: ''
      });
    }
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleOpenDelete = (environment: Environment) => {
    setCurrentEnvironment(environment);
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

  const handleSubmit = async () => {
    try {
      if (currentEnvironment) {
        // Update existing environment
        await EnvironmentService.update(currentEnvironment.id, {
          ...currentEnvironment,
          ...formValues
        } as Environment);
        setSnackbar({
          open: true,
          message: 'Environment updated successfully',
          severity: 'success'
        });
      } else {
        // Create new environment
        await EnvironmentService.create(formValues as Omit<Environment, 'id'>);
        setSnackbar({
          open: true,
          message: 'Environment created successfully',
          severity: 'success'
        });
      }
      handleCloseForm();
      fetchEnvironments();
    } catch (error) {
      console.error('Error saving environment:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save environment',
        severity: 'error'
      });
    }
  };

  const handleDelete = async () => {
    if (!currentEnvironment) return;
    
    try {
      await EnvironmentService.delete(currentEnvironment.id);
      setSnackbar({
        open: true,
        message: 'Environment deleted successfully',
        severity: 'success'
      });
      handleCloseDelete();
      fetchEnvironments();
    } catch (error) {
      console.error('Error deleting environment:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete environment',
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
          Environments
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
        >
          Add Environment
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
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {environments.map((environment) => (
                <TableRow key={environment.id}>
                  <TableCell>{environment.code}</TableCell>
                  <TableCell>{environment.name}</TableCell>
                  <TableCell>{environment.description}</TableCell>
                  <TableCell>
                    <Button 
                      startIcon={<EditIcon />} 
                      size="small" 
                      onClick={() => handleOpenForm(environment)}
                    >
                      Edit
                    </Button>
                    <Button 
                      startIcon={<DeleteIcon />} 
                      color="secondary" 
                      size="small"
                      onClick={() => handleOpenDelete(environment)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {environments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No environments found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Environment Form Dialog */}
      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="md" fullWidth>
        <DialogTitle>{currentEnvironment ? 'Edit Environment' : 'Add New Environment'}</DialogTitle>
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
            Are you sure you want to delete environment "{currentEnvironment?.name}"? This action cannot be undone.
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

export default Environments;
