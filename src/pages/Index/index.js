import React from 'react'

// 导入组件
import { Carousel, Flex, Grid, WingBlank } from 'antd-mobile'
// 导入 axios
import axios from 'axios'
import { BASE_URL } from '../../utils/url'
// 导入导航菜单图片
import Nav1 from '../../assets/images/nav-1.png'
import Nav2 from '../../assets/images/nav-2.png'
import Nav3 from '../../assets/images/nav-3.png'
import Nav4 from '../../assets/images/nav-4.png'

// 导入 组件自身的 样式文件
import './index.scss'

// 导入 utils 中获取定位城市的方法
import { getCurrentCity } from '../../utils'

// 导航菜单数据
const navs = [
  {
    id: 1,
    img: Nav1,
    title: '整租',
    path: '/home/list'
  }, {
    id: 2,
    img: Nav2,
    title: '合租',
    path: '/home/list'
  }, {
    id: 3,
    img: Nav3,
    title: '地图找房',
    path: '/map'
  }, {
    id: 4,
    img: Nav4,
    title: '去出租',
    path: '/rent'
  }
]

// 获取地理位置信息
// position对象表示当前位置信息  latitude: 维度  longitude: 经度  altitude: 海拔高度
// accuracy: 经纬度的精度  altitudeAccuracy: 海拔高度的精度  heading: 设备行进方向  speed: 速度
// navigator.geolocation.getCurrentPosition(position => {
//   console.log('当前地理位置：', position)
// })

export default class Index extends React.Component {
  state = {
    swipers: [], // 轮播图状态数据
    isSwiperLoaded: false, // 表示轮播图数据加载是否完成
    groups: [], // 租房小组数据
    news: [], // 最新资讯
    curCityName: '上海' // 当前城市名称
  }

  // 获取轮播图数据的方法
  async getSwipers() {
    const res = await axios.get('http://localhost:8080/home/swiper')
    this.setState(() => {
      return {
        swipers: res.data.body,
        isSwiperLoaded: true // 轮播图数据加载完成
      }
    })
  }

  // 获取租房小组数据的方法
  async getGroups() {
    const res = await axios.get('http://localhost:8080/home/groups', {
      params: {
        area: 'AREA%7C88cff55c-aaa4-e2e0'
      }
    })
    // console.log(res)
    this.setState(() => {
      return {
        groups: res.data.body,
      }
    })
  }

  // 获取最新资讯数据的方法
  async getNews() {
    const res = await axios.get('http://localhost:8080/home/news', {
      params: {
        area:'AREA%7C88cff55c-aaa4-e2e0'
      }
    })
    // console.log(res)
    this.setState(() => {
      return {
        news: res.data.body,
      }
    })
  }

  async componentDidMount() {
    this.getSwipers()
    this.getGroups()
    this.getNews()

    // 通过 IP 定位获取当前城市名称
    // const curCity = new window.BMapGL.LocalCity()
    // curCity.get(async res => {
    //   // console.log('当前城市：', res.name)
    //   const result = await axios.get(`http://localhost:8080/area/info?name=${res.name}`)
    //   // console.log(result)
    //   this.setState(() => {
    //     return {
    //       curCityName: result.data.body.label
    //     }
    //   })
    // })

    const curCity = await getCurrentCity()
    this.setState(() => {
      return {
        curCityName: curCity.label
      }
    })
  }

  // 渲染轮播图结构
  renderSwipers() {
    return this.state.swipers.map(item => (
      <a
        key={item.id}
        href="https://github.com/Holy-Mortal/Holy-Mortal-009-react-hkzf-mobile"
        style={{
          display: 'inline-block',
          width: '100%',
          height: 212
        }}
      >
        <img
          src={BASE_URL + item.imgSrc}
          alt=""
          style={{ width: '100%', verticalAlign: 'top' }}
        />
      </a>
    ))
  }

  // 渲染导航菜单
  renderNavs() {
    return navs.map(item => (
      <Flex.Item
        key={item.id}
        onClick={() => this.props.history.push(item.path)}
      >
        <img src={item.img} alt="" />
        <h2>{item.title}</h2>
      </Flex.Item>
    ))
  }

  // 渲染最新资讯
  renderNews() {
    return this.state.news.map(item => (
      <div className="news-item" key={item.id}>
        <div className="imgwrap">
          <img
            className="img"
            src={`http://localhost:8080${item.imgSrc}`}
            alt=""
          />
        </div>
        <Flex className="content" direction="column" justify="between">
          <h3 className="title">{item.title}</h3>
          <Flex className="info" justify="between">
            <span>{item.from}</span>
            <span>{item.date}</span>
          </Flex>
        </Flex>
      </div>
    ))
  }

  render() {
    return (
      <div className="index">
        {/* 轮播图及搜索框 */}
        <div className="swiper">
          {/* 轮播图 */}
          {
            this.state.isSwiperLoaded ? (
              <Carousel
                autoplay={true} // 轮播图是否自动播放
                infinite={true} // 是否循环播放
                autoplayInterval={2000} // 轮播图自动切换的时间间隔
              >
                {this.renderSwipers()}
              </Carousel>
            ) : (
              ''
            )
          }

          {/* 搜索框 */}
          <Flex className="search-box">
            {/* 左侧白色区域 */}
            <Flex className="search">
              {/* 位置 */}
              <div
                className="location"
                onClick={() => (
                  this.props.history.push('/citylist')
                )}
              >
                <span className="name">{this.state.curCityName}</span>
                <i className="iconfont icon-arrow" />
              </div>
              {/* 搜索表单 */}
              <div
                className="form"
                onClick={() => (
                  this.props.history.push('/search')
                )}
              >
                <i className="iconfont icon-search" />
                <span className="text">请输入小区或地址</span>
              </div>
            </Flex>
            {/* 右侧地图图标 */}
            <i
              className="iconfont icon-map"
              onClick={() => (
                this.props.history.push('/map')
              )}
            />
          </Flex>
        </div>

        {/* 导航菜单 */}
        <Flex className="nav">
          {this.renderNavs()}
        </Flex>

        {/* 租房小组 */}
        <div className="group">
          <h3 className="group-title">
            租房小组 <span className="more">更多</span>
          </h3>
          {/* 宫格组件 */}
          <Grid
            data={this.state.groups}
            columnNum={2} // 宫格列数
            square={false} // 宫格是否为正方形
            hasLine={false} // 宫格是否有边框
            renderItem={(item) => (
              <Flex className="group-item" justify="around" key={item.id}>
                <div className="desc">
                  <p className="title">{item.title}</p>
                  <span className="info">{item.desc}</span>
                </div>
                <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
              </Flex>
            )}
          />
        </div>

        {/* 最新资讯 */}
        <div className="news">
          <h3 className="group-title">最新资讯</h3>
          <WingBlank size="md">{this.renderNews()}</WingBlank>
        </div>
      </div>
    )
  }
}
