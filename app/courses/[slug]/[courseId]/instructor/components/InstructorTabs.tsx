'use client'

import { motion } from 'framer-motion'

export type TabType = 'intro' | 'experience' | 'certificates'

interface InstructorTabsProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export default function InstructorTabs({ activeTab, onTabChange }: InstructorTabsProps) {
  const tabs = [
    { id: 'intro' as const, label: 'Giới thiệu' },
    { id: 'experience' as const, label: 'Kinh nghiệm' },
    { id: 'certificates' as const, label: 'Chứng chỉ' },
  ]

  return (
    <div className="mt-8 mb-6">
      <div className="relative border-b-2 border-gray-200 dark:border-gray-700">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative pb-4 px-2 font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'text-purple-600 dark:text-purple-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
                  transition={{
                    type: 'spring',
                    stiffness: 380,
                    damping: 30,
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
