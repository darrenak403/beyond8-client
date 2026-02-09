'use client'

import { useState } from 'react'
import { Maximize2, Minimize2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface TextLessonProps {
    title: string
    content: string | null
}

export default function TextLesson({ title, content }: TextLessonProps) {
    const [isFullscreen, setIsFullscreen] = useState(false)

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
                <div className={`
                    p-4 h-full overflow-y-auto w-full
                    ${isFullscreen ? 'flex-1 h-full' : 'aspect-video flex flex-col'}
                `}>
                    <div className="space-y-4 max-w-none">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                p: ({ children }) => <p className="text-gray-700 text-base leading-relaxed mb-4 break-words">{children}</p>,
                                h1: ({ children }) => <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4">{children}</h1>,
                                h2: ({ children }) => <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-3">{children}</h2>,
                                h3: ({ children }) => <h3 className="text-xl font-semibold text-gray-900 mt-5 mb-2">{children}</h3>,
                                strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
                                em: ({ children }) => <em className="italic text-gray-800">{children}</em>,
                                ul: ({ children }) => <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4 ml-4 break-words">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-4 ml-4 break-words">{children}</ol>,
                                li: ({ children }) => <li className="text-gray-700 break-words">{children}</li>,
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
                                            className="rounded-lg !bg-[#1e1e1e] !p-4 my-4 border border-white/10 text-sm shadow-xl overflow-x-auto"
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
                    </div>
                </div>
            </div>
        </div>
    )
}
