import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { AIPrompt } from "@/lib/api/services/fetchAI";
import { ExpandableText } from "./ExpandableText";

interface AIPromptListProps {
  prompts: AIPrompt[];
  isLoading: boolean;
  onEdit: (prompt: AIPrompt) => void;
  onDelete?: (id: string) => void;
}

export function AIPromptList({ prompts, isLoading, onEdit, onDelete }: AIPromptListProps) {
  return (
    <div className="rounded-md border bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Tên Prompt</TableHead>
            <TableHead className="w-[150px]">Danh mục</TableHead>
            <TableHead className="w-[300px]">Mẫu (Template)</TableHead>
            <TableHead className="w-[80px]">Phiên bản</TableHead>
            <TableHead className="w-[100px]">Trạng thái</TableHead>
            <TableHead className="w-[120px] text-right">Ngày tạo</TableHead>
            <TableHead className="w-[100px] text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[50px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[100px] ml-auto" /></TableCell>
                <TableCell><Skeleton className="h-8 w-[80px] ml-auto" /></TableCell>
              </TableRow>
            ))
          ) : prompts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                Không có prompt nào được tìm thấy.
              </TableCell>
            </TableRow>
          ) : (
            prompts.map((prompt) => (
              <TableRow key={prompt.id}>
                <TableCell className="align-top">
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-gray-900 break-words whitespace-normal">{prompt.name}</span>
                    {prompt.description && (
                       <div className="text-xs text-muted-foreground">
                          <ExpandableText text={prompt.description} maxLength={50} />
                       </div>
                    )}
                    <div className="flex flex-wrap gap-1 mt-1">
                        {prompt.tags?.map(tag => (
                            <Badge key={tag} variant="outline" className="text-[10px] px-1 py-0 h-5">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="align-top">
                    <Badge variant="secondary" className="whitespace-nowrap">
                        {prompt.category}
                    </Badge>
                </TableCell>
                <TableCell className="align-top">
                  <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded border font-mono">
                    <ExpandableText text={prompt.template} maxLength={100} />
                  </div>
                </TableCell>
                 <TableCell className="align-top font-mono text-sm">
                    v{prompt.version}
                </TableCell>
                <TableCell className="align-top">
                   <Badge variant={prompt.isActive ? 'default' : 'secondary'}
                          className={prompt.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200'}>
                     {prompt.isActive ? 'Hoạt động' : 'Vô hiệu'}
                   </Badge>
                </TableCell>
                <TableCell className="text-right text-sm text-gray-500 align-top">
                  {format(new Date(prompt.createdAt), 'dd/MM/yyyy')}
                </TableCell>
                <TableCell className="text-right align-top">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(prompt)} className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete && onDelete(prompt.id)} className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
