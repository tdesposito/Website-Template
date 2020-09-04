// "hot" is used to wire up the hot-reload features of the dev server, and
// optimizes away to near-nothing in production. Putting it here enables
// hot-reload for your entire application, without you having to do anything to
// your code.

import { hot } from 'react-hot-loader/root'
import React from 'react'
import ReactDOM from 'react-dom'

import './static/css/main.min.css'

// This grabs your default export from Application.js, which should be the root
// component of your application. If you want to change this, be sure to wrap
// whatever your new root component is with "hot"!
import App from './Application.js'

const HotApp = hot(App)
ReactDOM.render(<HotApp />, document.getElementById('react-root'))
