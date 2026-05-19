import { useEffect, useState } from 'react'
import { notificationSeeds } from '../data/mockData.js'

function createNotification(seed, index) {
  return {
    id: `${Date.now()}-${index}`,
    title: seed.title,
    message: seed.message,
    icon: seed.icon,
    time: 'Just now',
  }
}

export function useLiveUpdates() {
  const [cursor, setCursor] = useState(0)
  const [notifications, setNotifications] = useState(() =>
    notificationSeeds.slice(0, 3).map((seed, index) => ({
      id: `seed-${index}`,
      title: seed.title,
      message: seed.message,
      icon: seed.icon,
      time: index === 0 ? '2 min ago' : `${index + 3} min ago`,
    })),
  )
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const interval = window.setInterval(() => {
      const seed = notificationSeeds[cursor % notificationSeeds.length]
      const next = createNotification(seed, cursor)

      setNotifications((items) => [next, ...items].slice(0, 6))
      setToasts((items) => [next, ...items].slice(0, 3))
      setCursor((value) => value + 1)
    }, 6500)

    return () => window.clearInterval(interval)
  }, [cursor])

  function dismissToast(id) {
    setToasts((items) => items.filter((toast) => toast.id !== id))
  }

  return { notifications, toasts, dismissToast }
}
