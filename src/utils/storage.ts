const PREFIX = 'fishing_'

export const storage = {
  set<T>(key: string, value: T): void {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  },

  get<T>(key: string, defaultValue?: T): T | null {
    const data = localStorage.getItem(PREFIX + key)
    if (!data) return defaultValue || null
    try {
      return JSON.parse(data) as T
    } catch {
      return defaultValue || null
    }
  },

  remove(key: string): void {
    localStorage.removeItem(PREFIX + key)
  },

  clear(): void {
    Object.keys(localStorage)
      .filter(key => key.startsWith(PREFIX))
      .forEach(key => localStorage.removeItem(key))
  }
}

export const session = {
  set<T>(key: string, value: T): void {
    sessionStorage.setItem(PREFIX + key, JSON.stringify(value))
  },

  get<T>(key: string, defaultValue?: T): T | null {
    const data = sessionStorage.getItem(PREFIX + key)
    if (!data) return defaultValue || null
    try {
      return JSON.parse(data) as T
    } catch {
      return defaultValue || null
    }
  },

  remove(key: string): void {
    sessionStorage.removeItem(PREFIX + key)
  }
}
