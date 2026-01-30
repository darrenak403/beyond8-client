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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: General Info */}
          <div className="space-y-4">
            <div className="space-y-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                Thông tin chung
              </h3>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên Prompt <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên prompt..." {...field} disabled={!!initialData} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Danh mục <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="ví dụ: Chatbot" {...field} className="bg-white" />
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
                      <FormLabel>Phiên bản <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="v1.0" {...field} disabled={!!initialData} className="bg-white" />
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
                      <Input placeholder="tag1, tag2..." {...field} className="bg-white" />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Phân cách bằng dấu phẩy
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {initialData && (
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border bg-white p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Trạng thái</FormLabel>
                        <FormDescription className="text-xs">
                          Bật/tắt prompt này
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
            </div>

            <div className="space-y-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
              <h3 className="text-sm font-semibold text-slate-800">Cấu hình Model</h3>
              <div className="grid grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="maxTokens"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Max Tokens</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="bg-white" />
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
                      <FormLabel className="text-xs">Temperature</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} className="bg-white" />
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
                      <FormLabel className="text-xs">Top P</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} className="bg-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Template */}
          <div className="space-y-4 h-full flex flex-col">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Mô tả chức năng của prompt..." className="min-h-[80px] resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="template"
              render={({ field }) => (
                <FormItem className="flex-1 flex flex-col">
                  <FormLabel>Nội dung Template <span className="text-red-500">*</span></FormLabel>
                  <FormControl className="flex-1">
                    <Textarea
                      placeholder="Nhập system prompt..."
                      className="min-h-[300px] font-mono text-sm leading-relaxed p-4 bg-slate-900 text-slate-50 resize-none flex-1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

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
