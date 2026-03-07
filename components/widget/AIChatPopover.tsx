'use client'

import { X, Send, Sparkles, Paperclip, Image } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'

interface Message {
  id: number
  text: string
  isBot: boolean
}

interface AIChatPopoverProps {
  isOpen: boolean
  onClose: () => void
}

export default function AIChatPopover({ isOpen, onClose }: AIChatPopoverProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Xin chào! 👋 Tôi là trợ lý AI của Beyond8. Tôi có thể giúp gì cho bạn?',
      isBot: true,
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-expand textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto' // Reset height
      const newHeight = Math.min(textarea.scrollHeight, 120) // Max ~4 rows (30px per row)
      textarea.style.height = `${newHeight}px`
    }
  }, [inputValue])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      isBot: false,
    }
    setMessages([...messages, userMessage])
    setInputValue('')

    // Simulate bot response after 1 second
    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 2,
        text: 'Cảm ơn bạn đã liên hệ! Đây là demo chatbot. Trong phiên bản thực tế, tôi sẽ có thể trả lời các câu hỏi về khóa học, giảng viên và hỗ trợ học tập. 🚀',
        isBot: true,
      }
      setMessages((prev) => [...prev, botMessage])
    }, 1000)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 right-30 z-40 flex h-[600px] w-[380px] flex-col overflow-hidden rounded-2xl border-none bg-white shadow-2xl shadow-brand-magenta/20 backdrop-blur-xl dark:bg-black/95 origin-bottom-right"
        >
          {/* Header */}
          <div className="relative flex-shrink-0 overflow-hidden border-b border-brand-magenta/20 bg-gradient-to-r from-brand-magenta to-brand-purple p-4">
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Trợ lý AI Beyond8</h3>
                  <p className="text-xs text-white/80">Luôn sẵn sàng hỗ trợ bạn</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4 min-h-0">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                    message.isBot
                      ? 'bg-gradient-to-br from-brand-magenta/10 to-brand-purple/10 text-foreground'
                      : 'bg-gradient-to-br from-brand-magenta to-brand-purple text-white'
                  }`}
                >
                  <p className="break-words text-sm leading-relaxed">{message.text}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-brand-magenta/20 bg-white/50 p-4 backdrop-blur-sm dark:bg-black/50">
            <div className="flex gap-2">
              {/* Input Container with Textarea and Upload Icons */}
              <div className="flex flex-1 flex-col justify-between overflow-hidden rounded-xl border-2 border-brand-magenta/20 bg-white/80 transition-all focus-within:border-brand-magenta dark:bg-black/80">
                {/* Textarea Section */}
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  placeholder="Nhập tin nhắn..."
                  rows={1}
                  className="w-full resize-none overflow-y-auto border-none bg-transparent px-4 pt-3 pb-2 text-sm leading-relaxed outline-none scrollbar-hide"
                  style={{ minHeight: '30px', maxHeight: '120px' }}
                />
                
                {/* Upload Icons Section */}
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1 rounded-full px-2 py-1 text-xs text-brand-magenta/70 transition-colors hover:bg-brand-magenta/10 hover:text-brand-magenta"
                    title="Tải lên tệp"
                  >
                    <Paperclip className="h-3.5 w-3.5" />
                    <span>Tệp</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1 rounded-full px-2 py-1 text-xs text-brand-magenta/70 transition-colors hover:bg-brand-magenta/10 hover:text-brand-magenta"
                    title="Tải lên ảnh"
                  >
                    <Image className="h-3.5 w-3.5" />
                    <span>Ảnh</span>
                  </motion.button>
                </div>
              </div>
              
              {/* Send Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSendMessage}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-brand-magenta to-brand-purple text-white shadow-lg shadow-brand-magenta/30 transition-shadow hover:shadow-xl hover:shadow-brand-magenta/40"
              >
                <Send className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
