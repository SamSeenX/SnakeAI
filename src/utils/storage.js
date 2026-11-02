export const storage = {
  get(key, fallback = null) {
    try {
      const item = localStorage.getItem(key)
      return item !== null ? JSON.parse(item) : fallback
    } catch {
      return fallback
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch {
      return false
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key)
      return true
    } catch {
      return false
    }
  },

  async requestPersistence() {
    if (typeof navigator !== 'undefined' && navigator.storage?.persist) {
      try {
        await navigator.storage.persist()
      } catch {
        // Silently degrade on restricted environments
      }
    }
  }
}

export default storage
