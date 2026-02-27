'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { useAppDispatch } from '@/lib/redux/hooks'
import { logout } from '@/lib/redux/slices/authSlice'

export function useAuthSyncAcrossTabs() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const queryClient = useQueryClient()

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== 'auth-event' || !event.newValue) return

      try {
        const data = JSON.parse(event.newValue) as {
          type: 'LOGOUT'
          timestamp: number
        }

        if (data.type === 'LOGOUT') {
          dispatch(logout())

          queryClient.clear()

          if (typeof window !== 'undefined') {
            window.localStorage.clear()
          }

          router.push('/login')
        }
      } catch (error) {
        console.error('[AuthSync] Failed to parse auth-event:', error)
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => {
      window.removeEventListener('storage', handleStorage)
    }
  }, [dispatch, queryClient, router])
}

