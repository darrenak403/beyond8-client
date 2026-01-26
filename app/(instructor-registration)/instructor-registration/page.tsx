"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/useMobile";
import { useInstructorRegistration, useCheckAIHealth } from "@/hooks/useInstructorRegistration";
import InstructorRegisHeader from "./components/InstructorRegisHeader";
import InstructorRegisFooter from "./components/InstructorRegisFooter";
import InstructorRegisSidebar from "./components/InstructorRegisSidebar";
import Step1UploadDocuments from "./components/Step1UploadDocuments";
import Step2BasicInfo from "./components/Step2BasicInfo";
import Step3Education from "./components/Step3Education";
import Step4Certificates from "./components/Step4Certificates";
import Step5WorkExperience from "./components/Step4WorkExperience";
import Step6AdditionalInfo from "./components/Step5AdditionalInfo";
import { toast } from "sonner";
import Step6AIVerification from "./components/Step6AIVerification";
import { formatImageUrl } from "@/lib/utils/formatImageUrl";
import { toISOFromDDMMYYYY } from "@/lib/utils/formatDate";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { X, Loader2, AlertCircle } from "lucide-react";

interface InstructorFormData {
  frontImg: string;
  backImg: string;
  frontFileId: string;
  backFileId: string;
  frontClassifyResult?: {
    type_name: string;
    card_name: string;
    id_number: string | null;
    issue_date: string | null;
  };
  backClassifyResult?: {
    type_name: string;
    card_name: string;
    id_number: string | null;
    issue_date: string | null;
  };
  bio: string;
  headline: string;
  expertiseAreas: string[];
  education: Array<{
    school: string;
    degree: string;
    fieldOfStudy: string;
    start: number;
    end: number;
  }>;
  certificates: Array<{
    name: string;
    imageUrl: string;
    issuer: string;
    year: number;
  }>;
  workExperience: Array<{
    company: string;
    role: string;
    from: string;
    to: string | null;
    isCurrentJob: boolean;
    description: string | null;
  }>;
  socialLinks: {
    facebook: string | null;
    linkedIn: string | null;
    website: string | null;
  };
  bankInfo: {
    bankName: string;
    accountNumber: string;
    accountHolderName: string;
  };
  taxId: string | null;
  teachingLanguages: string[];
  introVideoUrl: string | null;
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
  const { isAIAvailable, isLoading: isCheckingAI } = useCheckAIHealth();
  const [currentStep, setCurrentStep] = useState(1);
  const [reviewResult, setReviewResult] = useState<{ isAccepted: boolean } | null>(null);
  const [showAIDialog, setShowAIDialog] = useState(false);

  // Form data state
  const [formData, setFormData] = useState<InstructorFormData>({
    frontImg: "",
    backImg: "",
    frontFileId: "",
    backFileId: "",
    bio: "",
    headline: "",
    expertiseAreas: [],
    education: [
      {
        school: "",
        degree: "",
        fieldOfStudy: "",
        start: new Date().getFullYear(),
        end: new Date().getFullYear(),
      },
    ],
    certificates: [{ name: "", imageUrl: "", issuer: "", year: new Date().getFullYear() }],
    workExperience: [
      { company: "", role: "", from: "", to: "", isCurrentJob: false, description: null },
    ],
    socialLinks: { facebook: null, linkedIn: null, website: null },
    bankInfo: { bankName: "", accountNumber: "", accountHolderName: "" },
    taxId: null,
    teachingLanguages: [],
    introVideoUrl: null,
  });

  const handleSubmit = async () => {
    if (!formData.frontImg || !formData.backImg || !formData.bio || !formData.headline) {
      return;
    }

    if (!formData.frontClassifyResult || !formData.backClassifyResult) {
      toast.error("Vui lòng đợi hệ thống xử lý ảnh CCCD");
      return;
    }

    // issuerDate có thể nằm ở mặt sau (issue_date) theo response VNPT
    const issuerDate =
      toISOFromDDMMYYYY(formData.frontClassifyResult.issue_date) ??
      toISOFromDDMMYYYY(formData.backClassifyResult.issue_date);

    await registerAsync({
      bio: formData.bio,
      headline: formData.headline,
      expertiseAreas: formData.expertiseAreas,
      education: formData.education,
      workExperience: formData.workExperience,
      socialLinks: formData.socialLinks,
      bankInfo: formData.bankInfo,
      taxId: formData.taxId,
      teachingLanguages: formData.teachingLanguages,
      introVideoUrl: formData.introVideoUrl,
      identityDocuments: [
        {
          type: formData.frontClassifyResult.card_name || "",
          number: formData.frontClassifyResult.id_number || "",
          issuerDate,
          frontImg: formatImageUrl(formData.frontImg) || formData.frontImg,
          backImg: formatImageUrl(formData.backImg) || formData.backImg,
        },
      ],
      certificates: formData.certificates.map((cert) => ({
        name: cert.name,
        url: formatImageUrl(cert.imageUrl) || cert.imageUrl,
        issuer: cert.issuer,
        year: cert.year,
      })),
    });
    router.push("/mybeyond?tab=myprofile");
  };

  // Validation for each step
  const canProceedStep1 = !!(
    formData.frontImg &&
    formData.backImg &&
    formData.frontFileId &&
    formData.backFileId
  );
  const canProceedStep2 = !!(
    formData.bio &&
    formData.headline &&
    formData.expertiseAreas.length > 0
  );
  const canProceedStep3 = !!(
    formData.education.length > 0 &&
    formData.education.every((e) => e.school && e.degree && e.fieldOfStudy)
  );
  const canProceedStep4 = !!(
    formData.certificates.length > 0 &&
    formData.certificates.every((c) => c.name && c.imageUrl && c.issuer)
  );
  const canProceedStep5 = !!(
    formData.workExperience.length > 0 &&
    formData.workExperience.every((w) => w.company && w.role && w.from && (w.isCurrentJob || w.to))
  );
  const canProceedStep6 = !!(
    formData.bankInfo.bankName &&
    formData.bankInfo.accountNumber &&
    formData.bankInfo.accountHolderName
  );
  const canProceedStep7 = reviewResult?.isAccepted === true;

  const getCanProceed = () => {
    switch (currentStep) {
      case 1:
        return canProceedStep1;
      case 2:
        return canProceedStep2;
      case 3:
        return canProceedStep3;
      case 4:
        return canProceedStep4;
      case 5:
        return canProceedStep5;
      case 6:
        return canProceedStep6;
      case 7:
        return canProceedStep7;
      default:
        return false;
    }
  };

  const handleFooterNext = () => {
    // Console log để kiểm tra validation và formData
    console.log("=== Step Validation Debug ===");
    console.log("Current Step:", currentStep);
    console.log("Can Proceed:", getCanProceed());
    console.log("\n--- Form Data Summary ---");
    console.log("Step 1 (Documents):", {
      frontImg: !!formData.frontImg,
      backImg: !!formData.backImg,
      frontFileId: !!formData.frontFileId,
      backFileId: !!formData.backFileId,
      frontClassifyResult: !!formData.frontClassifyResult,
      backClassifyResult: !!formData.backClassifyResult,
    });
    console.log("Step 2 (Basic Info):", {
      bio: !!formData.bio,
      headline: !!formData.headline,
      expertiseAreas: formData.expertiseAreas.length,
    });
    console.log("Step 3 (Education):", {
      count: formData.education.length,
      valid: formData.education.every((e) => e.school && e.degree && e.fieldOfStudy),
      data: formData.education,
    });
    console.log("Step 4 (Certificates):", {
      count: formData.certificates.length,
      valid: formData.certificates.every((c) => c.name && c.imageUrl && c.issuer),
      data: formData.certificates,
      introVideoUrl: formData.introVideoUrl || "null",
    });
    console.log("Step 5 (Work Experience):", {
      count: formData.workExperience.length,
      valid: formData.workExperience.every((w) => w.company && w.role && w.from && (w.isCurrentJob || w.to)),
      data: formData.workExperience,
    });
    console.log("Step 6 (Additional Info):", {
      bankInfo: formData.bankInfo,
      taxId: formData.taxId || "null",
      teachingLanguages: formData.teachingLanguages,
      socialLinks: formData.socialLinks,
    });
    console.log("=== End Debug ===\n");

    if (currentStep === 7) {
      handleSubmit();
    } else if (currentStep === 6) {
      if (!getCanProceed()) {
        toast.error("Vui lòng điền đầy đủ thông tin");
        return;
      }
      setShowAIDialog(true);
    } else {
      if (!getCanProceed()) {
        toast.error("Vui lòng điền đầy đủ thông tin");
        return;
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handleUseAI = () => {
    setShowAIDialog(false);
    setCurrentStep(7);
  };

  const handleSkipAI = async () => {
    setShowAIDialog(false);
    await handleSubmit();
  };

  const getNextButtonLabel = () => {
    if (currentStep === 7) return "Nộp hồ sơ";
    return "Tiếp theo";
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <InstructorRegisHeader />

      <main className="flex-1 min-h-0">
        <div className="flex flex-row px-4 md:px-6 lg:px-8 py-6 md:py-10 h-full">
          {/* Sidebar Navigation - Desktop Only */}
          {!isMobile && (
            <InstructorRegisSidebar
              currentStep={currentStep}
              onStepClick={setCurrentStep}
              canProceedStep1={canProceedStep1}
              canProceedStep2={canProceedStep2}
              canProceedStep3={canProceedStep3}
              canProceedStep4={canProceedStep4}
              canProceedStep5={canProceedStep5}
              canProceedStep6={canProceedStep6}
            />
          )}

          {/* Main Content */}
          <div className={`flex-1 ${isMobile ? "" : ""} min-h-0 overflow-hidden`}>
            <div className="max-w-5xl mx-auto px-4 h-full">
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
                        if (data.frontClassifyResult) {
                          console.log(
                            "Page - frontClassifyResult.id_number:",
                            data.frontClassifyResult.id_number
                          );
                        }
                        const newFormData = { ...formData, ...data };
                        console.log("Page - Updated formData:", newFormData);
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
                    className="h-full"
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
                    className="h-full"
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
                    className="h-full"
                  >
                    <Step4Certificates
                      data={{
                        certificates: formData.certificates,
                        introVideoUrl: formData.introVideoUrl,
                      }}
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
                    className="h-full"
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
                    className="h-full"
                  >
                    <Step6AdditionalInfo
                      data={{
                        socialLinks: formData.socialLinks,
                        bankInfo: formData.bankInfo,
                        taxId: formData.taxId,
                        teachingLanguages: formData.teachingLanguages,
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
                    className="h-full"
                  >
                    <Step6AIVerification
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
                        teachingLanguages: formData.teachingLanguages,
                        introVideoUrl: formData.introVideoUrl,
                        identityDocuments: [
                          {
                            type: formData.frontClassifyResult?.card_name || "",
                            number: formData.frontClassifyResult?.id_number || "",
                            issuerDate: formData.frontClassifyResult?.issue_date || "",
                            frontImg: formData.frontImg,
                            backImg: formData.backImg,
                          },
                        ],
                        certificates: formData.certificates.map((cert) => ({
                          name: cert.name,
                          url: formatImageUrl(cert.imageUrl) || cert.imageUrl,
                          issuer: cert.issuer,
                          year: cert.year,
                        })),
                      }}
                      isSubmitting={isRegistering}
                      onReviewComplete={(result) => setReviewResult(result)}
                      onNavigateToStep={(step) => setCurrentStep(step)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      <InstructorRegisFooter
        currentStep={currentStep}
        totalSteps={7}
        onBack={currentStep > 1 ? () => setCurrentStep(currentStep - 1) : undefined}
        onNext={handleFooterNext}
        nextLabel={getNextButtonLabel()}
        nextDisabled={!getCanProceed() || (currentStep === 7 && isRegistering)}
        showBack={currentStep > 1}
        isLastStep={currentStep === 7}
      />

      {/* AI Review Dialog */}
      <AlertDialog open={showAIDialog} onOpenChange={setShowAIDialog}>
        <AlertDialogContent className="w-[95%] sm:w-full rounded-lg">
          <button
            onClick={() => setShowAIDialog(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none z-10"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Đóng</span>
          </button>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác thực hồ sơ bằng AI</AlertDialogTitle>
            <AlertDialogDescription className="border rounded-md bg-gray-100 p-3">
              {isCheckingAI ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang kiểm tra dịch vụ AI...</span>
                </div>
              ) : isAIAvailable ? (
                "Sử dụng AI để có thể dễ dàng kiểm tra tính hợp lệ của hồ sơ. Bạn có muốn sử dụng AI review không?"
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-yellow-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="font-semibold">Dịch vụ AI hiện không khả dụng</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Bạn có thể nộp hồ sơ trực tiếp mà không cần xác thực AI. Hồ sơ của bạn sẽ được xem xét bởi đội ngũ quản trị.
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleSkipAI}>
              Nộp hồ sơ ngay
            </AlertDialogCancel>
            {isAIAvailable && !isCheckingAI && (
              <AlertDialogAction onClick={handleUseAI}>
                Review cùng AI
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
