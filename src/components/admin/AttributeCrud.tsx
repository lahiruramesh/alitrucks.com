'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Plus, Save, X } from 'lucide-react';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Attribute {
  id: number;
  name: string;
}

interface AttributeCrudProps {
  tableName: string;
  title: string;
  description?: string;
}

const AttributeCrud: React.FC<AttributeCrudProps> = ({ tableName, title, description }) => {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [newAttributeName, setNewAttributeName] = useState('');
  const [editingAttribute, setEditingAttribute] = useState<Attribute | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const fetchAttributes = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from(tableName).select('*').order('name', { ascending: true });
    if (error) console.error('Error fetching attributes:', error);
    else setAttributes(data as Attribute[]);
    setLoading(false);
  }, [tableName]);

  useEffect(() => {
    fetchAttributes();
  }, [fetchAttributes]);

  const handleAdd = async () => {
    if (!newAttributeName.trim()) return;
    setAdding(true);
    
    const { data, error } = await supabase
      .from(tableName)
      .insert([{ name: newAttributeName.trim() }])
      .select();
      
    if (error) {
      console.error('Error adding attribute:', error);
    } else if (data) {
      setAttributes([...attributes, data[0]]);
      setNewAttributeName('');
    }
    setAdding(false);
  };

  const handleUpdate = async () => {
    if (!editingAttribute || !editingAttribute.name.trim()) return;
    
    const { data, error } = await supabase
      .from(tableName)
      .update({ name: editingAttribute.name.trim() })
      .eq('id', editingAttribute.id)
      .select();
      
    if (error) {
      console.error('Error updating attribute:', error);
    } else if (data) {
      setAttributes(attributes.map(attr => 
        attr.id === editingAttribute.id ? data[0] : attr
      ));
      setEditingAttribute(null);
    }
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from(tableName).delete().eq('id', id);
    if (error) {
      console.error('Error deleting attribute:', error);
    } else {
      setAttributes(attributes.filter((attr) => attr.id !== id));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: 'add' | 'update') => {
    if (e.key === 'Enter') {
      if (action === 'add') {
        handleAdd();
      } else {
        handleUpdate();
      }
    }
    if (e.key === 'Escape' && action === 'update') {
      setEditingAttribute(null);
    }
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{title}</h1>
        {description && (
          <p className="text-gray-600 mt-2 text-sm lg:text-base">{description}</p>
        )}
      </div>

      {/* Add New Item */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
            <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
            Add New {title.slice(0, -1)}
          </CardTitle>
          <CardDescription className="text-sm">
            Create a new {title.toLowerCase().slice(0, -1)} for the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              value={newAttributeName}
              onChange={(e) => setNewAttributeName(e.target.value)}
              placeholder={`Enter ${title.toLowerCase().slice(0, -1)} name`}
              onKeyDown={(e) => handleKeyPress(e, 'add')}
              className="flex-1"
            />
            <Button 
              onClick={handleAdd} 
              disabled={!newAttributeName.trim() || adding}
              className="shrink-0 w-full sm:w-auto"
            >
              {adding ? 'Adding...' : 'Add'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Items List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg lg:text-xl">Manage {title}</CardTitle>
          <CardDescription className="text-sm">
            {loading ? 'Loading...' : `${attributes.length} ${title.toLowerCase()} configured`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 rounded animate-pulse"></div>
              ))}
            </div>
          ) : attributes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No {title.toLowerCase()} found.</p>
              <p className="text-sm">Add one using the form above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="hidden sm:table-cell">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attributes.map((attr) => (
                    <TableRow key={attr.id}>
                      <TableCell className="font-mono text-sm text-gray-500 hidden sm:table-cell">
                        #{attr.id}
                      </TableCell>
                      <TableCell>
                        {editingAttribute?.id === attr.id ? (
                          <Input
                            value={editingAttribute.name}
                            onChange={(e) => setEditingAttribute({ ...editingAttribute, name: e.target.value })}
                            onKeyDown={(e) => handleKeyPress(e, 'update')}
                            className="max-w-xs text-sm"
                            autoFocus
                          />
                        ) : (
                          <span className="font-medium text-sm lg:text-base">{attr.name}</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1 lg:gap-2">
                          {editingAttribute?.id === attr.id ? (
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
                                onClick={() => setEditingAttribute(null)}
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
                                onClick={() => setEditingAttribute(attr)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="w-3 h-3 lg:w-4 lg:h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(attr.id)}
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

export default AttributeCrud;
