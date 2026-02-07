'use client'

import React, { useState } from 'react'
import { useVerifyCertificate } from '@/hooks/useCertificate'
import SearchForm from './components/SearchForm'
import SearchResults from './components/SearchResults'
import EmptyState from './components/EmptyState'

export default function SearchCertificatePage() {
  const [hash, setHash] = useState('')
  const [searchHash, setSearchHash] = useState<string | undefined>(undefined)
  
  const { verification, isLoading, isError } = useVerifyCertificate(
    searchHash,
    { enabled: !!searchHash }
  )

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (hash.trim()) {
      setSearchHash(hash.trim())
    }
  }

  const handleReset = () => {
    setHash('')
    setSearchHash(undefined)
  }

  return (
    <div className="container min-h-screen mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">
          Tìm kiếm chứng chỉ
        </h1>
        <p className="text-muted-foreground">
          Nhập mã hash để xác thực và xem thông tin chứng chỉ
        </p>
      </div>

      {/* Search Form */}
      <SearchForm
        hash={hash}
        isLoading={isLoading}
        hasSearch={!!searchHash}
        onHashChange={setHash}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      {/* Results */}
      {searchHash && (
        <SearchResults
          isLoading={isLoading}
          isError={isError}
          verification={verification}
          onReset={handleReset}
        />
      )}

      {/* Empty State - No search yet */}
      {!searchHash && !isLoading && <EmptyState />}
    </div>
  )
}
