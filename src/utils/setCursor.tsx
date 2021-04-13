export const setGlobalCursor = (name: string) => {
    const div = document.createElement('div')
    div.style.cssText = `position:fixed; z-index:5000; left:0; top:0; right: 0; bottom:0; cursor: ${name}`
    div.className = 'global-cursor'
    document.body.append(div)
}

export const clearGlobalCursor = () => {
    document.body.querySelector('.global-cursor')?.remove()
}
