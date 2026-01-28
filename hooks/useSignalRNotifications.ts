'use client'

import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { getHubConnection } from '@/lib/realtime/signalr'
import { HubConnectionState } from '@microsoft/signalr'
import { useRefreshToken } from '@/hooks/useAuth'

export function useSignalRNotifications() {
  const handlersRef = useRef<Array<() => void>>([])
  const { mutateRefreshToken } = useRefreshToken()

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
        title?: string
        message?: string
        metadata?: {
          userId?: string
        }
      }) => {
        const { title, message } = data

        toast.info(
          title || 'Có đơn đăng ký giảng viên mới',
          {
            description: message,
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

      const handleRequireReLogin = (data: {
        title?: string
        message?: string
        metadata?: {
          requireReLogin?: boolean
        }
      }) => {
        const { title, metadata } = data
        console.log('[SignalR] Received RequireReLogin:', data.metadata?.requireReLogin)

        if (metadata?.requireReLogin) {
          toast.info(
            title || 'Cập nhật quyền truy cập',
            {
              description:'Tài khoản của bạn đã được duyệt thành công. Đang cập nhật quyền truy cập...',
              duration: 2000,
            }
          )

          mutateRefreshToken()
        }
      }

      connection.on('InstructorApplicationSubmitted', handleInstructorApplicationSubmitted)
      connection.on('RequireReLogin', handleRequireReLogin)

      const cleanup = () => {
        connection.off('InstructorApplicationSubmitted', handleInstructorApplicationSubmitted)
        connection.off('RequireReLogin', handleRequireReLogin)
      }
      handlersRef.current.push(cleanup)
    }

    if (connection.state === HubConnectionState.Connected) {
      setupListeners()
    } else {
      const checkInterval = setInterval(() => {
        if (connection.state === HubConnectionState.Connected) {
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
  }, [mutateRefreshToken])
}
