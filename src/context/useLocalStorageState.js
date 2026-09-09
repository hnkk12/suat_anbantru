import { useEffect, useState } from 'react'

const PREFIX = 'suat-an-ban-tru:'

export function useLocalStorageState(key, initialValue) {
  const fullKey = PREFIX + key
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(fullKey)
      return raw ? JSON.parse(raw) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(fullKey, JSON.stringify(value))
    } catch {
      // ignore quota / serialization errors
    }
  }, [fullKey, value])

  return [value, setValue]
}
