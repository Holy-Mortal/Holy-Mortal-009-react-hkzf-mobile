import React from 'react'
import ReactDOM from 'react-dom'

// 导入 antd-mobile 的样式
import 'antd-mobile/dist/antd-mobile.css'

// 导入 react-virtualized 组件的样式文件
import 'react-virtualized/styles.css'

// 导入 字体图标库 的样式文件
import './assets/fonts/iconfont.css'

// 导入 自身的 全局样式（放在组件库样式后）
import './index.css'

// 导入 组件（放置在样式导入后面）
import App from './App'

import './utils/url'

ReactDOM.render(<App />, document.getElementById('root'))
