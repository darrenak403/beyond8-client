'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { useCreateCourse } from '@/hooks/useCourse'

import CreateCourseHeader from './components/CreateCourseHeader'
import { ScrollArea } from '@/components/ui/scroll-area'
import CreateCourseFooter from './components/CreateCourseFooter'
import CreateCourseSidebar from './components/CreateCourseSidebar'
import Step1Title from './components/Step1Title'
import Step2Basics from './components/Step2Basics'
import Step2Curriculum from './components/Step2Curriculum'
import Step3MediaPricing from './components/Step3MediaPricing'
import { useIsMobile } from '@/hooks/useMobile'

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

export default function CreateCoursePage() {
    const router = useRouter()
    const { user } = useAuth()
    const { createCourse, isPending } = useCreateCourse()
    const isMobile = useIsMobile()

    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState({
        // Basics
        title: '',
        shortDescription: '',
        description: '',
        categoryId: '',
        level: '',
        language: 'Tiếng Việt',
        // Curriculum
        outcomes: [''],
        requirements: [''],
        targetAudience: [''],
        // Price & Media
        price: 0,
        thumbnailUrl: '',
    })

    // Validation
    const isInfoValid = formData.title.length >= 5 && formData.shortDescription.length >= 10 && formData.description.length >= 20
    const isBasicsValid = !!(formData.categoryId && formData.level && formData.language)
    const isCurriculumValid = !!(
        formData.outcomes.some(i => i.trim() !== '') &&
        formData.requirements.some(i => i.trim() !== '') &&
        formData.targetAudience.some(i => i.trim() !== '')
    )
    const isMediaValid = formData.price >= 0

    // Mapping 4 sidebar items 1:1
    const sidebarValidity = [isInfoValid, isBasicsValid, isCurriculumValid, isMediaValid]

    const getCanProceed = () => {
        switch (currentStep) {
            case 1: return isInfoValid
            case 2: return isBasicsValid
            case 3: return isCurriculumValid
            case 4: return isMediaValid
            default: return false
        }
    }

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1)
        }
    }

    const handleNext = () => {
        if (!getCanProceed()) {
            toast.error('Vui lòng điền đầy đủ thông tin trước khi tiếp tục.')
            return
        }
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1)
        } else {
            handleSubmit()
        }
    }



    const handleSubmit = async () => {
        if (!user?.id) {
            toast.error('Không tìm thấy thông tin giảng viên')
            return
        }

        try {
            await createCourse({
                ...formData,
                outcomes: formData.outcomes.filter(i => i.trim() !== ''),
                requirements: formData.requirements.filter(i => i.trim() !== ''),
                targetAudience: formData.targetAudience.filter(i => i.trim() !== ''),
                thumbnailUrl: formData.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
            })
            router.push('/instructor/courses')
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="flex h-screen w-full bg-purple-100 overflow-hidden font-sans">
            {/* Sidebar - Desktop */}
            {!isMobile && (
                <CreateCourseSidebar
                    currentStep={currentStep}
                    onStepClick={(step) => setCurrentStep(step)}
                    stepsValidity={sidebarValidity}
                />
            )}

            {/* Main Content Area */}
            <div className={`flex-1 flex flex-col bg-white relative transition-all duration-300 ${!isMobile ? 'h-[calc(100vh-24px)] rounded-[30px] m-3 shadow-sm border border-purple-100 overflow-hidden' : 'h-full'}`}>
                <CreateCourseHeader currentStep={currentStep} totalSteps={4} />

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
                                    {currentStep === 1 && (
                                        <Step1Title
                                            data={formData}
                                            onChange={(data) => setFormData(prev => ({ ...prev, ...data }))}
                                        />
                                    )}
                                    {currentStep === 2 && (
                                        <Step2Basics
                                            data={formData}
                                            onChange={(data) => setFormData(prev => ({ ...prev, ...data }))}
                                        />
                                    )}
                                    {currentStep === 3 && (
                                        <Step2Curriculum
                                            data={formData}
                                            onChange={(data) => setFormData(prev => ({ ...prev, ...data }))}
                                        />
                                    )}
                                    {currentStep === 4 && (
                                        <Step3MediaPricing
                                            data={formData}
                                            onChange={(data) => setFormData(prev => ({ ...prev, ...data }))}
                                        />
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </ScrollArea>

                <CreateCourseFooter
                    onNext={handleNext}
                    nextLabel={currentStep === 4 ? 'Tạo khóa học' : 'Tiếp theo'}
                    nextDisabled={!getCanProceed()}
                    isLastStep={currentStep === 4}
                    isSubmitting={isPending}
                    onBack={handleBack}
                />
            </div>
        </div>
    )
}
