import { Cursor } from '../../../utils/cursorUtils'

export const RotateNE: Cursor = {
    name: 'rotate-ne',
    cursor1x:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAAHeEJUAAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAFaADAAQAAAABAAAAFQAAAAAIGxIOAAADbklEQVQ4EZVUT0iTYRj/NrdpmrNZq1XO/UGkPEhm6sS0SxjaIZQMPHjxkl6kiwcrRAJBlESTlA5mhxFkdgsPHgZ6EURyYooEE3HpnLr1R8vNTb9+v+mmn06rB57vff59v/d5nvd5X0HYJdneKihfgqDIw4ZYt9vtoRIJEdrb27e0Wq0YDhE6OzsDUOQxDLNarX6j0fhpdHTUAX0/CkocON7r9a5OTk62MRgsIRW0yNb0SBShqqrKBCMxT9FLkq+url6lMD8/7x0ZGamlHAY+jyxKWltb3ygUirN0hCgnJ+c2BMJc3rXsf+P3RWCXl5df9Pl8fhhPH3QcllUI2oKRkCFua2sLTExMPIGuOBxMPSE7O7sYmfsgXwFnzszM+MbGxn5BPnGnpIGBAf4U2WlqasoKnb2PSgmFhYV37Ha7DV4z+EggWyxtcxQcldPptM3Nzb2PhhCOV7lcrs8ymUwMBoPbMJ4DH62+qanpmlwujxSQnp4ubmxsbCJYDQ4fHURB0C4tLbmwhhBRxHhBQYGIXRgsaROrMjocji+Ygs+QUwYHB18xlaGhoYfQJQUyWEM2m81JmJAX1dXV4srKinN2dvYR7EqwhGLGx8efEw3WEHd1dXHiCSIhJn8JrVrAKtbX1wdLS0vvQebgHyGmYQDyx4qKijLIkoIOR7MAziZvSFRiABOPb25uvoCVF4TNl/QT+j8RwWIx/IbFxUV7f3+/Ly4uTgwEAkGTyWSgD/xfwMzkDMH6+vp4myKdRP1+j8ez+R2E83vb0dGRCT+zZ3+O3YSAMRqNRo1R0mBKmHGE1Gq1DOe6Mzw8nIijqtTr9ZUA9/n9/tcZGRmPEciLFoz8cEAgEHc34t7cxVE6u7u7t/B8iNug5OTkYvhuAfTZ+vq6Py8vTywqKhLxpq2lpaWlwMcDOjZrlpQA1oOv19TUPMA7mgVZC+bp6pRKpWVtbe1HVlaW2NDQsI3b/QF2Hih7HmlJtB2YOe1hVk1PT9ft7Ow8tdlsSlEUZXg6FHhzhNra2iCnOT8/P6DT6d6lpqbW4b/f4BOJG6hzc3NvLCwsOHp6eiQvHnxiY2NjYHl52V1WVnYTehKYGf+VCMzyDRaLpeQrqLe3d6ulpSWIVnzDGN6Hz7wXEwKMVj78UYk/sHe8Xol7ETz9n2COIl+qEP0Bg/pXU/lhZ6UAAAAASUVORK5CYII=',
    cursor2x:
        'data:image/png;base64,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',
    offset: { x: 10.5, y: 10.5 },
    keyword: 'alias'
}
