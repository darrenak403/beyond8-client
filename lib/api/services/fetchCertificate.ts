import apiService from "../core";

// Certificate summary data (from /me endpoint)
export interface CertificateSummary {
  id: string;
  certificateNumber: string;
  courseTitle: string;
  issuedDate: string;
  verificationHash: string;
}

// Certificate detail data (from /{id} endpoint)
export interface CertificateDetail {
  id: string;
  enrollmentId: string;
  courseId: string;
  certificateNumber: string;
  studentName: string;
  courseTitle: string;
  instructorName: string;
  completionDate: string;
  issuedDate: string;
  certificatePdfUrl: string | null;
  certificateImageUrl: string | null;
  verificationHash: string;
  isValid: boolean;
  revokedAt: string | null;
  revocationReason: string | null;
}

// Certificate verification data (from /verify/{hash} endpoint)
export interface CertificateVerification {
  id: string;
  certificateNumber: string;
  studentName: string;
  courseTitle: string;
  instructorName: string;
  completionDate: string;
  issuedDate: string;
  isValid: boolean;
  revokedAt: string | null;
  revocationReason: string | null;
}

// Response interfaces
export interface MyCertificatesResponse {
  isSuccess: boolean;
  message: string;
  data: CertificateSummary[];
  metadata: null;
}

export interface CertificateDetailResponse {
  isSuccess: boolean;
  message: string;
  data: CertificateDetail;
  metadata: null;
}

export interface CertificateVerificationResponse {
  isSuccess: boolean;
  message: string;
  data: CertificateVerification;
  metadata: null;
}

export const fetchCertificate = {
  // Lấy danh sách chứng chỉ của user hiện tại
  getMyCertificates: async (): Promise<MyCertificatesResponse> => {
    const response = await apiService.get<MyCertificatesResponse>(
      "api/v1/certificates/me"
    );
    return response.data;
  },

  // Lấy chi tiết chứng chỉ theo ID
  getCertificateById: async (id: string): Promise<CertificateDetailResponse> => {
    const response = await apiService.get<CertificateDetailResponse>(
      `api/v1/certificates/${id}`
    );
    return response.data;
  },

  // Xác thực chứng chỉ theo hash
  verifyCertificate: async (hash: string): Promise<CertificateVerificationResponse> => {
    const response = await apiService.get<CertificateVerificationResponse>(
      `api/v1/certificates/verify/${hash}`
    );
    return response.data;
  },
};
