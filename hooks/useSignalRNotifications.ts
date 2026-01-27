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
        Title?: string
        Message?: string
        Metadata?: {
          userId?: string
        }
      }) => {
        console.log('[SignalR] Received InstructorApplicationSubmitted:', data)
        const { Title, Message } = data

        toast.info(
          Title || 'Có đơn đăng ký giảng viên mới',
          {
            description: Message,
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
        Title?: string
        Message?: string
        Metadata?: {
          RequireReLogin?: boolean
        }
      }) => {
        console.log('[SignalR] Received RequireReLogin:', data)
        const { Title, Message, Metadata } = data

        if (Metadata?.RequireReLogin) {
          toast.warning(
            Title || 'Yêu cầu đăng nhập lại',
            {
              description: Message || 'Tài khoản của bạn đã được duyệt thành công. Vui lòng đăng xuất và đăng nhập lại để cập nhật quyền truy cập.',
              duration: 10000,
            }
          )
        }
      }

      connection.on('InstructorApplicationSubmitted', handleInstructorApplicationSubmitted)
      connection.on('RequireReLogin', handleRequireReLogin)
      console.log('[SignalR] Notification listeners registered successfully')

      const cleanup = () => {
        connection.off('InstructorApplicationSubmitted', handleInstructorApplicationSubmitted)
        connection.off('RequireReLogin', handleRequireReLogin)
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
