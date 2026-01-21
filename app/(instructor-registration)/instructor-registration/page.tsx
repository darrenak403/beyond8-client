"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/useMobile";
import { useInstructorRegistration } from "@/hooks/useInstructorRegistration";
import InstructorRegisHeader from "./components/InstructorRegisHeader";
import InstructorRegisFooter from "./components/InstructorRegisFooter";
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
  frontClassifyResult?: { type: number; name: string };
  backClassifyResult?: { type: number; name: string };
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
  const [reviewResult, setReviewResult] = useState<{ isAccepted: boolean } | null>(null);
  
  // Form data state
  const [formData, setFormData] = useState<InstructorFormData>({
    frontImg: "",
    backImg: "",
    frontFileId: "",
    backFileId: "",
    bio: "",
    headline: "",
    expertiseAreas: [],
    education: [{ school: "", degree: "", start: new Date().getFullYear(), end: new Date().getFullYear() }],
    certificates: [{ name: "", url: "", issuer: "", year: new Date().getFullYear() }],
    workExperience: [{ company: "", role: "", from: "", to: "" }],
    socialLinks: { facebook: null, linkedIn: null, website: null },
    bankInfo: "",
    taxId: null,
  });

  const handleSubmit = async () => {
    if (!formData.frontImg || !formData.backImg || !formData.bio || !formData.headline) {
      return;
    }

    await registerAsync({
      bio: formData.bio,
      headline: formData.headline,
      expertiseAreas: formData.expertiseAreas,
      education: formData.education,
      workExperience: formData.workExperience,
      socialLinks: formData.socialLinks,
      bankInfo: formData.bankInfo,
      taxId: formData.taxId,
      identityDocuments: [
        {
          frontImg: formData.frontImg,
          backImg: formData.backImg,
        },
      ],
      certificates: formData.certificates,
    });

    router.push("/mybeyond?tab=myprofile");
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

  // Validation for each step
  const canProceedStep1 = formData.frontImg && formData.backImg && formData.frontFileId && formData.backFileId;
  const canProceedStep2 = formData.bio && formData.headline && formData.expertiseAreas.length > 0;
  const canProceedStep3 = formData.education.length > 0 && formData.education.every(e => e.school && e.degree);
  const canProceedStep4 = formData.certificates.length > 0 && formData.certificates.every(c => c.name && c.url && c.issuer);
  const canProceedStep5 = formData.workExperience.length > 0 && formData.workExperience.every(w => w.company && w.role && w.from && w.to);
  const canProceedStep6 = formData.bankInfo;
  const canProceedStep7 = reviewResult?.isAccepted === true;

  const getCanProceed = () => {
    switch (currentStep) {
      case 1: return canProceedStep1;
      case 2: return canProceedStep2;
      case 3: return canProceedStep3;
      case 4: return canProceedStep4;
      case 5: return canProceedStep5;
      case 6: return canProceedStep6;
      case 7: return canProceedStep7;
      default: return false;
    }
  };

  const handleFooterNext = () => {
    if (currentStep === 7) {
      handleSubmit();
    } else {
      if (!getCanProceed()) {
        toast.error("Vui lòng điền đầy đủ thông tin");
        return;
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const getNextButtonLabel = () => {
    if (currentStep === 7) return "Nộp hồ sơ";
    return "Tiếp theo";
  };

  return (
    <>
      <InstructorRegisHeader />
      
      <main className="flex-1 overflow-y-auto">
        <div className={`container mx-auto ${isMobile ? 'px-4 py-6' : 'px-8 py-12'}`}>
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
                  data={{
                    frontImg: formData.frontImg,
                    backImg: formData.backImg,
                    frontFileId: formData.frontFileId,
                    backFileId: formData.backFileId,
                    frontClassifyResult: formData.frontClassifyResult,
                    backClassifyResult: formData.backClassifyResult,
                  }}
                  onChange={(data) => {
                    console.log('Page - Step1 onChange received:', data);
                    const newFormData = { ...formData, ...data };
                    console.log('Page - Updated formData:', newFormData);
                    setFormData(newFormData);
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
                  data={{
                    bio: formData.bio,
                    headline: formData.headline,
                    expertiseAreas: formData.expertiseAreas,
                  }}
                  onChange={(data) => setFormData({ ...formData, ...data })}
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
                  data={{ education: formData.education }}
                  onChange={(data) => setFormData({ ...formData, ...data })}
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
                  data={{ certificates: formData.certificates }}
                  onChange={(data) => setFormData({ ...formData, ...data })}
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
                  data={{ workExperience: formData.workExperience }}
                  onChange={(data) => setFormData({ ...formData, ...data })}
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
                  data={{
                    socialLinks: formData.socialLinks,
                    bankInfo: formData.bankInfo,
                    taxId: formData.taxId,
                  }}
                  onChange={(data) => setFormData({ ...formData, ...data })}
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
                  formData={{
                    bio: formData.bio,
                    headline: formData.headline,
                    expertiseAreas: formData.expertiseAreas,
                    education: formData.education,
                    workExperience: formData.workExperience,
                    socialLinks: formData.socialLinks,
                    bankInfo: formData.bankInfo,
                    taxId: formData.taxId,
                    identityDocuments: [
                      {
                        frontImg: formData.frontImg,
                        backImg: formData.backImg,
                      },
                    ],
                    certificates: formData.certificates,
                  }}
                  isSubmitting={isRegistering}
                  onReviewComplete={(result) => setReviewResult(result)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <InstructorRegisFooter
        currentStep={currentStep}
        totalSteps={steps.length}
        onBack={currentStep > 1 ? () => setCurrentStep(currentStep - 1) : undefined}
        onNext={handleFooterNext}
        nextLabel={getNextButtonLabel()}
        nextDisabled={!getCanProceed() || (currentStep === 7 && isRegistering)}
        showBack={currentStep > 1}
        isLastStep={currentStep === 7}
      />
    </>
  );
}
