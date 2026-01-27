'use client';

import { useAIPrompts, useCreateAIPrompt, useUpdateAIPrompt } from '@/hooks/useAI';
import { AIPromptList } from './components/AIPromptList';
import { AIPromptForm } from './components/AIPromptForm';
import { AIPagination } from './components/AIPagination';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AIPrompt, CreateAIPromptRequest, UpdateAIPromptRequest } from '@/lib/api/services/fetchAI';
import { AIPromptToolBar } from './components/AIPromptToolBar';

export default function AIPromptsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read URL params
  const page = Number(searchParams.get('PageNumber')) || 1;
  const pageSize = Number(searchParams.get('PageSize')) || 10;
  const isDescending = searchParams.get('IsDescending') !== 'false';  
  const totalPages = Number(searchParams.get('TotalPages')) || 1;

  // Sync default params to URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    let hasChanges = false;

    if (!searchParams.has('PageNumber')) {
      params.set('PageNumber', '1');
      hasChanges = true;
    }
    if (!searchParams.has('PageSize')) {
      params.set('PageSize', '10');
      hasChanges = true;
    }
    if (!searchParams.has('IsDescending')) {
      params.set('IsDescending', 'true');
      hasChanges = true;
    }
    if (!searchParams.has('TotalPages')) {
      params.set('TotalPages', '1');
      hasChanges = true;
    }

    if (hasChanges) {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [searchParams, pathname, router]);

  const { data: promptRes, isLoading, refetch, isRefetching } = useAIPrompts({
    PageNumber: page,
    PageSize: pageSize,
    IsDescending: isDescending,
      });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<AIPrompt | null>(null);

  const createMutation = useCreateAIPrompt();
  const updateMutation = useUpdateAIPrompt();

  const prompts = promptRes?.data || [];
  
  const updateUrl = (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
          params.set(key, value);
      } else {
          params.delete(key);
      }
      if (key !== 'PageNumber') {
          params.set('PageNumber', '1');
      }
      router.push(`${pathname}?${params.toString()}`);
  }

  const handleSortChange = (value: string) => {
      updateUrl('IsDescending', value);
  };

  const handlePageChange = (newPage: number) => {
      updateUrl('PageNumber', newPage.toString());
  };

  const handleEdit = (prompt: AIPrompt) => {
    setSelectedPrompt(prompt);
    setIsDialogOpen(true);
  };
  
  const handleCreate = () => {
     setSelectedPrompt(null);
     setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
      setIsDialogOpen(false);
      setSelectedPrompt(null);
  }

  const handleSubmit = async (data: CreateAIPromptRequest | UpdateAIPromptRequest) => {
      if (selectedPrompt) {
          updateMutation.mutate({ id: selectedPrompt.id, data: data as UpdateAIPromptRequest }, {
              onSuccess: () => handleCloseDialog()
          });
      } else {
          createMutation.mutate(data as CreateAIPromptRequest, {
              onSuccess: () => handleCloseDialog()
          });
      }
  };

  return (
    <div className="space-y-6 flex flex-col gap-3">
        <AIPromptToolBar 
            sortFilter={isDescending ? 'true' : 'false'}
            onSortChange={handleSortChange}
            onAdd={handleCreate}
            onRefresh={refetch}
            isFetching={isRefetching || isLoading}
        />

      <AIPromptList 
        prompts={prompts} 
        isLoading={isLoading} 
        onEdit={handleEdit} 
      />

      <AIPagination 
        pageIndex={page}
        pageSize={pageSize}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
            <DialogTitle>{selectedPrompt ? 'Cập nhật Prompt' : 'Tạo mới Prompt'}</DialogTitle>
            <DialogDescription>
                {selectedPrompt ? 'Chỉnh sửa thông tin prompt hiện có.' : 'Điền thông tin để tạo prompt mới.'}
            </DialogDescription>
            </DialogHeader>
            
            <AIPromptForm 
                initialData={selectedPrompt}
                onSubmit={handleSubmit}
                isSubmitting={createMutation.isPending || updateMutation.isPending}
                onCancel={handleCloseDialog}
            />
        </DialogContent>
        </Dialog>
    </div>
  );
}