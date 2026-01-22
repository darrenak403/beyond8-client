import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from '@microsoft/signalr'
import { store } from '@/lib/redux/store'

export type SignalRStatus = HubConnectionState

let connection: HubConnection | null = null
let startPromise: Promise<void> | null = null

function getBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    'http://api-gateway-beyond8.dev.localhost:8080/'
  )
}

export function getHubUrl(): string {
  const base = getBaseUrl()
  return new URL('/hubs/app', base).toString()
}

function getAccessToken(): string | null {
  try {
    return store.getState().auth.token
  } catch {
    return null
  }
}

export function getHubConnection(): HubConnection {
  if (typeof window === 'undefined') {
    throw new Error('SignalR connection can only be created in the browser.')
  }

  if (connection) return connection

  const hubUrl = getHubUrl()
  connection = new HubConnectionBuilder()
    .withUrl(hubUrl, {
      accessTokenFactory: () => getAccessToken() || '',
    })
    .withAutomaticReconnect()
    .configureLogging(
      process.env.NODE_ENV === 'development' ? LogLevel.Information : LogLevel.Warning
    )
    .build()

  connection.onreconnecting((err) => {
    console.info('[SignalR] reconnecting...', err)
  })
  connection.onreconnected((connectionId) => {
    console.info('[SignalR] reconnected:', connectionId)
  })
  connection.onclose((err) => {
    console.info('[SignalR] closed', err)
  })

  return connection
}

export async function startHubConnection(): Promise<HubConnection> {
  const conn = getHubConnection()

  if (conn.state === HubConnectionState.Connected) return conn
  if (conn.state === HubConnectionState.Connecting && startPromise) {
    await startPromise
    return conn
  }

  startPromise = conn
    .start()
    .catch((err) => {
      // Reset so callers can retry
      startPromise = null
      console.error('[SignalR] failed to start', { hubUrl: getHubUrl(), err })
      throw err
    })
    .then(() => {
      startPromise = null
    })

  await startPromise
  console.info('[SignalR] connected', {
    hubUrl: getHubUrl(),
    connectionId: conn.connectionId,
    transport: conn.baseUrl ? 'configured' : 'unknown',
  })
  return conn
}

export async function stopHubConnection(): Promise<void> {
  if (!connection) return
  try {
    await connection.stop()
  } finally {
    connection = null
    startPromise = null
  }
}

