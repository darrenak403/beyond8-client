'use client'

import { CertificateVerification } from '@/lib/api/services/fetchCertificate'
import LoadingState from './LoadingState'
import ErrorState from './ErrorState'
import CertificateVerificationCard from './CertificateVerificationCard'

interface SearchResultsProps {
  isLoading: boolean
  isError: boolean
  verification: CertificateVerification | undefined
  onReset: () => void
}

export default function SearchResults({
  isLoading,
  isError,
  verification,
  onReset,
}: SearchResultsProps) {
  if (isLoading) {
    return <LoadingState />
  }

  if (isError) {
    return <ErrorState onReset={onReset} />
  }

  if (verification) {
    return <CertificateVerificationCard verification={verification} />
  }

  return null
}
