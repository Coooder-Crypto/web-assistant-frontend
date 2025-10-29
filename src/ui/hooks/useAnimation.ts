import { useEffect, useRef, useState } from 'react'

// Hook for managing entrance animations
export function useEntranceAnimation(delay: number = 0) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  return {
    isVisible,
    className: isVisible ? 'fade-in' : 'opacity-0',
    style: {
      animationDelay: `${delay}ms`,
    },
  }
}

// Hook for intersection observer animations
export function useScrollAnimation(threshold: number = 0.1) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold },
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [threshold])

  return {
    ref,
    isVisible,
    className: isVisible ? 'fade-in slide-up' : 'opacity-0',
  }
}

// Hook for typing animation
export function useTypingAnimation(text: string, speed: number = 50) {
  const [displayText, setDisplayText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    let i = 0
    setDisplayText('')
    setIsComplete(false)

    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1))
        i++
      }
      else {
        setIsComplete(true)
        clearInterval(timer)
      }
    }, speed)

    return () => clearInterval(timer)
  }, [text, speed])

  return {
    displayText,
    isComplete,
  }
}

// Hook for managing loading states with animation
export function useLoadingAnimation() {
  const [loadingStage, setLoadingStage] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const setLoading = () => setLoadingStage('loading')
  const setSuccess = () => {
    setLoadingStage('success')
    setTimeout(() => setLoadingStage('idle'), 2000)
  }
  const setError = () => {
    setLoadingStage('error')
    setTimeout(() => setLoadingStage('idle'), 3000)
  }

  const getAnimationClass = () => {
    switch (loadingStage) {
      case 'loading':
        return 'pulse'
      case 'success':
        return 'fade-in'
      case 'error':
        return 'shake fade-in'
      default:
        return ''
    }
  }

  return {
    loadingStage,
    setLoading,
    setSuccess,
    setError,
    isLoading: loadingStage === 'loading',
    animationClass: getAnimationClass(),
  }
}

// Hook for staggered animations
export function useStaggeredAnimation(items: any[], delay: number = 100) {
  const [visibleItems, setVisibleItems] = useState(0)

  useEffect(() => {
    setVisibleItems(0)

    items.forEach((_, index) => {
      setTimeout(() => {
        setVisibleItems(index + 1)
      }, index * delay)
    })
  }, [items, delay])

  const getItemAnimation = (index: number) => ({
    className: index < visibleItems ? 'fade-in slide-up' : 'opacity-0',
    style: {
      animationDelay: `${index * delay}ms`,
    },
  })

  return { getItemAnimation }
}
