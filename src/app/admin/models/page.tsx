'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, Plus, Save, X, Car } from 'lucide-react';

interface Model {
  id: number;
  name: string;
  brand_id: number;
}

interface Brand {
  id: number;
  name: string;
}

const ModelsPage = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [newModelName, setNewModelName] = useState('');
  const [newModelBrand, setNewModelBrand] = useState<string>('');
  const [editingModel, setEditingModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchModels();
    fetchBrands();
  }, []);

  const fetchModels = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.from('models').select('*').order('name', { ascending: true });
    if (error) console.error('Error fetching models:', error);
    else setModels(data as Model[]);
    setLoading(false);
  };

  const fetchBrands = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.from('brands').select('*').order('name', { ascending: true });
    if (error) console.error('Error fetching brands:', error);
    else setBrands(data as Brand[]);
  };

  const handleAdd = async () => {
    if (!newModelName.trim() || !newModelBrand) return;
    setAdding(true);
    
    const supabase = createClient();
    const { data, error } = await supabase
      .from('models')
      .insert([{ name: newModelName.trim(), brand_id: parseInt(newModelBrand) }])
      .select();
      
    if (error) {
      console.error('Error adding model:', error);
    } else if (data) {
      setModels([...models, data[0]]);
      setNewModelName('');
      setNewModelBrand('');
    }
    setAdding(false);
  };

  const handleUpdate = async () => {
    if (!editingModel || !editingModel.name.trim()) return;
    
    const supabase = createClient();
    const { data, error } = await supabase
      .from('models')
      .update({ name: editingModel.name.trim(), brand_id: editingModel.brand_id })
      .eq('id', editingModel.id)
      .select();
      
    if (error) {
      console.error('Error updating model:', error);
    } else if (data) {
      setModels(models.map(model => 
        model.id === editingModel.id ? data[0] : model
      ));
      setEditingModel(null);
    }
  };

  const handleDelete = async (id: number) => {
    const supabase = createClient();
    const { error } = await supabase.from('models').delete().eq('id', id);
    if (error) {
      console.error('Error deleting model:', error);
    } else {
      setModels(models.filter((model) => model.id !== id));
    }
  };

  const getBrandName = (brandId: number) => {
    return brands.find(b => b.id === brandId)?.name || 'Unknown Brand';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (editingModel) {
        handleUpdate();
      } else {
        handleAdd();
      }
    }
    if (e.key === 'Escape' && editingModel) {
      setEditingModel(null);
    }
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Vehicle Models</h1>
        <p className="text-gray-600 mt-2 text-sm lg:text-base">Manage vehicle models associated with brands</p>
      </div>

      {/* Add New Model */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
            <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
            Add New Model
          </CardTitle>
          <CardDescription className="text-sm">
            Create a new vehicle model and associate it with a brand
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              value={newModelName}
              onChange={(e) => setNewModelName(e.target.value)}
              placeholder="Enter model name"
              onKeyDown={handleKeyPress}
              className="flex-1"
            />
            <Select value={newModelBrand} onValueChange={setNewModelBrand}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Select Brand" />
              </SelectTrigger>
              <SelectContent>
                {brands.map(brand => (
                  <SelectItem key={brand.id} value={brand.id.toString()}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={handleAdd} 
              disabled={!newModelName.trim() || !newModelBrand || adding}
              className="shrink-0 w-full sm:w-auto"
            >
              {adding ? 'Adding...' : 'Add Model'}
            </Button>
          </div>
          {brands.length === 0 && (
            <p className="text-sm text-amber-600 mt-2">
              ⚠️ No brands available. Please add brands first before creating models.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Models List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg lg:text-xl">Manage Models</CardTitle>
          <CardDescription className="text-sm">
            {loading ? 'Loading...' : `${models.length} models configured`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 rounded animate-pulse"></div>
              ))}
            </div>
          ) : models.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Car className="w-8 h-8 lg:w-12 lg:h-12 mx-auto mb-3 text-gray-300" />
              <p>No models found.</p>
              <p className="text-sm">Add one using the form above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="hidden sm:table-cell">ID</TableHead>
                    <TableHead>Model Name</TableHead>
                    <TableHead className="hidden md:table-cell">Brand</TableHead>
                    <TableHead className="hidden lg:table-cell">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {models.map((model) => (
                    <TableRow key={model.id}>
                      <TableCell className="font-mono text-sm text-gray-500 hidden sm:table-cell">
                        #{model.id}
                      </TableCell>
                      <TableCell>
                        {editingModel?.id === model.id ? (
                          <Input
                            value={editingModel.name}
                            onChange={(e) => setEditingModel({ ...editingModel, name: e.target.value })}
                            onKeyDown={handleKeyPress}
                            className="max-w-xs text-sm"
                            autoFocus
                          />
                        ) : (
                          <div>
                            <span className="font-medium text-sm lg:text-base">{model.name}</span>
                            <div className="md:hidden text-xs text-gray-500 mt-1">
                              Brand: {getBrandName(model.brand_id)}
                            </div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {editingModel?.id === model.id ? (
                          <Select 
                            value={editingModel.brand_id.toString()} 
                            onValueChange={(value) => setEditingModel({ ...editingModel, brand_id: parseInt(value) })}
                          >
                            <SelectTrigger className="w-32 lg:w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {brands.map(brand => (
                                <SelectItem key={brand.id} value={brand.id.toString()}>
                                  {brand.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                            {getBrandName(model.brand_id)}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1 lg:gap-2">
                          {editingModel?.id === model.id ? (
                            <>
                              <Button
                                size="sm"
                                onClick={handleUpdate}
                                className="h-8 w-8 p-0"
                              >
                                <Save className="w-3 h-3 lg:w-4 lg:h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingModel(null)}
                                className="h-8 w-8 p-0"
                              >
                                <X className="w-3 h-3 lg:w-4 lg:h-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingModel(model)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="w-3 h-3 lg:w-4 lg:h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(model.id)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ModelsPage;
