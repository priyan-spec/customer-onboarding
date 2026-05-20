import { useEffect, useRef, useState } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { getAuthToken, getAuthUser, getNotifications, WS_URL } from '../services/api.js'

const notificationMeta = {
  PROJECT_CREATED: { title: 'Project Created', icon: 'bi-folder-plus' },
  TASK_ASSIGNED: { title: 'Task Assigned', icon: 'bi-person-check' },
  TASK_UPDATED: { title: 'Task Updated', icon: 'bi-arrow-repeat' },
  TASK_DELETED: { title: 'Task Deleted', icon: 'bi-trash3' },
  PROJECT_ASSIGNMENT_UPDATED: { title: 'Project Team Updated', icon: 'bi-people' },
  PROJECT_PROGRESS_UPDATED: { title: 'Project Progress Updated', icon: 'bi-graph-up-arrow' },
  PROJECT_COMPLETED: { title: 'Project Completed', icon: 'bi-check-circle' },
}

function relativeTime(createdAt) {
  if (!createdAt) return 'Just now'

  const createdTime = new Date(createdAt).getTime()
  if (Number.isNaN(createdTime)) return 'Just now'

  const seconds = Math.max(0, Math.round((Date.now() - createdTime) / 1000))
  if (seconds < 60) return 'Just now'

  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes} min ago`

  const hours = Math.round(minutes / 60)
  return `${hours} hr ago`
}

function normalizeNotification(payload) {
  const meta = notificationMeta[payload.type] ?? { title: 'Notification', icon: 'bi-bell' }

  return {
    ...payload,
    id: payload.id ?? `${payload.type}-${payload.projectId ?? 'project'}-${payload.taskId ?? 'task'}-${payload.createdAt ?? Date.now()}`,
    title: meta.title,
    message: payload.message,
    icon: meta.icon,
    time: relativeTime(payload.createdAt),
  }
}

export function useLiveUpdates() {
  const [notifications, setNotifications] = useState([])
  const [toasts, setToasts] = useState([])
  const seenNotificationIds = useRef(new Set())
  const token = getAuthToken()
  const authUser = getAuthUser()
  const userId = authUser?.userId

  useEffect(() => {
    if (!token || !userId) {
      return undefined
    }

    let cancelled = false
    seenNotificationIds.current.clear()

    async function loadStoredNotifications() {
      try {
        const storedNotifications = await getNotifications(3)
        if (cancelled) {
          return
        }

        const normalizedNotifications = storedNotifications.map(normalizeNotification).slice(0, 3)
        normalizedNotifications.forEach((notification) => {
          seenNotificationIds.current.add(notification.id)
        })
        setNotifications(normalizedNotifications)
      } catch {
        if (!cancelled) {
          setNotifications([])
        }
      }
    }

    loadStoredNotifications()

    return () => {
      cancelled = true
    }
  }, [token, userId])

  useEffect(() => {
    if (!token || !userId) {
      return undefined
    }

    function handleMessage(message) {
      const payload = JSON.parse(message.body)

      const next = normalizeNotification(payload)
      if (seenNotificationIds.current.has(next.id)) {
        return
      }
      seenNotificationIds.current.add(next.id)
      if (seenNotificationIds.current.size > 100) {
        seenNotificationIds.current.delete(seenNotificationIds.current.values().next().value)
      }

      window.dispatchEvent(new CustomEvent('onboarding:notification', { detail: payload }))
      setNotifications((items) => [next, ...items.filter((item) => item.id !== next.id)].slice(0, 3))
      setToasts((items) => [next, ...items.filter((item) => item.id !== next.id)].slice(0, 3))
    }

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: () => {},
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/queue/notifications/${userId}`, handleMessage, {
          Authorization: `Bearer ${token}`,
        })
      },
    })

    client.activate()

    return () => {
      client.deactivate()
    }
  }, [token, userId])

  function dismissToast(id) {
    setToasts((items) => items.filter((toast) => toast.id !== id))
  }

  return { notifications, toasts, dismissToast }
}
