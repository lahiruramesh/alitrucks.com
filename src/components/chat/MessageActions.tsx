'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Copy, Download, Reply, Trash2 } from 'lucide-react';

interface MessageActionsProps {
  messageId: number;
  content: string;
  attachmentUrl?: string;
  attachmentName?: string;
  isOwnMessage: boolean;
  onDelete?: (messageId: number) => void;
  onReply?: (content: string) => void;
}

export const MessageActions: React.FC<MessageActionsProps> = ({
  messageId,
  content,
  attachmentUrl,
  attachmentName,
  isOwnMessage,
  onDelete,
  onReply
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCopyText = () => {
    navigator.clipboard.writeText(content);
    setIsOpen(false);
  };

  const handleDownloadAttachment = () => {
    if (attachmentUrl && attachmentName) {
      const link = document.createElement('a');
      link.href = attachmentUrl;
      link.download = attachmentName;
      link.click();
    }
    setIsOpen(false);
  };

  const handleReply = () => {
    if (onReply) {
      onReply(content);
    }
    setIsOpen(false);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(messageId);
    }
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreVertical className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        <DropdownMenuItem onClick={handleCopyText}>
          <Copy className="h-3 w-3 mr-2" />
          Copy
        </DropdownMenuItem>
        
        {attachmentUrl && (
          <DropdownMenuItem onClick={handleDownloadAttachment}>
            <Download className="h-3 w-3 mr-2" />
            Download
          </DropdownMenuItem>
        )}
        
        {!isOwnMessage && onReply && (
          <DropdownMenuItem onClick={handleReply}>
            <Reply className="h-3 w-3 mr-2" />
            Reply
          </DropdownMenuItem>
        )}
        
        {isOwnMessage && onDelete && (
          <DropdownMenuItem 
            onClick={handleDelete}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="h-3 w-3 mr-2" />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
