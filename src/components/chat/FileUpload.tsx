'use client'

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Paperclip, X } from 'lucide-react';

interface FileAttachment {
  file: File;
  url: string;
  id: string;
}

interface FileUploadProps {
  onFileSelect: (files: FileAttachment[]) => void;
  attachments: FileAttachment[];
  onRemoveAttachment: (id: string) => void;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  attachments,
  onRemoveAttachment,
  disabled = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const newAttachments: FileAttachment[] = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }));

    onFileSelect([...attachments, ...newAttachments]);
    
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileSelect}
        accept="image/*,application/pdf,.doc,.docx,.txt"
      />
      
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleClick}
        disabled={disabled}
        className="h-8 w-8 p-0"
      >
        <Paperclip className="h-4 w-4" />
      </Button>

      {attachments.length > 0 && (
        <div className="mt-2 space-y-2">
          {attachments.map((attachment) => (
            <div key={attachment.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
              <div className="flex items-center space-x-2 min-w-0">
                {attachment.file.type.startsWith('image/') ? (
                  <img 
                    src={attachment.url} 
                    alt={attachment.file.name}
                    className="w-8 h-8 object-cover rounded"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                    <Paperclip className="h-4 w-4" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{attachment.file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(attachment.file.size)}</p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemoveAttachment(attachment.id)}
                className="h-6 w-6 p-0 flex-shrink-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
