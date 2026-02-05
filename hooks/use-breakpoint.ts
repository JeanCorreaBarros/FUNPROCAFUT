"use client"

import * as React from "react"

const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024
const DESKTOP_BREAKPOINT = 1280

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = React.useState<{
    isMobile: boolean
    isTablet: boolean
    isDesktop: boolean
    isLargeDesktop: boolean
  }>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isLargeDesktop: false,
  })

  React.useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth
      setBreakpoint({
        isMobile: width < MOBILE_BREAKPOINT,
        isTablet: width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT,
        isDesktop: width >= TABLET_BREAKPOINT && width < DESKTOP_BREAKPOINT,
        isLargeDesktop: width >= DESKTOP_BREAKPOINT,
      })
    }

    updateBreakpoint()
    window.addEventListener("resize", updateBreakpoint)
    return () => window.removeEventListener("resize", updateBreakpoint)
  }, [])

  return breakpoint
}

// Hook específico para móviles (mantener compatibilidad)
export function useIsMobile() {
  const { isMobile } = useBreakpoint()
  return isMobile
}
