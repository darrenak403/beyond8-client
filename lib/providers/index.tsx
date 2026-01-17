'use client'

import {ReduxProvider} from './reduxProvider'
import {QueryProvider} from './queryProvider'

export function Providers({children}: {children: React.ReactNode}) {
  return (
    <ReduxProvider>
      <QueryProvider>
        {children}
      </QueryProvider>
    </ReduxProvider>
  )
}

