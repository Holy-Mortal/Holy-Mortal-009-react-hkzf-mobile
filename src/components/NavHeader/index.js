import React from 'react'

// 导入 NavBar 组件
import { NavBar } from 'antd-mobile'

// 导入 withRouter 高阶组件
import { withRouter } from 'react-router-dom'

// 导入 props 校验的包
import PropTypes from 'prop-types'

// 导入 组件自身的 样式文件
// import './index.scss'
import styles from './index.module.css'

// 添加 className 和 rightContent (导航栏右侧内容) 属性
function NavHeader({
  children,
  history,
  onLeftClick,
  className,
  rightContent
}) {
  // 默认点击行为
  const defaultHandler = () => history.go(-1)
  return (
    // 顶部导航栏
    <NavBar
      className={[styles.navBar, className || ''].join(' ')}
      mode="light"
      icon={<i className="iconfont icon-back" />}
      onLeftClick={onLeftClick || defaultHandler}
      rightContent={rightContent}
    >
      {children}
    </NavBar>
  )
}

// 添加 props 校验
NavHeader.propTypes = {
  children: PropTypes.string.isRequired,
  onLeftClick: PropTypes.func,
  className: PropTypes.string,
  rightContent: PropTypes.array
}

// withRouter(NavHeader) 函数的返回值是一个数组
export default withRouter(NavHeader)
