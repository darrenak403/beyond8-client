'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Search, Loader2, RotateCw } from 'lucide-react'

interface SearchFormProps {
  hash: string
  isLoading: boolean
  hasSearch: boolean
  onHashChange: (value: string) => void
  onSearch: (e: React.FormEvent) => void
  onReset: () => void
}

export default function SearchForm({
  hash,
  isLoading,
  onHashChange,
  onSearch,
  onReset,
}: SearchFormProps) {
  return (
    <Card className="mb-6 border-none mx-auto max-w-2xl">
      <CardContent>
        <form onSubmit={onSearch} className="flex gap-3">
          <Input
            type="text"
            placeholder="Nhập mã hash chứng chỉ..."
            value={hash}
            onChange={(e) => onHashChange(e.target.value)}
            className="flex-1 rounded-xl"
          />
          <Button type="submit" disabled={!hash.trim() || isLoading} className="py-2 px-4 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors border border-purple-500 cursor-pointer">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
              </>
            )}
          </Button>        
          <Button type="button" variant="outline" onClick={onReset} className='border-none hover:bg-white hover:text-primary'>
            <RotateCw className="w-4 h-4" />
          </Button>         
        </form>
      </CardContent>
    </Card>
  )
}
