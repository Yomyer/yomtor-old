import React from 'react'

export const createObjectTool = (path: JSX.Element, displayName: string) => {
    const Component = (props: any, ref: any) => (
        
    )

    if (process.env.NODE_ENV !== 'production') {
        // Need to set `displayName` on the inner component for React.memo.
        // React prior to 16.14 ignores `displayName` on the wrapper.
        Component.displayName = `${displayName}Icon`
    }

    return React.memo(React.forwardRef(Component))
}
