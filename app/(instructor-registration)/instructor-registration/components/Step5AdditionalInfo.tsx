"use client";

import { useIsMobile } from "@/hooks/useMobile";
import { CreditCard, Hash, Facebook, Linkedin, Globe } from "lucide-react";

interface AdditionalInfoData {
  socialLinks: {
    facebook: string | null;
    linkedIn: string | null;
    website: string | null;
  };
  bankInfo: string;
  taxId: string | null;
}

interface Step6Props {
  data: AdditionalInfoData;
  onChange: (data: AdditionalInfoData) => void;
}

export default function Step6AdditionalInfo({ data, onChange }: Step6Props) {
  const isMobile = useIsMobile();

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-2">
        <h2 className={`font-bold ${isMobile ? 'text-2xl' : 'text-3xl'}`}>Thông tin bổ sung</h2>
        <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>Thông tin thanh toán và mạng xã hội</p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className={`font-semibold mb-4 ${isMobile ? 'text-base' : 'text-lg'}`}>Thông tin thanh toán</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className={`font-medium flex items-center gap-2 ${isMobile ? 'text-sm' : ''}`}>
                <CreditCard className="w-4 h-4 text-purple-600" />
                Thông tin ngân hàng
              </label>
              <div className="relative">
                <input
                  type="text"
                  className={`w-full pl-10 pr-3 border rounded-md ${isMobile ? 'py-2 text-sm' : 'py-2'}`}
                  placeholder="VD: Vietcombank - 1234567890 - Nguyễn Văn A"
                  value={data.bankInfo}
                  onChange={(e) => onChange({ ...data, bankInfo: e.target.value })}
                />
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label className={`font-medium flex items-center gap-2 ${isMobile ? 'text-sm' : ''}`}>
                <Hash className="w-4 h-4 text-purple-600" />
                Mã số thuế
              </label>
              <div className="relative">
                <input
                  type="text"
                  className={`w-full pl-10 pr-3 border rounded-md ${isMobile ? 'py-2 text-sm' : 'py-2'}`}
                  placeholder="VD: 0123456789"
                  value={data.taxId || ""}
                  onChange={(e) => onChange({ ...data, taxId: e.target.value || null })}
                />
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className={`font-semibold mb-4 ${isMobile ? 'text-base' : 'text-lg'}`}>Liên kết mạng xã hội</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className={`font-medium flex items-center gap-2 ${isMobile ? 'text-sm' : ''}`}>
                <Facebook className="w-4 h-4 text-purple-600" />
                Facebook
              </label>
              <div className="relative">
                <input
                  type="url"
                  className={`w-full pl-10 pr-3 border rounded-md ${isMobile ? 'py-2 text-sm' : 'py-2'}`}
                  placeholder="https://facebook.com/yourprofile"
                  value={data.socialLinks.facebook || ""}
                  onChange={(e) => onChange({ 
                    ...data, 
                    socialLinks: { ...data.socialLinks, facebook: e.target.value || null }
                  })}
                />
                <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label className={`font-medium flex items-center gap-2 ${isMobile ? 'text-sm' : ''}`}>
                <Linkedin className="w-4 h-4 text-purple-600" />
                LinkedIn
              </label>
              <div className="relative">
                <input
                  type="url"
                  className={`w-full pl-10 pr-3 border rounded-md ${isMobile ? 'py-2 text-sm' : 'py-2'}`}
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={data.socialLinks.linkedIn || ""}
                  onChange={(e) => onChange({ 
                    ...data, 
                    socialLinks: { ...data.socialLinks, linkedIn: e.target.value || null }
                  })}
                />
                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label className={`font-medium flex items-center gap-2 ${isMobile ? 'text-sm' : ''}`}>
                <Globe className="w-4 h-4 text-purple-600" />
                Website cá nhân
              </label>
              <div className="relative">
                <input
                  type="url"
                  className={`w-full pl-10 pr-3 border rounded-md ${isMobile ? 'py-2 text-sm' : 'py-2'}`}
                  placeholder="https://yourwebsite.com"
                  value={data.socialLinks.website || ""}
                  onChange={(e) => onChange({ 
                    ...data, 
                    socialLinks: { ...data.socialLinks, website: e.target.value || null }
                  })}
                />
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
