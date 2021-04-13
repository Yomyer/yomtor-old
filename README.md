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

## Development

Local development is broken into two parts (ideally using two tabs).

First, run rollup to watch your src/ module and automatically recompile it into dist/ whenever you make changes.

```bash
npm start # runs rollup with watch flag
```

The second part will be running the example/ create-react-app that's linked to the local version of your module.

```bash
# (in another tab)
cd example
npm start # runs create-react-app dev server
```

Now, anytime you make a change to your library in src/ or to the example app's example/src, create-react-app will live-reload your local dev server so you can iterate on your component in real-time.

## License

MIT © [Yomyer](https://github.com/Yomyer)
