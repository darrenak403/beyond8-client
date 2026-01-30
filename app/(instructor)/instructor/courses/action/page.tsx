'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
// import { v4 as uuidv4 } from 'uuid'; // Removed unused

import { useCreateCourse } from '@/hooks/useCourse'
import { Course } from '@/lib/api/services/fetchCourse'
import { formatImageUrl } from '@/lib/utils/formatImageUrl'

import ActionHeader from './components/layout/ActionHeader'
import ActionSidebar from './components/layout/ActionSidebar'
import SectionList from './components/content/SectionList'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useIsMobile } from '@/hooks/useMobile'

// Steps
import Step1_Title from './components/steps/Step1_Title'
import Step2_Basics from './components/steps/Step2_Basics'
import Step3_Goals from './components/steps/Step3_Goals'
import Step5_MediaPricing from './components/steps/Step5_MediaPricing'
import ActionFooter from './components/layout/ActionFooter'

// Since we moved `create` to `action`, the relative imports might need adjustment
// I am assuming the components inside `action/components` are still the original ones from `create/components`.

interface CourseActionProps {
    initialData?: Course
    isEditMode?: boolean
}

const pageVariants = {
    initial: { opacity: 0, x: 20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -20 },
}

const pageTransition = {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.3,
}

export function CourseAction({ initialData, isEditMode = false }: CourseActionProps) {
    const router = useRouter()
    const { createCourse, isPending } = useCreateCourse()
    const isMobile = useIsMobile()

    const [currentStep, setCurrentStep] = useState(1)
    const [viewMode, setViewMode] = useState<'info' | 'content'>('info')

    // Switch to step 1 when changing view mode
    const handleViewModeChange = (mode: 'info' | 'content') => {
        setViewMode(mode)
        setCurrentStep(mode === 'info' ? 1 : 4) // Reset step based on mode
    }

    const [formData, setFormData] = useState({
        title: '',
        shortDescription: '',
        description: '',
        categoryId: '',
        level: '',
        language: 'Tiếng Việt',
        outcomes: [''],
        requirements: [''],
        targetAudience: [''],
        price: 0,
        thumbnailUrl: '',
    })

    // Populate data if in edit mode
    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                shortDescription: initialData.shortDescription || '',
                description: initialData.shortDescription || '', // Mapping issue: API result might not have full desc? check fetchCourse
                categoryId: initialData.categoryId || '',
                level: initialData.level || '',
                language: initialData.language || 'Tiếng Việt',
                outcomes: [''], // API needs to return these details if we want to edit them. Assuming separate fetch or part of details
                requirements: [''],
                targetAudience: [''],
                price: initialData.price || 0,
                thumbnailUrl: initialData.thumbnailUrl || '',
            })
            // Optimization: Fetch details if the list endpoint doesn't return everything
        }
    }, [initialData])


    // Validation Logic (Same as before)
    const isInfoValid = formData.title.length >= 5 && formData.shortDescription.length >= 10
    const isBasicsValid = !!(formData.categoryId && formData.level && formData.language)
    const isGoalsValid = !!(
        formData.outcomes.some(i => i.trim() !== '') &&
        formData.requirements.some(i => i.trim() !== '') &&
        formData.targetAudience.some(i => i.trim() !== '')
    )
    const isMediaValid = formData.price >= 0 && !!formData.thumbnailUrl

    // In edit mode, sections are valid (handled separately)
    // In create mode, we might skip sections or require saving first.
    // Let's assume Step 4 (Curriculum) is only accessible in Edit Mode or matches the "Create" flow where it's a step.
    // But implementation plan said "Section Management will be integrated".
    // If Creating: Step 4 is disabled or just a "Save to continue" placeholder?
    // Let's allow step 4 only if we have an ID (Edit Mode).
    // Or if creating, saving at step 3 creates the course, then we move to step 4.

    const sidebarValidity = [isInfoValid, isBasicsValid, isGoalsValid, true, isMediaValid] // Step 4 (Curriculum) is always valid/accessible if unlocked


    // ... (imports remain the same)

    const handleSave = async () => {
        // Logic to Update if Edit Mode, or Create if Create Mode
        // For now, let's keep the Create logic separate
        if (!isEditMode) {
            // Create
            try {
                const response = await createCourse({
                    ...formData,
                    outcomes: formData.outcomes.filter(i => i.trim() !== ''),
                    requirements: formData.requirements.filter(i => i.trim() !== ''),
                    targetAudience: formData.targetAudience.filter(i => i.trim() !== ''),
                    thumbnailUrl: formatImageUrl(formData.thumbnailUrl) || '',
                }) // Note: description missing from formData initial state type but used in submit?
                // Fixed formData to match CourseRequest in hook
                if (response.isSuccess && response.data) {
                    const newCourseId = response.data[0]?.id
                    if (newCourseId) {
                        router.push(`/instructor/courses/action/${newCourseId}`)
                    }
                }
            } catch (error) {
                console.error(error)
            }
        } else {
            toast.info("Update logic not yet implemented")
        }
    }

    const handleBack = () => {
        if (currentStep === 5) {
            setCurrentStep(3)
        } else {
            setCurrentStep(prev => Math.max(1, prev - 1))
        }
    }

    const handleNext = () => {
        if (currentStep === 3) {
            setCurrentStep(5)
        } else {
            setCurrentStep(prev => Math.min(5, prev + 1))
        }
    }

    const isCurrentStepValid = () => {
        // Indices are 0-based. Step 1 is index 0.
        // sidebarValidity = [isInfoValid, isBasicsValid, isGoalsValid, true, isMediaValid]
        // Step 1 (index 0), Step 2 (index 1), Step 3 (index 2), Step 5 (index 4)
        return sidebarValidity[currentStep - 1]
    }


    return (
        <div className="flex h-screen w-full bg-purple-100 overflow-hidden font-sans">
            {/* Sidebar */}
            {!isMobile && (
                <ActionSidebar
                    currentStep={currentStep}
                    onStepClick={setCurrentStep}
                    stepsValidity={sidebarValidity}
                    isEditMode={isEditMode}
                    viewMode={viewMode}
                />
            )}

            {/* Main Content */}
            <div className={`flex-1 flex flex-col bg-white relative transition-all duration-300 ${!isMobile ? 'h-[calc(100vh-24px)] rounded-[30px] m-3 shadow-sm border border-purple-100 overflow-hidden' : 'h-full'}`}>
                <ActionHeader
                    currentStep={currentStep}
                    totalSteps={5}
                    onSave={handleSave}
                    isSubmitting={isPending}
                    isEditMode={isEditMode}
                    viewMode={viewMode}
                    onChangeViewMode={handleViewModeChange}
                    disableContent={!isEditMode && !initialData?.id} // Only enable content if edit mode or ID exists
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
                                    {viewMode === 'info' && (
                                        <>
                                            {currentStep === 1 && (
                                                <Step1_Title
                                                    data={formData}
                                                    onChange={(data) => setFormData(prev => ({ ...prev, ...data }))}
                                                />
                                            )}
                                            {currentStep === 2 && (
                                                <Step2_Basics
                                                    data={formData}
                                                    onChange={(data) => setFormData(prev => ({ ...prev, ...data }))}
                                                />
                                            )}
                                            {currentStep === 3 && (
                                                <Step3_Goals
                                                    data={formData}
                                                    onChange={(data) => setFormData(prev => ({ ...prev, ...data }))}
                                                />
                                            )}
                                            {/* Note: Step 4 is now in Content mode */}
                                            {currentStep === 5 && (
                                                <Step5_MediaPricing
                                                    data={formData}
                                                    onChange={(data) => setFormData(prev => ({ ...prev, ...data }))}
                                                />
                                            )}
                                        </>
                                    )}

                                    {viewMode === 'content' && (
                                        // Directly render SectionList for content mode
                                        // We can wrap it in a "Step" container if needed for consistent styling
                                        initialData?.id ? <SectionList courseId={initialData.id} /> : <div>Lỗi: Không tìm thấy ID khóa học</div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </ScrollArea>

                {viewMode === 'info' && (
                    <ActionFooter
                        onBack={handleBack}
                        onNext={handleNext}
                        isFirstStep={currentStep === 1}
                        isLastStep={currentStep === 5}
                        isValid={isCurrentStepValid()}
                    />
                )}
            </div>
        </div>
    )
}

export default function CreateCoursePage() {
    return (
        <CourseAction isEditMode={false} />
    )
}
