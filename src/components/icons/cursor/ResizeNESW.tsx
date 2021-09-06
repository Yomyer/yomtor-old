import { Cursor } from '../../../utils/cursorUtils'

export const ResizeNESW: Cursor = {
    name: 'resize-nesw',
    cursor1x:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAAHeEJUAAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAFaADAAQAAAABAAAAFQAAAAAIGxIOAAADkklEQVQ4Ea1UXUiTYRTe/9yQ2szZNGLYhSUiZKSBjKnB8KIbJUIINAsCp952rzdCrNyFggNbXi2ROV0Ekc0kKQgmNYeoubX8m4J/YwxlP9q+nvNt33DaxIsOPN/7vud93vOe75zzHh7vmPBpPjk5GQmHwwKaSwYHB+M0OS1SqZSBVkQ7NGH5tEiLzWaLYpFmCQcGBmJ0bHt7O4INIceka1WAglOcaywAi/H5fFOs11jIEonE/uzs7JxIJJrjra+vfwuFQsF9CDbJtkAEhlqhUCixuAiEAVbk+JK9tEtJ9emveHNz88vW1pZ/d3c3YLfbNaBw92ewyZIyGAyGUnFiFhYWnNCJORYRKHj5RxCBQMBEIFjfBG4DV4FkDpaXl71YMGKxmPF4PG7M7wDXAQmQFrKWaGlpeTozM/M8DoGvv6HzAcE0639M+IuLizWIwtLOzs4qIvEBRtlCOGlcBH/f0s9hg2lubqZRebJSaM0fGhoyt7e3J0DmSSTsf0mOEwWBQMBosVj2ZTLZu4aGhsP5+flfer3+CIcTdDeR2fT19/e7SktLBUqlkt/Z2fnwJwR7OcABkXLb2triKMGfKAyrRqNJVFVVxbu7uwuxR3H2AJQIXmFdXR3ruNPpjMnl8nvQUXbygYycF2m1WpaIDQaheYORXMogkSLW09NjR3UWoQ4jHR0dZjqQAoak0Cn6kQsAVUsCOAC4t4RpUjLMc8osI3Hp5wknz9EFhFOeQJdVWA83NjaWDAYDU11dzVRWVjIVFRVMeXk5Y7VaY9h7hdP0sujScwnFSFVcXKzz+/3e4eFhaj2cV0xraysFdwo6eqris6wKu7q6FHt7e6a1tTXjyMjILbfb7TCZTNdgRIx0xqGLC4VCttSQjCw9DtekhH5X6XK5XoyPj0epoI1G4yEaXGR6ejqKIv+OsryvVqsfTExM2LD+3NjYWENnACFXniKv16sHyYL2+gPN0JCXl3elpKTkyejoqMhsNkdR+OKmpqacsbGxGLx6j47wldpCfX39p5QjVAUxgBLGlkcB2sMCHgIbp76+vjhq/oiaDvp4FL/tVqlUj2H8ZW9v7zOcuQHkAlnDR2+vaGVlxa/T6dLBh47Bw4rjFa7W1tZqsb4MUBMlY3Qmq0GqNyJcQvZeIwR3HQ6HBK+Ah4bGoxHlc4iy+VhWVvYIvBDwBzhTuIKmZ029nSBNneC8pqySMUI6ZinOP4e/F/uFba/NJ2kAAAAASUVORK5CYII=',
    cursor2x:
        'data:image/png;base64,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',
    offset: { x: 10.5, y: 10.5 },
    keyword: 'nesw-resize'
}