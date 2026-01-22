'use client'

import {ReduxProvider} from './reduxProvider'
import {QueryProvider} from './queryProvider'
import { SignalRProvider } from './signalRProvider'

export function Providers({children}: {children: React.ReactNode}) {
  return (
    <ReduxProvider>
      <QueryProvider>
        <SignalRProvider>{children}</SignalRProvider>
      </QueryProvider>
    </ReduxProvider>
  )
}

