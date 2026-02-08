'use client'

import Link from 'next/link'
import { Bot, Facebook, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import AIChatPopover from '@/components/widget/AIChatPopover'

export default function FloatingActionButtons() {
  const [isChatOpen, setIsChatOpen] = useState(false)

  // Shake animation variant - giống như cuộc gọi đến
  const shakeVariant = {
    shake: {
      rotate: [0, -15, 15, -15, 15, -15, 15, -15, 0],
      scale: [1, 1.05, 1.05, 1.05, 1.05, 1.05, 1.05, 1.05, 1],
      transition: {
        duration: 1,
        repeat: Infinity,
        repeatDelay: 1.5,
        ease: 'easeInOut',
      },
    },
  }

  const shakeVariantDelayed = {
    shake: {
      rotate: [0, -15, 15, -15, 15, -15, 15, -15, 0],
      scale: [1, 1.05, 1.05, 1.05, 1.05, 1.05, 1.05, 1.05, 1],
      transition: {
        duration: 1,
        repeat: Infinity,
        repeatDelay: 1.5,
        delay: 0.3,
        ease: 'easeInOut',
      },
    },
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {/* Chat Popover */}
      <AIChatPopover isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* AI Assistant Button */}
      <motion.div
        className="relative"
        variants={!isChatOpen ? shakeVariant : undefined}
        animate={!isChatOpen ? 'shake' : undefined}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="group relative flex h-14 w-14 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-brand-magenta/30 bg-white/80 shadow-xl shadow-brand-magenta/20 backdrop-blur-xl transition-all duration-300 hover:border-brand-magenta hover:shadow-2xl hover:shadow-brand-magenta/40 dark:bg-black/80"
          aria-label="AI Assistant"
        >
          {/* Gradient Background on Hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-magenta/20 to-brand-purple/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Icon with Transition */}
          <div className="relative z-10">
            <AnimatePresence mode="wait">
              {isChatOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-7 w-7 text-brand-magenta" />
                </motion.div>
              ) : (
                <motion.div
                  key="bot"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ rotate: 12, scale: 1.1 }}
                >
                  <Bot className="h-7 w-7 text-brand-magenta" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </button>
      </motion.div>

      {/* Facebook Button */}
      <motion.div
        className="relative"
        variants={shakeVariantDelayed}
        animate="shake"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link
          href="https://www.facebook.com/danielleit241"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex h-14 w-14 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-blue-500/30 bg-white/80 shadow-xl shadow-blue-500/20 backdrop-blur-xl transition-all duration-300 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/40 dark:bg-black/80"
          aria-label="Facebook"
        >
          {/* Gradient Background on Hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-600/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Icon */}
          <motion.div
            whileHover={{ rotate: 12, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Facebook className="relative z-10 h-7 w-7 text-blue-500" />
          </motion.div>
        </Link>
      </motion.div>
    </div>
  )
}
