'use client'

import { ReactNode } from 'react'
import { useSignalR } from '@/hooks/useSignalR'
import { useSignalRNotifications } from '@/hooks/useSignalRNotifications'
import { RequireReLoginDialog } from '@/components/widget/require-relogin-dialog'

/**
 * Auto-connects to SignalR when the app is loaded in the browser.
 * Place this high in the tree to keep a single connection.
 * Also sets up automatic toast notifications for SignalR messages.
 */
export function SignalRProvider({ children }: { children: ReactNode }) {
  useSignalR(true)
  const { showReLoginDialog, reLoginMessage, handleLogout } = useSignalRNotifications()
  
  return (
    <>
      {children}
      <RequireReLoginDialog
        open={showReLoginDialog}
        onLogout={handleLogout}
        title={reLoginMessage.title}
        description={reLoginMessage.description}
      />
    </>
  )
}

