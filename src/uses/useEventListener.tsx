import { useRef, useEffect } from 'react'

export const useShortCuts = () => {}

export const useEventListener = (
    eventName: string,
    handler: any,
    element?: any
) => {
    const savedHandler = useRef<any>()

    useEffect(() => {
        savedHandler.current = handler
    }, [handler])

    useEffect((): any => {
        if (typeof window === 'undefined') {
            return
        }

        if (!element) {
            element = window
        }

        const isSupported = element && element.addEventListener
        if (!isSupported) return

        const eventListener = (event: any) => savedHandler.current(event)

        element.addEventListener(eventName, eventListener)

        return () => {
            element.removeEventListener(eventName, eventListener)
        }
    }, [eventName, element])
}
