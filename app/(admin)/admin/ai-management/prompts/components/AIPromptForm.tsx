'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { CreateAIPromptRequest, UpdateAIPromptRequest, AIPrompt } from '@/hooks/useAI';
import { useEffect } from 'react';
import { DialogFooter } from '@/components/ui/dialog';

const promptSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  template: z.string().min(1, 'Template is required'),
  version: z.string().min(1, 'Version is required'),
  description: z.string().optional(),
  maxTokens: z.coerce.number().min(1),
  temperature: z.coerce.number().min(0).max(2),
  topP: z.coerce.number().min(0).max(1),
  tags: z.string().optional(), // Comma separated for input
  isActive: z.boolean().optional(),
});

type PromptFormValues = z.infer<typeof promptSchema>;

interface AIPromptFormProps {
  initialData?: AIPrompt | null;
  onSubmit: (data: CreateAIPromptRequest | UpdateAIPromptRequest) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

export function AIPromptForm({ initialData, onSubmit, isSubmitting, onCancel }: AIPromptFormProps) {
  const form = useForm<PromptFormValues>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      name: '',
      category: 'General',
      template: '',
      version: '1.0',
      description: '',
      maxTokens: 1000,
      temperature: 0.7,
      topP: 1,
      tags: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        category: initialData.category,
        template: initialData.template,
        version: initialData.version,
        description: initialData.description || '',
        maxTokens: initialData.maxTokens,
        temperature: initialData.temperature,
        topP: initialData.topP,
        tags: initialData.tags ? initialData.tags.join(', ') : '',
        isActive: initialData.isActive,
      });
    } else {
      form.reset({
          name: '',
          category: 'General',
          template: '',
          version: '1.0',
          description: '',
          maxTokens: 1000,
          temperature: 0.7,
          topP: 1,
          tags: '',
          isActive: true,
        });
    }
  }, [initialData, form]);

  const handleSubmit = (values: PromptFormValues) => {
    const tagsArray = values.tags ? values.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = {
      ...values,
      tags: tagsArray,
    };

    if (initialData) {
         // Update mode might not need name/version if API restricts, but let's send what's allowed
         // Using UpdateAIPromptRequest structure
         const updatePayload: UpdateAIPromptRequest = {
             description: values.description,
             category: values.category,
             template: values.template,
             maxTokens: values.maxTokens,
             temperature: values.temperature,
             topP: values.topP,
             isActive: values.isActive,
             tags: tagsArray,
             // name and version might be read-only in some APIs, but user requested update logic
         };
         onSubmit(updatePayload);
    } else {
        onSubmit(payload as CreateAIPromptRequest);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Tên Prompt</FormLabel>
                <FormControl>
                    <Input placeholder="Nhập tên prompt..." {...field} disabled={!!initialData} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="version"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Phiên bản</FormLabel>
                <FormControl>
                    <Input placeholder="ví dụ: 1.0" {...field} disabled={!!initialData} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Danh mục</FormLabel>
              <FormControl>
                <Input placeholder="Nhập danh mục..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea placeholder="Mô tả chi tiết..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="template"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mẫu (Template)</FormLabel>
              <FormControl>
                <Textarea placeholder="Nhập nội dung mẫu prompt hệ thống..." className="min-h-[150px] font-mono text-sm" {...field} />
              </FormControl>
              <FormDescription>Nội dung prompt mẫu được sử dụng cho AI.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-3 gap-4">
            <FormField
            control={form.control}
            name="maxTokens"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Token tối đa</FormLabel>
                <FormControl>
                    <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
             <FormField
            control={form.control}
            name="temperature"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Temperature</FormLabel>
                <FormControl>
                    <Input type="number" step="0.1" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
             <FormField
            control={form.control}
            name="topP"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Top P</FormLabel>
                <FormControl>
                    <Input type="number" step="0.1" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thẻ (Tags)</FormLabel>
              <FormControl>
                <Input placeholder="tag1, tag2, tag3" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {initialData && (
            <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                    <FormLabel>Trạng thái hoạt động</FormLabel>
                    <FormDescription>
                    Bật hoặc tắt prompt này.
                    </FormDescription>
                </div>
                <FormControl>
                    <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    />
                </FormControl>
                </FormItem>
            )}
            />
        )}

        <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>Hủy</Button>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Đang lưu...' : (initialData ? 'Cập nhật' : 'Tạo mới')}
            </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
