import { useQuery } from "@tanstack/react-query";
import {
  fetchCertificate,
  MyCertificatesResponse,
  CertificateDetailResponse,
  CertificateVerificationResponse,
  CertificateSummary,
  CertificateDetail,
  CertificateVerification,
} from "@/lib/api/services/fetchCertificate";

interface UseGetMyCertificatesOptions {
  enabled?: boolean;
}

interface UseGetCertificateByIdOptions {
  enabled?: boolean;
}

interface UseVerifyCertificateOptions {
  enabled?: boolean;
}

// Hook lấy danh sách chứng chỉ của user hiện tại
export function useGetMyCertificates(options?: UseGetMyCertificatesOptions) {
  const { data, isLoading, isError, refetch } = useQuery<
    MyCertificatesResponse,
    Error,
    CertificateSummary[]
  >({
    queryKey: ["certificates", "me"],
    queryFn: () => fetchCertificate.getMyCertificates(),
    enabled: options?.enabled ?? true,
    select: (res) => res.data,
  });

  return {
    certificates: data ?? [],
    isLoading,
    isError,
    refetch,
  };
}

// Hook lấy chi tiết chứng chỉ theo ID
export function useGetCertificateById(
  id?: string,
  options?: UseGetCertificateByIdOptions
) {
  const { data, isLoading, isError, refetch } = useQuery<
    CertificateDetailResponse,
    Error,
    CertificateDetail
  >({
    queryKey: ["certificates", "detail", id],
    queryFn: () => fetchCertificate.getCertificateById(id as string),
    enabled: options?.enabled ?? !!id,
    select: (res) => res.data,
  });

  return {
    certificate: data,
    isLoading,
    isError,
    refetch,
  };
}

// Hook xác thực chứng chỉ theo hash
export function useVerifyCertificate(
  hash?: string,
  options?: UseVerifyCertificateOptions
) {
  const { data, isLoading, isError, refetch } = useQuery<
    CertificateVerificationResponse,
    Error,
    CertificateVerification
  >({
    queryKey: ["certificates", "verify", hash],
    queryFn: () => fetchCertificate.verifyCertificate(hash as string),
    enabled: options?.enabled ?? !!hash,
    select: (res) => res.data,
  });

  return {
    verification: data,
    isLoading,
    isError,
    refetch,
  };
}
