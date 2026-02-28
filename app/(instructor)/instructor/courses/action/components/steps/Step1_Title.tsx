'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ArrowDown, Check } from 'lucide-react'

interface Step1TitleProps {
    data: {
        title: string
        shortDescription: string
        description: string
    }
    onChange: (data: Partial<Step1TitleProps['data']>) => void
    isEditMode?: boolean
}

export default function Step1Title({ data, onChange, isEditMode }: Step1TitleProps) {
    // If we already have descriptions or are in edit mode, default to expanded view
    const [isExpanded, setIsExpanded] = useState(!!(data.shortDescription || data.description) || isEditMode)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const adjustHeight = () => {
        const textarea = textareaRef.current
        if (textarea) {
            textarea.style.height = 'auto'
            textarea.style.height = `${textarea.scrollHeight}px`
        }
    }

    useEffect(() => {
        adjustHeight()
    }, [data.title, isExpanded])

    const handleExpand = () => {
        if (data.title.trim().length >= 5) {
            setIsExpanded(true)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleExpand()
        }
    }

    return (
        <div className={`flex flex-col flex-1 max-w-4xl w-full mx-auto transition-all duration-700 ease-in-out justify-center min-h-[calc(100vh-300px)]`}>

            {/* Title Section */}
            <motion.div
                layout
                className={`w-full space-y-4 transition-all duration-500 ${isExpanded ? 'mb-8' : 'text-center mb-0'}`}
            >
                <motion.div layout className="space-y-4">
                    <motion.h2
                        layout="position"
                        className={`font-bold tracking-tight text-gray-900 transition-all duration-500 ${isExpanded ? 'text-2xl' : 'text-3xl md:text-4xl'}`}
                    >
                        {isExpanded ? 'Tiêu đề khóa học' : 'Đặt tiêu đề cho khóa học của bạn'}
                    </motion.h2>

                    {!isExpanded && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-lg text-gray-500 w-full mx-auto"
                        >
                            Tiêu đề ấn tượng sẽ thu hút học viên ngay từ cái nhìn đầu tiên.
                        </motion.p>
                    )}
                </motion.div>

                <motion.div layout className={`relative ${isExpanded ? 'max-w-4xl' : 'max-w-3xl mx-auto'}`}>
                    <textarea
                        ref={textareaRef}
                        placeholder="Nhập tiêu đề của bạn"
                        value={data.title}
                        onChange={(e) => {
                            if (e.target.value.length <= 100) {
                                onChange({ title: e.target.value })
                            }
                        }}
                        onKeyDown={!isExpanded ? handleKeyDown : undefined}
                        className={`w-full font-bold border-none focus:ring-0 focus:outline-none placeholder:text-gray-200 resize-none bg-transparent overflow-hidden transition-all duration-500
                            ${isExpanded ? 'text-left text-3xl border-b border-gray-100 pb-2' : 'text-center text-3xl md:text-5xl'}
                        `}
                        rows={1}
                        autoFocus={!isExpanded}
                    />

                    {!isExpanded && (
                        <div className="mt-6 flex flex-col items-center gap-4">
                            <div className={`text-sm font-medium transition-colors ${data.title.length >= 100 ? 'text-red-500' : 'text-gray-400'}`}>
                                {data.title.length}/100
                            </div>

                            {data.title.length >= 10 && (
                                <motion.button
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    onClick={handleExpand}
                                    className="flex items-center gap-2 px-6 py-2 rounded-full bg-black text-white hover:bg-gray-800 transition-colors shadow-lg"
                                >
                                    <span>Tiếp tục mô tả</span>
                                    <ArrowDown className="w-4 h-4" />
                                </motion.button>
                            )}
                        </div>
                    )}
                </motion.div>
            </motion.div>

            {/* Description Section (Revealed on Expand) */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="w-full space-y-8 pb-12"
                    >
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold tracking-tight">Mô tả khóa học</h2>
                            <p className="text-muted-foreground">
                                Mô tả chi tiết giúp học viên hiểu rõ nội dung và lợi ích của khóa học.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <Label className="text-base font-semibold">Mô tả ngắn <span className="text-red-500">*</span></Label>
                                    <span className={`text-xs ${data.shortDescription.length > 100 || (data.shortDescription.length > 0 && data.shortDescription.length < 10) ? 'text-red-500' : 'text-muted-foreground'}`}>
                                        {data.shortDescription.length}/100
                                    </span>
                                </div>
                                <Textarea
                                    id="shortDescription"
                                    placeholder="Tóm tắt nội dung chính của khóa học trong vài câu..."
                                    value={data.shortDescription}
                                    onChange={(e) => {
                                        if (e.target.value.length <= 100) {
                                            onChange({ shortDescription: e.target.value })
                                        }
                                    }}
                                    className={`h-24 resize-none text-base leading-relaxed bg-transparent border rounded-lg focus-visible:ring-0 transition-colors p-4 ${
                                        data.shortDescription.length > 0 && data.shortDescription.length < 10
                                            ? 'border-red-400 focus-visible:border-red-500'
                                            : 'border-gray-500 focus-visible:border-black'
                                    }`}
                                />
                                {data.shortDescription.length > 0 && data.shortDescription.length < 10 && (
                                    <p className="text-xs text-red-500">Mô tả ngắn phải có ít nhất 10 ký tự</p>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <Label className="text-base font-semibold">Mô tả chi tiết <span className="text-red-500">*</span></Label>
                                    <span className={`text-xs ${data.description.length > 500 || (data.description.length > 0 && data.description.length < 10) ? 'text-red-500' : 'text-muted-foreground'}`}>
                                        {data.description.length}/500
                                    </span>
                                </div>
                                <Textarea
                                    id="description"
                                    placeholder="Trình bày chi tiết về nội dung, mục tiêu và đối tượng của khóa học..."
                                    value={data.description}
                                    onChange={(e) => {
                                        if (e.target.value.length <= 500) {
                                            onChange({ description: e.target.value })
                                        }
                                    }}
                                    className={`min-h-[200px] text-base leading-relaxed bg-transparent border rounded-lg focus-visible:ring-0 transition-colors p-4 ${
                                        data.description.length > 0 && data.description.length < 10
                                            ? 'border-red-400 focus-visible:border-red-500'
                                            : 'border-gray-500 focus-visible:border-black'
                                    }`}
                                />
                                {data.description.length > 0 && data.description.length < 10 && (
                                    <p className="text-xs text-red-500">Mô tả chi tiết phải có ít nhất 10 ký tự</p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    )
}
