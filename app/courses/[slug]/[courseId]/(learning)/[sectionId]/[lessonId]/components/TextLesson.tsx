import { useState, useRef, useEffect } from 'react' // Import useRef
import { Maximize2, Minimize2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface TextLessonProps {
    lessonId: string
    title: string
    content: string | null
    onScrollToBottom?: () => void
}

export default function TextLesson({ title, content, onScrollToBottom }: TextLessonProps) {
    const [isFullscreen, setIsFullscreen] = useState(false)
    // Removed internal enrollment checks as they are handled in parent
    // const { updateLearning, isPending } = useUpdateLearning()
    // const router = useRouter()

    // Scroll detection
    const contentRef = useRef<HTMLDivElement>(null)
    const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)

    // Check if content is short enough to not need scrolling
    useEffect(() => {
        if (!contentRef.current) return

        const checkScroll = () => {
            if (contentRef.current) {
                const { scrollHeight, clientHeight } = contentRef.current
                // If content is shorter than or equal to container, it's considered "read"
                if (scrollHeight <= clientHeight + 50) {
                    setHasScrolledToBottom(true)
                    if (onScrollToBottom) onScrollToBottom()
                }
            }
        }

        // Check initially and on resize
        checkScroll()
        window.addEventListener('resize', checkScroll)

        // Also observe content changes if markdown renders late (basic approach)
        const timeoutId = setTimeout(checkScroll, 500)

        return () => {
            window.removeEventListener('resize', checkScroll)
            clearTimeout(timeoutId)
        }
    }, [content, onScrollToBottom])

    const handleScroll = () => {
        if (!contentRef.current) return
        const { scrollTop, scrollHeight, clientHeight } = contentRef.current

        // Check if we are close to bottom
        const isBottom = scrollTop + clientHeight >= scrollHeight - 50

        if (!hasScrolledToBottom && isBottom) {
            setHasScrolledToBottom(true)
            if (onScrollToBottom) {
                onScrollToBottom()
            }
        }
    }

    // Check enrollment and progress to determine if already completed
    // const { enrollmentId } = useCheckEnrollment(courseId, { enabled: !!courseId })
    // const { curriculumProgress } = useGetCurriculumProgress(enrollmentId || undefined, { enabled: !!enrollmentId })

    // const isCompleted = useMemo(() => {
    //     if (!curriculumProgress) return false;

    //     for (const section of curriculumProgress.sections) {
    //         const lesson = section.lessons.find(l => l.lessonId === lessonId)
    //         if (lesson) return lesson.isCompleted
    //     }
    //     return false
    // }, [curriculumProgress, lessonId])

    // const handleComplete = async () => {
    //     try {
    //         await updateLearning({
    //             lessonId,
    //             data: {
    //                 lastPositionSeconds: 0,
    //                 markComplete: true
    //             }
    //         })
    //     } catch (error) {
    //         console.error("Failed to mark lesson as complete:", error)
    //     }
    // }

    if (!content) return null

    return (
        <div className={`w-full transition-all duration-300 ease-in-out ${isFullscreen ? 'fixed inset-0 z-50 bg-white/50 backdrop-blur-sm p-4 md:p-8 flex flex-col items-center justify-center' : ''}`}>
            <div
                className={`
                    relative bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]
                    transition-all duration-300 ease-in-out
                    ${isFullscreen
                        ? 'w-full h-full max-w-5xl rounded-2xl overflow-hidden flex flex-col'
                        : 'w-full rounded-3xl overflow-hidden'
                    }
                `}
            >
                {/* Header / Toolbar */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
                    <h1 className="text-xl font-bold text-gray-900 truncate pr-4">{title}</h1>
                    <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-900 transition-colors"
                        title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                    >
                        {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                    </button>
                </div>

                {/* Content Area */}
                <div
                    ref={contentRef}
                    onScroll={handleScroll}
                    className={`
                    p-4 h-full overflow-y-auto w-full scrollbar-auto-show
                    ${isFullscreen ? 'flex-1 h-full' : 'aspect-video flex flex-col'}
                `}>
                    <div className="space-y-4 max-w-none">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                p: ({ children }) => <p className="text-gray-700 text-base leading-relaxed mb-4 wrap-break-word">{children}</p>,
                                h1: ({ children }) => <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4">{children}</h1>,
                                h2: ({ children }) => <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-3">{children}</h2>,
                                h3: ({ children }) => <h3 className="text-xl font-semibold text-gray-900 mt-5 mb-2">{children}</h3>,
                                strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
                                em: ({ children }) => <em className="italic text-gray-800">{children}</em>,
                                ul: ({ children }) => <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4 ml-4 wrap-break-word">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-4 ml-4 wrap-break-word">{children}</ol>,
                                li: ({ children }) => <li className="text-gray-700 wrap-break-word">{children}</li>,
                                blockquote: ({ children }) => <blockquote className="border-l-4 border-brand-purple/50 pl-4 italic text-gray-600 my-4">{children}</blockquote>,
                                a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-brand-pink hover:underline">{children}</a>,
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                code: ({ inline, className, children, ...props }: any) => {
                                    const match = /language-(\w+)/.exec(className || '')
                                    return !inline && match ? (
                                        <SyntaxHighlighter
                                            {...props}
                                            style={vscDarkPlus}
                                            language={match[1]}
                                            PreTag="div"
                                            className="rounded-lg bg-[#1e1e1e]! p-4! my-4 border border-white/10 text-sm shadow-xl overflow-x-auto"
                                            showLineNumbers={false}
                                        >
                                            {String(children).replace(/\n$/, '')}
                                        </SyntaxHighlighter>
                                    ) : (
                                        <code className="bg-gray-100 text-brand-pink px-1.5 py-0.5 rounded text-sm font-mono break-all" {...props}>
                                            {children}
                                        </code>
                                    )
                                }
                            }}
                        >
                            {content}
                        </ReactMarkdown>

                        {/* Completion / Next Lesson Button REMOVED - controlled by parent */}
                        {/* <div className="mt-8 flex justify-center pb-4">
                            {nextLesson ? (
                                <Button
                                    onClick={async () => {
                                        if (isNavigating) return

                                        if (!isCompleted) {
                                            await handleComplete()
                                        }

                                        if (nextLesson) {
                                            setIsNavigating(true)
                                            router.push(`/courses/${params?.slug}/${courseId}/${nextLesson.sectionId}/${nextLesson.id}`)
                                        }
                                    }}
                                    disabled={isPending || (!isCompleted && !hasScrolledToBottom) || isNavigating}
                                    className={`
                                        rounded-full px-8 py-6 text-base font-semibold shadow-lg transition-all
                                        ${(!isCompleted && !hasScrolledToBottom)
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-linear-to-r from-brand-purple to-brand-pink text-white hover:opacity-90 hover:scale-[1.02]'
                                        }
                                    `}
                                >
                                    {isNavigating ? 'Đang chuyển bài...' : (
                                        <>
                                            Bài tiếp theo
                                            <ArrowRight className="w-5 h-5 ml-2" />
                                        </>
                                    )}
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleComplete}
                                    disabled={isPending || isCompleted}
                                    className={`
                                        rounded-full px-8 py-6 text-base font-semibold shadow-lg transition-all
                                        ${isCompleted
                                            ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200 cursor-default'
                                            : (!hasScrolledToBottom ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-linear-to-r from-brand-purple to-brand-pink text-white hover:opacity-90 hover:scale-[1.02]')
                                        }
                                    `}
                                >
                                    {isCompleted ? (
                                        <>
                                            <CheckCircle className="w-5 h-5 mr-2" />
                                            Đã hoàn thành
                                        </>
                                    ) : (
                                        <>
                                            {isPending ? 'Đang xử lý...' : 'Đánh dấu hoàn thành'}
                                        </>
                                    )}
                                </Button>
                            )}
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}
