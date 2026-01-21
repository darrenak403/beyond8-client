"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/useMobile";
import { useInstructorRegistration } from "@/hooks/useInstructorRegistration";
import Step1UploadDocuments from "./components/Step1UploadDocuments";
import Step2BasicInfo from "./components/Step2BasicInfo";
import Step3Education from "./components/Step3Education";
import Step4Certificates from "./components/Step4Certificates";
import Step5WorkExperience from "./components/Step4WorkExperience";
import Step6AdditionalInfo from "./components/Step5AdditionalInfo";
import Step7AIVerification from "./components/Step6AIVerification";
import { toast } from "sonner";

interface InstructorFormData {
  frontImg: string;
  backImg: string;
  frontFileId: string;
  backFileId: string;
  bio: string;
  headline: string;
  expertiseAreas: string[];
  education: Array<{
    school: string;
    degree: string;
    start: number;
    end: number;
  }>;
  certificates: Array<{
    name: string;
    url: string;
    issuer: string;
    year: number;
  }>;
  workExperience: Array<{
    company: string;
    role: string;
    from: string;
    to: string;
  }>;
  socialLinks: {
    facebook: string | null;
    linkedIn: string | null;
    website: string | null;
  };
  bankInfo: string;
  taxId: string | null;
}

const pageVariants = {
  initial: { opacity: 0, x: 50 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: -50 },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.4,
};

export default function InstructorRegistrationPage() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { registerAsync, isRegistering } = useInstructorRegistration();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<InstructorFormData>>({});

  const handleStep1Next = (data: { frontImg: string; backImg: string; frontFileId: string; backFileId: string }) => {
    setFormData(prev => ({ ...prev, ...data }));
    setCurrentStep(2);
  };

  const handleStep2Next = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
    setCurrentStep(3);
  };

  const handleStep3Next = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
    setCurrentStep(4);
  };

  const handleStep4Next = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
    setCurrentStep(5);
  };

  const handleStep5Next = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
    setCurrentStep(6);
  };

  const handleStep6Next = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
    setCurrentStep(7);
  };

  const handleSubmit = async () => {
    try {
      if (!formData.frontImg || !formData.backImg || !formData.bio || !formData.headline) {
        toast.error("Vui lòng điền đầy đủ thông tin");
        return;
      }

      await registerAsync({
        bio: formData.bio,
        headline: formData.headline,
        expertiseAreas: formData.expertiseAreas || [],
        education: formData.education || [],
        workExperience: formData.workExperience || [],
        socialLinks: formData.socialLinks || { facebook: null, linkedIn: null, website: null },
        bankInfo: formData.bankInfo || "",
        taxId: formData.taxId || null,
        identityDocuments: [
          {
            type: "CCCD",
            number: "", // TODO: Extract from OCR if available
            issuedDate: "", // TODO: Extract from OCR if available
            frontImg: formData.frontImg,
            backImg: formData.backImg,
          },
        ],
        certificates: formData.certificates || [],
      });

      // Redirect to success page or dashboard
      router.push("/mybeyond?tab=myprofile");
    } catch (error) {
      // Error handled by hook
      console.error("Registration error:", error);
    }
  };

  const steps = [
    { number: 1, title: "Giấy tờ" },
    { number: 2, title: "Thông tin" },
    { number: 3, title: "Học vấn" },
    { number: 4, title: "Chứng chỉ" },
    { number: 5, title: "Kinh nghiệm" },
    { number: 6, title: "Bổ sung" },
    { number: 7, title: "Xác minh" },
  ];

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className={`mx-auto ${isMobile ? 'max-w-full' : 'max-w-6xl'}`}>
        {/* Progress Steps */}
        <div className="mb-12">
          {isMobile ? (
            // Mobile: Vertical step indicator
            <div className="flex flex-col space-y-4">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <motion.div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                      currentStep >= step.number
                        ? "bg-purple-600 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                    animate={{
                      scale: currentStep === step.number ? [1, 1.1, 1] : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {step.number}
                  </motion.div>
                  <div className="flex-1 ml-3">
                    <span
                      className={`text-sm ${
                        currentStep >= step.number ? "text-purple-600 font-semibold" : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-1 h-8 ml-4 ${
                        currentStep > step.number ? "bg-purple-600" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            // Desktop: Horizontal step indicator
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}>
                  <div className="flex flex-col items-center">
                    <motion.div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                        currentStep >= step.number
                          ? "bg-purple-600 text-white"
                          : "bg-gray-300 text-gray-600"
                      }`}
                      animate={{
                        scale: currentStep === step.number ? [1, 1.1, 1] : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {step.number}
                    </motion.div>
                    <span
                      className={`text-xs mt-2 text-center whitespace-nowrap ${
                        currentStep >= step.number ? "text-purple-600 font-semibold" : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-1 flex-1 mx-2 ${
                        currentStep > step.number ? "bg-purple-600" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Step Content with Animation */}
        <div className={`overflow-hidden ${isMobile ? 'p-4' : 'p-8'}`}>
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Step1UploadDocuments
                  onNext={handleStep1Next}
                  initialData={{ 
                    frontImg: formData.frontImg || "", 
                    backImg: formData.backImg || "",
                    frontFileId: formData.frontFileId || "",
                    backFileId: formData.backFileId || "",
                  }}
                />
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Step2BasicInfo
                  onNext={handleStep2Next}
                  onBack={() => setCurrentStep(1)}
                  initialData={{
                    bio: formData.bio || "",
                    headline: formData.headline || "",
                    expertiseAreas: formData.expertiseAreas || [],
                  }}
                />
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Step3Education
                  onNext={handleStep3Next}
                  onBack={() => setCurrentStep(2)}
                  initialData={{ education: formData.education || [] }}
                />
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Step4Certificates
                  onNext={handleStep4Next}
                  onBack={() => setCurrentStep(3)}
                  initialData={{ certificates: formData.certificates || [] }}
                />
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Step5WorkExperience
                  onNext={handleStep5Next}
                  onBack={() => setCurrentStep(4)}
                  initialData={{ workExperience: formData.workExperience || [] }}
                />
              </motion.div>
            )}

            {currentStep === 6 && (
              <motion.div
                key="step6"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Step6AdditionalInfo
                  onNext={handleStep6Next}
                  onBack={() => setCurrentStep(5)}
                  initialData={{
                    socialLinks: formData.socialLinks || { facebook: null, linkedIn: null, website: null },
                    bankInfo: formData.bankInfo || "",
                    taxId: formData.taxId || null,
                  }}
                />
              </motion.div>
            )}

            {currentStep === 7 && (
              <motion.div
                key="step7"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Step7AIVerification
                  onSubmit={handleSubmit}
                  onBack={() => setCurrentStep(6)}
                  formData={formData}
                  isSubmitting={isRegistering}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
