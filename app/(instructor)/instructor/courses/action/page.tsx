"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
// import { v4 as uuidv4 } from 'uuid'; // Removed unused

import { useCreateCourse, useUpdateCourse } from "@/hooks/useCourse";
import { Course, CourseLevel } from "@/lib/api/services/fetchCourse";
import { formatImageUrl } from "@/lib/utils/formatImageUrl";

import ActionHeader from "./components/layout/ActionHeader";
import ActionSidebar from "./components/layout/ActionSidebar";
import TwoPanelLayout from "./components/layout/TwoPanelLayout";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UnsaveDialog } from "@/components/widget/UnsaveDialog";
import { useIsMobile } from "@/hooks/useMobile";

// Steps
import Step1_Title from "./components/steps/Step1_Title";
import Step2_Basics from "./components/steps/Step2_Basics";
import Step3_Goals from "./components/steps/Step3_Goals";
import Step4_MediaPricing from "./components/steps/Step4_MediaPricing";
import Step5_Documents from "./components/steps/Step5_Documents";
import Step6_Discount from "./components/steps/Step6_Discount";
import Step7_CertificateConfig from "./components/steps/Step7_CertificateConfig";
import ActionFooter from "./components/layout/ActionFooter";
import { CourseStatus } from "@/lib/api/services/fetchCourse";

// Since we moved `create` to `action`, the relative imports might need adjustment
// I am assuming the components inside `action/components` are still the original ones from `create/components`.

interface CourseActionProps {
  initialData?: Course;
  isEditMode?: boolean;
}

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: -20 },
};

const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.3,
};

// Rename prop to avoid confusion, or just use it for initial state
export function CourseAction({ initialData, isEditMode: initialIsEditMode = false }: CourseActionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const { createCourse, isPending } = useCreateCourse();
  const { updateCourse } = useUpdateCourse();
  const isMobile = useIsMobile();

  // Initialize isEdit state
  const [isEdit, setIsEdit] = useState(initialIsEditMode);

  const [currentStep, setCurrentStep] = useState(1);

  // Initialize viewMode from URL or default to "info"
  const [viewMode, setViewMode] = useState<"info" | "content">(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "content" && initialData?.id) {
      return "content";
    }
    return "info";
  });

  // Switch to step 1 when changing view mode
  const processViewModeChange = (mode: "info" | "content") => {
    setViewMode(mode);
    setCurrentStep(mode === "info" ? 1 : 6); // Reset step based on mode

    // Update URL without reloading
    const params = new URLSearchParams(searchParams);
    if (mode === "info") {
      params.delete("tab");
    } else {
      params.set("tab", "content");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleViewModeChange = (mode: "info" | "content") => {
    if (isDirty) {
      setPendingViewMode(mode);
      setShowUnsavedDialog(true);
    } else {
      processViewModeChange(mode);
    }
  };

  const handleConfirmSwitch = () => {
    if (pendingViewMode) {
      processViewModeChange(pendingViewMode);
      setPendingViewMode(null);
    }
    setShowUnsavedDialog(false);
  };

  // Helper to initialize form data
  const getInitialFormData = (data?: Course) => {
    if (data) {
      return {
        title: data.title || "",
        shortDescription: data.shortDescription || "",
        description: data.shortDescription || "", // Mapping issue: API result might not have full desc? check fetchCourse
        categoryId: data.categoryId || "",
        level: data.level || CourseLevel.Beginner,
        language: data.language || "Tiếng Việt",
        outcomes: data.outcomes && data.outcomes.length > 0 ? data.outcomes : [""],
        requirements: data.requirements && data.requirements.length > 0 ? data.requirements : [""],
        targetAudience: data.targetAudience && data.targetAudience.length > 0 ? data.targetAudience : [""],
        price: data.price || 0,
        thumbnailUrl: data.thumbnailUrl || "",
      };
    }
    return {
      title: "",
      shortDescription: "",
      description: "",
      categoryId: "",
      level: CourseLevel.Beginner,
      language: "Tiếng Việt",
      outcomes: [""],
      requirements: [""],
      targetAudience: [""],
      price: 0,
      thumbnailUrl: "",
    };
  };

  const [formData, setFormData] = useState(() => getInitialFormData(initialData));
  const [savedData, setSavedData] = useState(() => getInitialFormData(initialData));

  // Unsaved changes detection
  const isDirty = JSON.stringify(formData) !== JSON.stringify(savedData);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [pendingViewMode, setPendingViewMode] = useState<"info" | "content" | null>(null);

  // New state to track created course ID
  const [createdCourseId, setCreatedCourseId] = useState<string | null>(null);

  // Validation Logic (Same as before)
  const isInfoValid = formData.title.length >= 5 && formData.shortDescription.length >= 10;
  const isBasicsValid = !!(formData.categoryId && formData.level && formData.language);
  const isGoalsValid = !!(
    formData.outcomes.some((i) => i.trim() !== "") &&
    formData.requirements.some((i) => i.trim() !== "") &&
    formData.targetAudience.some((i) => i.trim() !== "")
  );
  const isMediaValid = formData.price >= 0 && !!formData.thumbnailUrl;

  const sidebarValidity = [isInfoValid, isBasicsValid, isGoalsValid, isMediaValid, true, true, true];

  const handleSave = async () => {

    if (!isEdit) {
      // Create
      const response = await createCourse({
        ...formData,
        outcomes: formData.outcomes.filter((i) => i.trim() !== ""),
        requirements: formData.requirements.filter((i) => i.trim() !== ""),
        targetAudience: formData.targetAudience.filter((i) => i.trim() !== ""),
        thumbnailUrl: formatImageUrl(formData.thumbnailUrl) || "",
      }); // Note: description missing from formData initial state type but used in submit?
      // Fixed formData to match CourseRequest in hook
      if (response.isSuccess && response.data) {
        let newCourseId = "";
        if (Array.isArray(response.data)) {
          newCourseId = response.data[0]?.id;
        } else {
          // Fallback if data is a single object
          newCourseId = (response.data as Course)?.id;
        }
        if (newCourseId) {
          // Success! Set the ID but DO NOT redirect yet.
          setCreatedCourseId(newCourseId);
          // Update saved data to prevent "Unsaved changes" warning
          setSavedData(formData);
          setIsEdit(true);
        }
      }
    } else {
      await updateCourse({
        id: initialData?.id || createdCourseId!,
        courseData: {
          ...formData,
          level: formData.level as CourseLevel,
          outcomes: formData.outcomes.filter((i) => i.trim() !== ""),
          requirements: formData.requirements.filter((i) => i.trim() !== ""),
          targetAudience: formData.targetAudience.filter((i) => i.trim() !== ""),
          thumbnailUrl: formatImageUrl(formData.thumbnailUrl) || "",
        },
      });
      // Update saved data to match current form data
      setSavedData(formData);
      // Do not redirect on update, just stay
    }
  };

  const handleBack = () => {
    if (currentStep === 4) {
      setCurrentStep(3);
    } else {
      setCurrentStep((prev) => Math.max(1, prev - 1));
    }
  };

  const handleNext = () => {
    // Logic for redirecting immediately after creation removed to allow editing flow
    // if (createdCourseId) {
    //   router.push(`/instructor/courses/action/${createdCourseId}?tab=content`);
    //   return;
    // }

    if (currentStep === 3) {
      setCurrentStep(4);
    } else if (currentStep === 4) {
      if (isEdit) {
        setCurrentStep(5);
      } else {
        // Last step: Create course
        handleSave();
      }
    } else if (currentStep === 5) {
      handleViewModeChange("content");
    } else {
      setCurrentStep((prev) => Math.min(5, prev + 1));
    }
  };

  const isCurrentStepValid = () => {
    // Indices are 0-based. Step 1 is index 0.
    // sidebarValidity = [isInfoValid, isBasicsValid, isGoalsValid, isMediaValid, true]
    return sidebarValidity[currentStep - 1];
  };

  const handleSaveAndSwitch = async () => {
    await handleSave();
    handleConfirmSwitch();
  };

  return (
    <>
      {viewMode === "content" && (initialData?.id || createdCourseId) ? (
        // Two-panel layout for content mode
        <TwoPanelLayout
          courseId={initialData?.id || createdCourseId!}
          onBackToInfo={() => handleViewModeChange("info")}
        />
      ) : (
        // Original layout for info mode
        <div className="flex h-screen w-full bg-purple-100 overflow-hidden font-sans">
          {/* Sidebar */}
          {!isMobile && (
            <ActionSidebar
              currentStep={currentStep}
              onStepClick={setCurrentStep}
              stepsValidity={sidebarValidity}
              isEditMode={isEdit}
              viewMode={viewMode}
              courseStatus={initialData?.status}
            />
          )}

          {/* Main Content */}
          <div
            className={`flex-1 flex flex-col bg-white relative transition-all duration-300 ${!isMobile ? "h-[calc(100vh-24px)] rounded-[30px] m-3 shadow-sm border border-purple-100 overflow-hidden" : "h-full"}`}
          >
            <ActionHeader
              currentStep={currentStep}
              totalSteps={5}
              onSave={handleSave}
              isSubmitting={isPending}
              isEditMode={isEdit}
              viewMode={viewMode}
              onChangeViewMode={handleViewModeChange}
              disableContent={!isEdit && !initialData?.id} // Only enable content if edit mode or ID exists
              isDirty={isDirty}
            />

            <ScrollArea className="flex-1" type="scroll">
              <div className="min-h-full w-full flex flex-col px-6 md:px-12 py-4">
                <div className="flex-1 w-full max-w-4xl mx-auto flex flex-col justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                      className="w-full flex-1 flex flex-col"
                    >
                      {viewMode === "info" && (
                        <>
                          {currentStep === 1 && (
                            <Step1_Title
                              data={formData}
                              onChange={(data) => setFormData((prev) => ({ ...prev, ...data }))}
                              isEditMode={isEdit}
                            />
                          )}
                          {currentStep === 2 && (
                            <Step2_Basics
                              data={formData}
                              onChange={(data) => setFormData((prev) => ({ ...prev, ...data }))}
                            />
                          )}
                          {currentStep === 3 && (
                            <Step3_Goals
                              data={formData}
                              onChange={(data) => setFormData((prev) => ({ ...prev, ...data }))}
                            />
                          )}
                          {/* Note: Step 4 is now in Content mode DOES NOT APPLY ANYMORE */}
                          {currentStep === 4 && (
                            <Step4_MediaPricing
                              data={formData}
                              onChange={(data) => setFormData((prev) => ({ ...prev, ...data }))}
                            />
                          )}
                          {currentStep === 5 && (initialData?.id || createdCourseId) && (
                            <Step5_Documents courseId={initialData?.id || createdCourseId!} />
                          )}
                          {currentStep === 7 && (initialData?.id || createdCourseId) && initialData?.status === CourseStatus.Published && (
                            <Step7_CertificateConfig courseId={initialData?.id || createdCourseId!} />
                          )}
                          {currentStep === 6 && (initialData?.id || createdCourseId) && initialData?.status === CourseStatus.Published && (
                            <Step6_Discount
                              courseId={initialData?.id || createdCourseId!}
                              initialData={{
                                discountPercent: initialData?.discountPercent || null,
                                discountAmount: initialData?.discountAmount || null,
                                discountEndsAt: initialData?.discountEndsAt || null,
                              }}
                            />
                          )}
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </ScrollArea>

            {viewMode === "info" && (
              <ActionFooter
                onBack={handleBack}
                onNext={handleNext}
                isFirstStep={currentStep === 1}
                isLastStep={
                  isEdit
                    ? (initialData?.status === CourseStatus.Published ? currentStep === 6 : currentStep === 7)
                    : currentStep === 4
                }
                isValid={isCurrentStepValid()}
                isSubmitting={isPending}
                nextLabel={
                  (isEdit && currentStep === 7)
                    ? "Soạn nội dung khóa học"
                    : (isEdit && currentStep === 6 && initialData?.status === CourseStatus.Published)
                      ? "Soạn nội dung khóa học"
                      : undefined
                }
              />
            )}

            <UnsaveDialog
              open={showUnsavedDialog}
              onOpenChange={setShowUnsavedDialog}
              onDiscard={handleConfirmSwitch}
              onSave={handleSaveAndSwitch}
              onCancel={() => setShowUnsavedDialog(false)}
              title="Chưa lưu thay đổi"
              description="Những thay đổi chưa lưu sẽ bị mất nếu bạn chuyển tab. Bạn có muốn tiếp tục không?"
            />
          </div>
        </div>
      )}
    </>
  );
}

export default function CreateCoursePage() {
  return <CourseAction isEditMode={false} />;
}
