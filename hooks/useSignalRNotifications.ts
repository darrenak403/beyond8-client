'use client'

import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { getHubConnection } from '@/lib/realtime/signalr'
import { HubConnectionState } from '@microsoft/signalr'
import { useLogout } from '@/hooks/useAuth'

export function useSignalRNotifications() {
  const handlersRef = useRef<Array<() => void>>([])
  const { mutateLogout } = useLogout()
  const [showReLoginDialog, setShowReLoginDialog] = useState(false)
  const [reLoginMessage, setReLoginMessage] = useState({ title: '', description: '' })

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
        const { title, message, metadata } = data
        console.log('[SignalR] Received RequireReLogin:', data.metadata?.requireReLogin)

        if (metadata?.requireReLogin) {
          setReLoginMessage({
            title: title || 'Yêu cầu đăng nhập lại',
            description: message || 'Tài khoản của bạn đã được duyệt thành công. Vui lòng đăng xuất và đăng nhập lại để cập nhật quyền truy cập.'
          })
          setShowReLoginDialog(true)
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
  }, [])

  const handleLogout = () => {
    setShowReLoginDialog(false)
    mutateLogout()
  }

  return {
    showReLoginDialog,
    reLoginMessage,
    handleLogout,
  }
}
