import hotkeys, { HotkeysEvent } from 'hotkeys-js'
import React, { useCallback, useEffect, useRef } from 'react'
import { intersectionWith } from 'lodash'
import { Point } from '@yomyer/paper'
type AvailableTags = 'INPUT' | 'TEXTAREA' | 'SELECT'

export type HotKeysEvent = HotkeysEvent & {
    delta: Point
    isPressed: (keyCode: any) => boolean
}

export interface HotKeyHandler {
    (keyboardEvent: KeyboardEvent, hotkeysEvent: HotKeysEvent): void | boolean
}

// We implement our own custom filter system.
hotkeys.filter = () => true

const tagFilter = (
    { target }: KeyboardEvent,
    enableOnTags?: AvailableTags[]
) => {
    const targetTagName = target && (target as HTMLElement).tagName

    return Boolean(
        targetTagName &&
            enableOnTags &&
            enableOnTags.includes(targetTagName as AvailableTags)
    )
}

const isKeyboardEventTriggeredByInput = (ev: KeyboardEvent) => {
    return tagFilter(ev, ['INPUT', 'TEXTAREA', 'SELECT'])
}

const getDeltaArrow = (ev: KeyboardEvent) => {
    const point = new Point(0, 0)
    switch (ev.code) {
        case 'ArrowUp':
            point.y = -1
            break
        case 'ArrowDown':
            point.y = 1
            break
        case 'ArrowLeft':
            point.x = -1
            break
        case 'ArrowRight':
            point.x = 1
            break
    }

    return point
}

export type Options = {
    enabled?: boolean
    filter?: typeof hotkeys.filter
    filterPreventDefault?: boolean
    enableOnTags?: AvailableTags[]
    enableOnContentEditable?: boolean
    splitKey?: string
    scope?: string
    keyup?: boolean
    keydown?: boolean
}

export function useHotkeys<T extends Element>(
    keys: string,
    callbackDown: HotKeyHandler,
    options?: Options
): React.MutableRefObject<T | null>
export function useHotkeys<T extends Element>(
    keys: string,
    callbackDown: HotKeyHandler,
    deps?: any[]
): React.MutableRefObject<T | null>
export function useHotkeys<T extends Element>(
    keys: string,
    callbackDown: HotKeyHandler,
    options?: Options,
    deps?: any[]
): React.MutableRefObject<T | null>

export function useHotkeys<T extends Element>(
    keys: string,
    callbackDown: HotKeyHandler,
    callbackUp?: HotKeyHandler,
    options?: Options
): React.MutableRefObject<T | null>
export function useHotkeys<T extends Element>(
    keys: string,
    callbackDown: HotKeyHandler,
    callbackUp?: HotKeyHandler,
    deps?: any[]
): React.MutableRefObject<T | null>
export function useHotkeys<T extends Element>(
    keys: string,
    callbackDown: HotKeyHandler,
    callbackUp?: HotKeyHandler,
    options?: Options,
    deps?: any[]
): React.MutableRefObject<T | null>
export function useHotkeys<T extends Element>(
    keys: string,
    callbackDown: HotKeyHandler,
    callbackUp?: any[] | Options | HotKeyHandler,
    options: any[] | Options = {},
    deps?: any[]
): React.MutableRefObject<T | null> {
    if (callbackUp && typeof callbackUp !== 'function') {
        if (callbackUp instanceof Array) {
            deps = callbackUp
            options = {}
        } else {
            if (options instanceof Array) {
                deps = options
            }
            options = callbackUp
        }
    }

    if (options instanceof Array) {
        deps = options
        options = {}
    }

    const {
        enableOnTags,
        filter,
        keyup,
        keydown,
        filterPreventDefault = true,
        enabled = true,
        enableOnContentEditable = false,
        splitKey = '+'
    } = (options as Options) || {}
    const ref = useRef<T | null>(null)
    const modifier: string[] = []
    let isArrows = false

    if (keys.startsWith(`*${splitKey}`)) {
        keys.split(',').forEach((key) =>
            modifier.push(key.replace(`*${splitKey}`, '').replace(/\s/, ''))
        )

        keys = '*'
    }

    const keyArrows: string[] = []
    if (keys.includes('arrows')) {
        keys.split(',').forEach((key) => {
            if (key.endsWith('arrows')) {
                const meta = key.replace('arrows', '')
                keyArrows.push(`${meta}up,${meta}down,${meta}left,${meta}right`)
                isArrows = true
            } else {
                keyArrows.push(key)
            }
        })
        keys = keyArrows.join(',')
    }

    const memoisedCallback = useCallback(
        (keyboardEvent: KeyboardEvent, hotkeysEvent: HotKeysEvent & any) => {
            hotkeysEvent.isPressed = hotkeys.isPressed

            if (filter && !filter(keyboardEvent)) {
                return !filterPreventDefault
            }

            if (
                (isKeyboardEventTriggeredByInput(keyboardEvent) &&
                    !tagFilter(keyboardEvent, enableOnTags)) ||
                ((keyboardEvent.target as HTMLElement)?.isContentEditable &&
                    !enableOnContentEditable)
            ) {
                return true
            }

            if (isArrows) {
                const point = getDeltaArrow(keyboardEvent)
                hotkeysEvent.delta = point
            }

            if (
                ref.current === null ||
                document.activeElement === ref.current
            ) {
                if (keyboardEvent.type === 'keydown') {
                    if (
                        !modifier.length ||
                        intersectionWith(
                            modifier,
                            Object.keys(hotkeys),
                            (a) => {
                                return hotkeys[a]
                            }
                        ).length
                    ) {
                        const response = callbackDown(
                            keyboardEvent,
                            hotkeysEvent
                        )
                        if (response !== undefined) {
                            return response
                        }
                    }
                }
                if (
                    keyboardEvent.type === 'keyup' &&
                    typeof callbackUp === 'function'
                )
                    if (
                        !modifier.length ||
                        intersectionWith(
                            modifier,
                            Object.keys(hotkeys),
                            (a) => {
                                return hotkeys[a]
                            }
                        ).length
                    ) {
                        const response = callbackUp(keyboardEvent, hotkeysEvent)
                        if (response !== undefined) {
                            return response
                        }
                    }

                return true
            }

            return false
        },
        deps
            ? [ref, enableOnTags, filter, ...deps]
            : [ref, enableOnTags, filter]
    )

    useEffect(() => {
        if (!enabled) return null

        if (keyup && keydown !== true) {
            ;(options as Options).keydown = false
        }

        if (callbackDown) {
            ;(options as Options).keydown = true
        }
        if (typeof callbackUp === 'function') {
            ;(options as Options).keyup = true
        }
        hotkeys(keys, (options as Options) || {}, memoisedCallback)

        return () => hotkeys.unbind(keys, memoisedCallback)
    }, [memoisedCallback, options, keys, enabled])

    return ref
}
