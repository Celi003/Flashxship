#!/usr/bin/env python
"""
Script pour corriger les erreurs TypeScript dans Admin.tsx
"""
import os

def fix_admin_file():
    """Corriger le fichier Admin.tsx"""
    
    admin_content = '''import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  useTheme,
  Tabs,
  Tab
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  productCategoryService, 
  equipmentCategoryService 
} from '../services/api';
import toast from 'react-hot-toast';

function TabPanel({ children, value, index }: { children: React.ReactNode; value: number; index: number }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Admin: React.FC = () => {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [tabValue, setTabValue] = useState(0);
  const [openProductCategoryDialog, setOpenProductCategoryDialog] = useState(false);
  const [openEquipmentCategoryDialog, setOpenEquipmentCategoryDialog] = useState(false);
  
  const [productCategoryForm, setProductCategoryForm] = useState({ name: '', description: '' });
  const [equipmentCategoryForm, setEquipmentCategoryForm] = useState({ name: '', description: '' });

  // Fetch data
  const { data: productCategoriesResponse } = useQuery({
    queryKey: ['product-categories'],
    queryFn: productCategoryService.getAll
  });

  const { data: equipmentCategoriesResponse } = useQuery({
    queryKey: ['equipment-categories'],
    queryFn: equipmentCategoryService.getAll
  });

  // Extract arrays from responses
  const productCategories = Array.isArray(productCategoriesResponse) ? productCategoriesResponse : 
                           (productCategoriesResponse as any)?.results || 
                           (productCategoriesResponse && typeof productCategoriesResponse === 'object' ? Object.values(productCategoriesResponse) : []) || 
                           [];
  const equipmentCategories = Array.isArray(equipmentCategoriesResponse) ? equipmentCategoriesResponse : 
                             (equipmentCategoriesResponse as any)?.results || 
                             (equipmentCategoriesResponse && typeof equipmentCategoriesResponse === 'object' ? Object.values(equipmentCategoriesResponse) : []) || 
                             [];

  // Mutations
  const createProductCategoryMutation = useMutation({
    mutationFn: (data: { name: string; description: string }) => {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      return productCategoryService.create(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-categories'] });
      setOpenProductCategoryDialog(false);
      setProductCategoryForm({ name: '', description: '' });
      toast.success('Catégorie de produit créée avec succès');
    },
    onError: () => {
      toast.error('Erreur lors de la création de la catégorie');
    }
  });

  const createEquipmentCategoryMutation = useMutation({
    mutationFn: (data: { name: string; description: string }) => {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      return equipmentCategoryService.create(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment-categories'] });
      setOpenEquipmentCategoryDialog(false);
      setEquipmentCategoryForm({ name: '', description: '' });
      toast.success('Catégorie d\\'équipement créée avec succès');
    },
    onError: () => {
      toast.error('Erreur lors de la création de la catégorie');
    }
  });

  const handleCreateProductCategory = () => {
    if (!productCategoryForm.name.trim()) {
      toast.error('Le nom de la catégorie est requis');
      return;
    }
    createProductCategoryMutation.mutate(productCategoryForm);
  };

  const handleCreateEquipmentCategory = () => {
    if (!equipmentCategoryForm.name.trim()) {
      toast.error('Le nom de la catégorie est requis');
      return;
    }
    createEquipmentCategoryMutation.mutate(equipmentCategoryForm);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" sx={{ mb: 2, fontWeight: 700 }}>
          Administration
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Gérez vos catégories
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="Catégories Produits" />
          <Tab label="Catégories Équipements" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenProductCategoryDialog(true)}
          >
            Ajouter une catégorie de produit
          </Button>
        </Box>
        
        <Grid container spacing={3}>
          {Array.isArray(productCategories) && productCategories.map((category: any) => (
            <Grid item xs={12} sm={6} md={4} key={category.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {category.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {category.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenEquipmentCategoryDialog(true)}
          >
            Ajouter une catégorie d'équipement
          </Button>
        </Box>
        
        <Grid container spacing={3}>
          {Array.isArray(equipmentCategories) && equipmentCategories.map((category: any) => (
            <Grid item xs={12} sm={6} md={4} key={category.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {category.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {category.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Product Category Dialog */}
      <Dialog open={openProductCategoryDialog} onClose={() => setOpenProductCategoryDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Ajouter une catégorie de produit</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Nom de la catégorie"
              value={productCategoryForm.name}
              onChange={(e) => setProductCategoryForm({ ...productCategoryForm, name: e.target.value })}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={productCategoryForm.description}
              onChange={(e) => setProductCategoryForm({ ...productCategoryForm, description: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenProductCategoryDialog(false)}>Annuler</Button>
          <Button 
            variant="contained" 
            onClick={handleCreateProductCategory}
            disabled={createProductCategoryMutation.isPending}
          >
            {createProductCategoryMutation.isPending ? 'Création...' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Equipment Category Dialog */}
      <Dialog open={openEquipmentCategoryDialog} onClose={() => setOpenEquipmentCategoryDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Ajouter une catégorie d'équipement</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Nom de la catégorie"
              value={equipmentCategoryForm.name}
              onChange={(e) => setEquipmentCategoryForm({ ...equipmentCategoryForm, name: e.target.value })}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={equipmentCategoryForm.description}
              onChange={(e) => setEquipmentCategoryForm({ ...equipmentCategoryForm, description: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEquipmentCategoryDialog(false)}>Annuler</Button>
          <Button 
            variant="contained" 
            onClick={handleCreateEquipmentCategory}
            disabled={createEquipmentCategoryMutation.isPending}
          >
            {createEquipmentCategoryMutation.isPending ? 'Création...' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Admin;
'''

    # Écrire le contenu corrigé
    with open('front/src/pages/Admin.tsx', 'w', encoding='utf-8') as f:
        f.write(admin_content)
    
    print("✅ Fichier Admin.tsx corrigé avec succès !")
    print("🔧 Corrections apportées :")
    print("   - Ajout de FormData pour les mutations")
    print("   - Protection Array.isArray() pour les .map()")
    print("   - Extraction correcte des données de l'API")
    print("   - Types TypeScript corrigés")

if __name__ == '__main__':
    fix_admin_file() 