import React from 'react'
import { Route } from 'react-router-dom' // 导入路由

// 导入 TabBar
import { TabBar } from 'antd-mobile'
// 导入 组件自身的 样式文件
import './index.scss'

import Index from '../Index' // 导入 Index 组件
import HouseList from '../HouseList' // 导入 HouseList 组件
import News from '../News' // 导入 News 组件
import Profile from '../Profile' // 导入 Profile 组件

const tabItems = [
  {
    title: '首页',
    icon: 'icon-ind',
    path: '/home'
  }, {
    title: '找房',
    icon: 'icon-findHouse',
    path: '/home/list'
  }, {
    title: '咨询',
    icon: 'icon-infom',
    path: '/home/news'
  }, {
    title: '我的',
    icon: 'icon-my',
    path: '/home/profile'
  }
]

export default class Home extends React.Component {
  state = {
    // 默认选中的 TabBar 菜单栏
    selectedTab: this.props.location.pathname
  }
  
  // 生命周期钩子函数监听 路由切换 prevProps：上一次路由信息 this.props：最新信息
  componentDidUpdate(prevProps) {
    if(prevProps.location.pathname !== this.props.location.pathname) {
      // 路由发生切换
      this.setState(() => {
        return {
          selectedTab: this.props.location.pathname
        }
      })
    }
  }

  // 渲染 TabBar.Item
  renderTabBarItem() {
    return tabItems.map(item => 
      <TabBar.Item
        title={item.title}
        key={item.title}
        icon={<i className={`iconfont ${item.icon}`} />}
        selectedIcon={<i className={`iconfont ${item.icon}`} />}
        selected={this.state.selectedTab === item.path}
        onPress={() => {
          this.setState({
            selectedTab: item.path
          })
          // 路由切换
          this.props.history.push(item.path)
        }}
      />
    )
  }

  render() {
    return (
      <div className="home">
        {/* 渲染子路由 */}
        <Route exact path="/home" component={Index} />
        <Route path="/home/list" component={HouseList} />
        <Route path="/home/news" component={News} />
        <Route path="/home/profile" component={Profile} />

        {/* TabBar */}
        <TabBar tintColor="#21b97a" noRenderContent={true} barTintColor="white">
          {this.renderTabBarItem()}
        </TabBar>
      </div> 
    )
  }
}
