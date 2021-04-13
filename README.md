# yomtor

> Made with create-react-library

[![NPM](https://img.shields.io/npm/v/yomtor.svg)](https://www.npmjs.com/package/yomtor) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save yomtor
```

## Usage

```tsx
import React, { Component } from 'react'

import {
    AligmentProperties,
    Canvas,
    Properties,
    RectProperties,
    Yomtor,
    Zoom,
    Color,
    YomtorRectangle,
    FabricContext
} from 'yomtor'

class Example extends Component {
  render() (
      <Yomtor settings={settings}>
        <Properties>
            <AligmentProperties></AligmentProperties>
            <RectProperties></RectProperties>
        </Properties>

        <Toolbar>
            <ButtonTest></ButtonTest>
        </Toolbar>
        <Canvas>
            <Zoom></Zoom>
        </Canvas>
      </Yomtor>
  )
}
```

## License

MIT © [Yomyer](https://github.com/Yomyer)
