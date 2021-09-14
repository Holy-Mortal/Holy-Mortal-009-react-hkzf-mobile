import React from 'react'

// 导入 组件自身的 样式文件
import './index.scss'

export default class Map extends React.Component {
  componentDidMount() {
    // 创建初始化地图实例
    const map = new window.BMapGL.Map('container')
    // 设置中心点坐标
    const point = new window.BMapGL.Point(116.404, 39.915)
    // 初始化地图
    map.centerAndZoom(point, 15)
  }

  render() {
    return (
      <div className="map">
        {/* 地图容器元素 */}
        <div id="container"></div>
      </div>
    )
  }
}
