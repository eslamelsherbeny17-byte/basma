// lib/toast-helper.ts
'use client'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastOptions {
  title: string
  description?: string
  type?: ToastType
  duration?: number
}

class ToastManager {
  private toasts: Map<string, ToastOptions> = new Map()
  private listeners: Set<(toasts: ToastOptions[]) => void> = new Set()

  show(options: ToastOptions) {
    const id = Math.random().toString(36).substring(7)
    this.toasts.set(id, options)
    this.notify()

    setTimeout(() => {
      this.toasts.delete(id)
      this.notify()
    }, options.duration || 4000)
  }

  subscribe(listener: (toasts: ToastOptions[]) => void) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notify() {
    const toastArray = Array.from(this.toasts.values())
    this.listeners.forEach((listener) => listener(toastArray))
  }
}

const toastManager = new ToastManager()

export const toast = {
  success: (message: string, description?: string) => {
    toastManager.show({
      title: message,
      description,
      type: 'success',
    })
  },

  error: (message: string, description?: string) => {
    toastManager.show({
      title: message,
      description,
      type: 'error',
    })
  },

  info: (message: string, description?: string) => {
    toastManager.show({
      title: message,
      description,
      type: 'info',
    })
  },

  warning: (message: string, description?: string) => {
    toastManager.show({
      title: message,
      description,
      type: 'warning',
    })
  },

  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string
      error: string
    }
  ) => {
    toastManager.show({
      title: messages.loading,
      description: 'جاري المعالجة...',
      type: 'info',
    })

    promise
      .then(() => {
        toastManager.show({
          title: messages.success,
          type: 'success',
        })
      })
      .catch(() => {
        toastManager.show({
          title: messages.error,
          type: 'error',
        })
      })

    return promise
  },
}

export { toastManager }
