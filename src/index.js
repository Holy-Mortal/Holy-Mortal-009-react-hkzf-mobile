import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'

// 导入 antd-mobile 的样式
import 'antd-mobile/dist/antd-mobile.css'

// 导入 字体图标库 的样式文件
import './assets/fonts/iconfont.css'

// 导入 自身的 全局样式（放在组件库样式后）
import './index.css'

ReactDOM.render(<App />, document.getElementById('root'))
