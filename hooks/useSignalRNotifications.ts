'use client'

import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { getHubConnection } from '@/lib/realtime/signalr'
import { HubConnectionState } from '@microsoft/signalr'

export function useSignalRNotifications() {
  const handlersRef = useRef<Array<() => void>>([])

  useEffect(() => {
    console.log('[SignalR] useSignalRNotifications hook mounted')
    const connection = getHubConnection()
    console.log('[SignalR] Connection state:', connection.state)

    const setupListeners = () => {
      if (connection.state !== HubConnectionState.Connected) {
        console.log('[SignalR] Cannot setup listeners, connection not connected')
        return
      }

      const handleInstructorApplicationSubmitted = (data: {
        userId?: string
        profileId?: string
        instructorName?: string
        email?: string
        profileUrl?: string
        timestamp?: string | Date
      }) => {
        console.log('[SignalR] Received InstructorApplicationSubmitted:', data)
        const { instructorName, timestamp } = data

        const timeStr = timestamp
          ? new Date(timestamp).toLocaleString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
          : undefined

        toast.info(
          instructorName
            ? `Có đơn đăng ký giảng viên mới từ ${instructorName}`
            : 'Có đơn đăng ký giảng viên mới',
          {
            description: timeStr ? `Thời gian: ${timeStr}` : undefined,
            duration: 5000,
            action: {
              label: 'Xem chi tiết',
              onClick: () => {
                if (typeof window !== 'undefined') {
                  window.location.href = '/admin/instructor-registration'
                }
              },
            },
          }
        )
      }

      connection.on('InstructorApplicationSubmitted', handleInstructorApplicationSubmitted)
      console.log('[SignalR] Notification listeners registered successfully')

      const cleanup = () => {
        connection.off('InstructorApplicationSubmitted', handleInstructorApplicationSubmitted)
      }
      handlersRef.current.push(cleanup)
    }

    if (connection.state === HubConnectionState.Connected) {
      setupListeners()
    } else {
      console.log('[SignalR] Connection not ready, will retry when connected...')
      const checkInterval = setInterval(() => {
        if (connection.state === HubConnectionState.Connected) {
          console.log('[SignalR] Connection now ready, setting up listeners')
          setupListeners()
          clearInterval(checkInterval)
        }
      }, 100) 

      const timeoutId = setTimeout(() => {
        clearInterval(checkInterval)
        console.log('[SignalR] Stopped polling for connection')
      }, 10000)

      handlersRef.current.push(() => {
        clearInterval(checkInterval)
        clearTimeout(timeoutId)
      })
    }

    const handleReconnected = () => {
      console.log('[SignalR] Connection reconnected, re-setting up listeners')
      setupListeners()
    }

    connection.onreconnected(handleReconnected)

    return () => {
      handlersRef.current.forEach(cleanup => cleanup())
      handlersRef.current = []
    }
  }, [])
}
