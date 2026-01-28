'use client';

import { useAIPrompts, useCreateAIPrompt, useUpdateAIPrompt, useDeleteAIPrompt, useToggleAIPromptStatus } from '@/hooks/useAI';
import { getColumns } from './components/Columns';
import { AIPromptForm } from './components/AIPromptForm';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AIPrompt, CreateAIPromptRequest, UpdateAIPromptRequest } from '@/hooks/useAI';
import { AIPromptToolBar } from './components/AIPromptToolBar';
import { DataTable } from "@/components/ui/data-table";
import { PaginationState } from "@tanstack/react-table";
import { useIsMobile } from "@/hooks/useMobile";
import { ConfirmDialog } from "@/components/widget/confirm-dialog";
import { AIPromptsTableSkeleton } from "./components/AIPromptsTableSkeleton";

export default function AIPromptsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();

  // Read URL params
  const page = Number(searchParams.get('PageNumber')) || 1;
  const pageSize = Number(searchParams.get('PageSize')) || 10;
  const isDescending = searchParams.get('IsDescending') !== 'false';

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

    if (hasChanges) {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [searchParams, pathname, router]);

  const { data: promptRes, isLoading, refetch, isRefetching } = useAIPrompts({
    PageNumber: page,
    PageSize: pageSize,
    IsDescending: isDescending,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const metadata = promptRes?.metadata as any;
  const totalPages = metadata?.totalPages || 1;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<AIPrompt | null>(null);

  // Delete Dialog State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const createMutation = useCreateAIPrompt();
  const updateMutation = useUpdateAIPrompt();
  const deleteMutation = useDeleteAIPrompt();
  const toggleMutation = useToggleAIPromptStatus();

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

  const pagination: PaginationState = {
      pageIndex: page - 1,
      pageSize: pageSize,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setPagination = (updater: any) => {
      const newPagination = typeof updater === "function" ? updater(pagination) : updater;
      const params = new URLSearchParams(searchParams.toString());
      params.set("PageNumber", String(newPagination.pageIndex + 1));
      params.set("PageSize", String(newPagination.pageSize));
      router.push(`${pathname}?${params.toString()}`);
  };

  const handleEdit = useCallback((prompt: AIPrompt) => {
    setSelectedPrompt(prompt);
    setIsDialogOpen(true);
  }, []);
  
  const handleCreate = useCallback(() => {
     setSelectedPrompt(null);
     setIsDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
      setIsDialogOpen(false);
      setSelectedPrompt(null);
  }, []);

  const handleDeleteClick = useCallback((id: string) => {
      setDeleteId(id);
      setIsConfirmOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
      if (deleteId) {
          deleteMutation.mutate(deleteId, {
              onSuccess: () => {
                  setIsConfirmOpen(false);
                  setDeleteId(null);
              }
          });
      }
  }, [deleteId, deleteMutation]);

  const handleToggleStatus = useCallback((id: string) => {
      toggleMutation.mutate(id);
  }, [toggleMutation]);

  const handleSubmit = useCallback(async (data: CreateAIPromptRequest | UpdateAIPromptRequest) => {
      if (selectedPrompt) {
          updateMutation.mutate({ id: selectedPrompt.id, data: data as UpdateAIPromptRequest }, {
              onSuccess: () => handleCloseDialog()
          });
      } else {
          createMutation.mutate(data as CreateAIPromptRequest, {
              onSuccess: () => handleCloseDialog()
          });
      }
  }, [selectedPrompt, updateMutation, createMutation, handleCloseDialog]);

  const columns = useMemo(() => getColumns({
      onEdit: handleEdit,
      onDelete: handleDeleteClick,
      onToggleStatus: handleToggleStatus
  }), [handleEdit, handleDeleteClick, handleToggleStatus]);

  return (
    <div className={`h-full flex-1 flex-col space-y-4 ${isMobile ? 'p-2 space-y-4' : 'p-2'} flex`}>
        {isLoading ? (
            <AIPromptsTableSkeleton />
        ) : (
            <DataTable
                data={prompts}
                columns={columns}
                pagination={pagination}
                onPaginationChange={setPagination}
                pageCount={totalPages}
            >
                {() => (
                    <AIPromptToolBar 
                        sortFilter={isDescending ? 'true' : 'false'}
                        onSortChange={handleSortChange}
                        onAdd={handleCreate}
                        onRefresh={refetch}
                        isFetching={isRefetching || isLoading}
                    />
                )}
            </DataTable>
        )}

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

        <ConfirmDialog
            open={isConfirmOpen}
            onOpenChange={setIsConfirmOpen}
            onConfirm={handleConfirmDelete}
            title="Xóa Prompt"
            description="Bạn có chắc chắn muốn xóa prompt này không? Hành động này không thể hoàn tác."
            confirmText="Xóa"
            variant="destructive"
            isLoading={deleteMutation.isPending}
        />
    </div>
  );
}