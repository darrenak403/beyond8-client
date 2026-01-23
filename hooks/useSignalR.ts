import { useEffect, useMemo, useState } from 'react'
import type { HubConnection, HubConnectionState } from '@microsoft/signalr'
import { getHubConnection, startHubConnection, stopHubConnection } from '@/lib/realtime/signalr'

export function useSignalR(autoConnect = true) {
  const connection = useMemo<HubConnection>(() => getHubConnection(), [])
  const [state, setState] = useState<HubConnectionState>(connection.state)
  const [error, setError] = useState<unknown>(null)

  useEffect(() => {
    const update = () => setState(connection.state)

    connection.onreconnecting(() => update())
    connection.onreconnected(() => update())
    connection.onclose(() => update())

    update()

    return () => {
      // Note: SignalR does not expose "offreconnecting" APIs; handlers are replaced per assignment.
      // We just keep connection-level handlers minimal and rely on connection singleton.
    }
  }, [connection])

  useEffect(() => {
    if (!autoConnect) return

    let cancelled = false
    startHubConnection()
      .then(() => {
        if (!cancelled) setError(null)
      })
      .catch((e) => {
        if (!cancelled) setError(e)
      })

    return () => {
      cancelled = true
    }
  }, [autoConnect])

  return {
    connection,
    state,
    error,
    start: startHubConnection,
    stop: stopHubConnection,
  }
}

