'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Fireworks } from '@fireworks-js/react'
import type { FireworksHandlers } from '@fireworks-js/react'
import { getHubConnection } from '@/lib/realtime/signalr'
import { HubConnectionState } from '@microsoft/signalr'
import { decodeCompoundId } from '@/utils/crypto'
import { Button } from '@/components/ui/button'

export default function CourseSlugLayout({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()
  const ids = decodeCompoundId(searchParams.get('id') || '')
  const courseId = ids[0] || ''

  const fireworksRef = useRef<FireworksHandlers>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (showCelebration) {
      fireworksRef.current?.start()
    } else {
      fireworksRef.current?.stop()
    }
  }, [showCelebration])

  const triggerCelebration = useCallback(() => {
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current)
    setShowCelebration(true)
    dismissTimerRef.current = setTimeout(() => setShowCelebration(false), 8000)
  }, [])

  useEffect(() => {
    if (!courseId) return
    const connection = getHubConnection()

    const handleCourseCompleted = (data: {
      title?: string
      message?: string
      metadata?: { courseId?: string }
    }) => {
      if (data.metadata?.courseId && data.metadata.courseId !== courseId) return
      triggerCelebration()
    }

    const register = () => {
      if (connection.state === HubConnectionState.Connected) {
        connection.on('CourseCompleted', handleCourseCompleted)
      }
    }

    register()

    let interval: ReturnType<typeof setInterval> | null = null
    if (connection.state !== HubConnectionState.Connected) {
      interval = setInterval(() => {
        if (connection.state === HubConnectionState.Connected) {
          register()
          if (interval) clearInterval(interval)
        }
      }, 200)
    }

    return () => {
      connection.off('CourseCompleted', handleCourseCompleted)
      if (interval) clearInterval(interval)
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current)
    }
  }, [courseId, triggerCelebration])

  return (
    <>
      {children}

      <Fireworks
        ref={fireworksRef}
        autostart={false}
        options={{
          opacity: 0.9,
          particles: 250,
          explosion: 8,
          intensity: 80,
        }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 9999,
          pointerEvents: 'none',
          display: showCelebration ? 'block' : 'none',
        }}
      />

      {showCelebration && (
        <div
          className="fixed inset-0 z-9998 flex items-center justify-center pointer-events-none bg-black/30 backdrop-blur-xs"
          aria-live="polite"
        >
          <div
            className="pointer-events-auto bg-linear-to-br from-purple-900/90 to-indigo-900/90 border border-purple-400/30 rounded-3xl px-10 py-8 flex flex-col items-center gap-4 shadow-2xl"
            style={{ animation: 'bounceIn 0.6s ease-out' }}
          >
            <div className="text-6xl">🎉</div>
            <h2 className="text-2xl font-bold text-white drop-shadow-lg text-center">
              Chúc mừng bạn đã hoàn thành khóa học!
            </h2>
            <p className="text-purple-200 text-sm text-center">
              Bạn có thể lấy chứng chỉ tại trang hồ sơ của mình. <br /> Hãy tiếp tục học tập và khám phá những khóa học thú vị khác trên Beyond8 nhé!
            </p>
            <button
              className="mt-2 px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-full font-medium transition-colors"
              onClick={() => setShowCelebration(false)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
      {/* <div className="fixed bottom-4 left-4">
        <Button onClick={() => setShowCelebration(true)}>Pháo hoa</Button>
      </div> */}
    </>
  )
}
