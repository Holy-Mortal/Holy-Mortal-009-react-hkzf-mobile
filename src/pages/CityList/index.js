import React from 'react'

// 导入 axios
import axios from 'axios'

// 导入 NavBar 组件
import { Toast } from 'antd-mobile'

// 导入 List 组件
import { List, AutoSizer } from 'react-virtualized'

// 导入 utils 中获取当前定位城市的方法
import { getCurrentCity } from '../../utils'

// 导入 component 中的 NavHeader 组件
import NavHeader from '../../components/NavHeader'

// 导入 组件自身的 样式文件
import './index.scss'
// import styles from './index.module.css'

// 数据格式化的方法 list: [{}, {}]
const formatCityData = (list) => {
  const cityList = {} // 渲染城市列表数据格式：{a: [{}, {}], b: [{}, {}, ...]}
  // 1. 遍历 list 数组
  list.forEach(item => {
    // 2. 获取每个城市的首字母
    const first = item.short.substr(0, 1)
    // 3. 判断 cityList 中是否有该分类
    if(cityList[first]) {
      // 4. 如果有，直接往该分类中 push 数据
      // cityList[first] => [{}, {}]
      cityList[first].push(item)
    } else {
      // 5. 如果没有，就先创建一个数组，然后把当前城市信息添加到数组中
      cityList[first] = [item]
    }
  })
  // 获取索引数据  sort() 数组数据排序
  const cityIndex = Object.keys(cityList).sort() // 渲染右侧索引数据格式：['a', 'b']
  return {
    cityList,
    cityIndex
  }
}

// 索引（A、B等）的高度
const TITLE_HEIGHT = 36
// 每个城市名称的高度
const NAME_HEIGHT = 50

// 封装处理字母索引的方法
const formatCityIndex = letter => {
  switch (letter) {
    case '#':
      return '当前定位'
    case 'hot':
      return '热门城市'
    default:
      return letter.toUpperCase()
  }
}

// 有房源的城市
const HOUSE_CITY = ['北京', '上海', '广州', '深圳']


export default class CityList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      cityList: {},
      cityIndex: [], // 数据索引
      activeIndex: 0 // 指定右侧字母索引列表高亮的索引号
    }

    // 创建 ref 对象
    this.cityListComponent = React.createRef()
  }

  async componentDidMount() {
    await this.getCityList()
    // 调用 measureAllRows，提前计算 List 中每行的高度，实现 scrollToRow 的精确跳转
    this.cityListComponent.current.measureAllRows()
  }

  // 获取城市列表数据的方法
  async getCityList() {
    // 1. 获取所有城市数据
    const res = await axios.get('http://localhost:8080/area/city?level=1')
    const { cityList, cityIndex } = formatCityData(res.data.body)
    // 2. 获取热门城市数据
    const hotRes = await axios.get('http://localhost:8080/area/hot')
    // 将热门数据添加到 cityList 中
    cityList['hot'] = hotRes.data.body
    // 将 hot索引 添加到 cityList 中  unshift() 放到数组开头
    cityIndex.unshift('hot')
    // 3. 获取当前定位城市数据
    const curCity = await getCurrentCity()
    // 将当前定位城市数据添加到 cityList 中
    cityList['#'] = [curCity]
    // 将 #索引 添加到 cityList 中  unshift() 放到数组开头
    cityIndex.unshift('#')

    this.setState(() => {
      return {
        cityList,
        cityIndex
      }
    })
  }

  changeCity({ label, value }) {
    if(HOUSE_CITY.indexOf(label) > -1) {
      // 房源数据获取成功
      localStorage.setItem('hkzf_city', JSON.stringify({ label, value }))
      this.props.history.go(-1)
    } else {
      Toast.info('该城市暂无房源数据', 1, null, false)
    }
  }

  // List 组件渲染每一行的方法
  rowRenderer = ({
    key, // Unique key within array of rows
    index, // 数据的索引号
    isScrolling, // 当前项是否正在滚动
    isVisible, // 当前项在 List 中可见
    style, // 必须添加，指定每行位置
  }) => {
    // 获取每一行的字母索引
    const { cityIndex, cityList } = this.state
    const letter = cityIndex[index]

    // 获取指定字母索引下的城市列表数据
    return (
      <div key={key} style={style} className="city">
        <div className="title">{formatCityIndex(letter)}</div>
        {cityList[letter].map(item => (
          <div
            className="name"
            key={item.value}
            onClick={() => {
              this.changeCity(item)
            }}
          >
            {item.label}
          </div>
        ))}
      </div>
    )
  }

  // 创建动态计算每一行高度的方法
  getRowHeight = ({ index }) => {
    // 索引标题高度 + 城市数量 + 城市名称的高度
    // TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT
    const { cityIndex, cityList } = this.state
    return TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT
  }

  // 封装渲染右侧索引列表的方法
  renderCityIndex() {
    // 获取到 cityIndex，并遍历实现渲染
    const {cityIndex, activeIndex} = this.state
    return cityIndex.map((item, index) => (
      <li
        className="city-index-item"
        key={item}
        onClick={() => {
          // console.log('当前索引号', index)
          this.cityListComponent.current.scrollToRow(index)
        }}
      >
        <span className={activeIndex === index ? 'index-active' : ''}>
          {item === 'hot' ? '热' : item.toUpperCase()}
        </span>
      </li>
    ))
  }

  // 用于获取 List 组件中渲染行的信息
  onRowsRendered = ({ startIndex }) => {
    // console.log('startIndex', startIndex)
    if(this.state.activeIndex !== startIndex) {
      this.setState(() => {
        return {
          activeIndex: startIndex
        }
      })
    }
  }

  render() {
    return (
      <div className="citylist">
        {/* 顶部导航栏 */}
        <NavHeader>城市选择</NavHeader>

        {/* 城市列表 */}
        <AutoSizer>
          {({ width, height }) => (
            <List
              ref={this.cityListComponent}
              width={width}
              height={height}
              rowCount={this.state.cityIndex.length}
              rowHeight={this.getRowHeight}
              rowRenderer={this.rowRenderer}
              onRowsRendered={this.onRowsRendered}
              scrollToAlignment="start"
            />
          )}
        </AutoSizer>

        {/* 右侧索引列表 */}
        <ul className="city-index">
          {this.renderCityIndex()}
        </ul>
      </div>
    )
  }
}
