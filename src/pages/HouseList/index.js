import React from 'react'

// 导入 组件
import { Flex, Toast } from 'antd-mobile'

// 导入 List组件
import { List, AutoSizer, WindowScroller, InfiniteLoader } from 'react-virtualized'

// 导入 axios
import { API } from '../../utils/api'
import { BASE_URL } from '../../utils/url'
import { getCurrentCity } from '../../utils'

// 导入 搜索导航栏组件
import SearchHeader from '../../components/SearchHeader'
import Filter from './components/Filter'
import HouseItem from '../../components/HouseItem'

// 导入 吸顶组件
import Sticky from '../../components/Sticky'
import NoHouse from '../../components/NoHouse'

// 导入 组件自身的样式文件
import styles from './index.module.css'



// 获取当前定位城市信息
// const { label, value } = JSON.parse(localStorage.getItem('hkzf_city'))

export default class HouseList extends React.Component {
  state = {
    // 列表数据
    list: [],
    // 总条数
    count: 0,
    // 数据加载中
    isLoading: false
  }

  // 初始化默认值
  label = ''
  value = ''
  
  // 初始化实例属性
  filters = {}

  async componentDidMount() {
    const { label, value } = await getCurrentCity()
    this.label = label
    this.value = value
    this.searchHouseList()
  }

  // 用来获取房屋列表数据
  async searchHouseList() {
    // 获取当前定位城市 id
    this.setState({
      isLoading: true
    })

    // 开启 loading
    Toast.loading('加载中...', 0, null, false)

    // 获取当前定位城市 id
    // const { value } = JSON.parse(localStorage.getItem('hkzf_city'))
    const res = await API.get('/houses', {
      params: {
        cityId: this.value,
        ...this.filters,
        start: 1,
        end: 20
      }
    })
    const { list, count } = res.data.body

    // 关闭 loading
    Toast.hide()

    // 提示房源数量
    // 解决了没有房源数据时，也弹窗提示的 bug
    if(count !== 0) {
      Toast.info(`共找到 ${count} 套房源`, 2, null, false)
    }

    this.setState(() => {
      return {
        list,
        count,
        isLoading: false // 数据加载完成的状态
      }
    })
  }

  // 接收 Filter 组件中的筛选条件数据
  onFilter = filters => {
    // 回到页面顶部
    window.scrollTo(0, 0)

    this.filters = filters

    // 调用获取房屋数据的方法
    this.searchHouseList()
  }

  // 渲染房屋列表项
  renderHouseList = ({ key, index, style }) => {
    // 根据索引号获取当前行的房屋数据
    const { list } = this.state
    const house = list[index]

    // 判断 house 是否存在
    // 如果不存在，就渲染 loading 元素占位
    if(!house) {
      return (
        <div key={key} style={style}>
          <p className={styles.loading} />
        </div>
      )
    }

    return (
      <HouseItem
        key={key}
        style={style}
        src={BASE_URL + house.houseImg}
        title={house.title}
        desc={house.desc}
        tags={house.tags}
        price={house.price}
      />
    )
  }

  // 判断列表中的每一行是否加载完成
  isRowLoaded = ({index}) => {
    return !!this.state.list[index]
  }

  // 用来获取更多房屋列表数据
  loadMoreRows = ({startIndex, stopIndex}) => {
    // 注意：该方法的返回值是一个 Promise 对象，并且这个对象应该在数据加载完成时，来调用 resolve 让 Promise 对象的状态变为已完成
    // return fetch(`path/to/api?startIndex=${startIndex}&stopIndex=${stopIndex}`)
    //   .then(response => {
    //   })
    return new Promise(resolve => {
      API.get('/houses', {
        params: {
          cityId: this.value,
          ...this.filters,
          start: startIndex,
          end: stopIndex
        }
      }).then(res => {
        this.setState({
          list: [...this.state.list, ...res.data.body.list]
        })
        // 数据加载完成时，调用 resolve
        resolve()
      })
    })
  }

  renderList() {
    const { count, isLoading } = this.state
    // 在数据加载完成后，再进行 count 的判断
    // 数据加载中，不展示 NoHouse 组件；数据加载完成后，展示 NoHouse 组件
    if(count === 0 && !isLoading) {
      return (
        <NoHouse>
          没有找到房源，请您换个搜索条件吧~
        </NoHouse>
      )
    }

    // 房屋列表内容
    return (
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={this.loadMoreRows}
        rowCount={count}
      >
        {({ onRowsRendered, registerChild }) => (
          <WindowScroller>
            {({ height, isScrolling, scrollTop }) => (
              <AutoSizer>
                {({width}) => (
                  <List
                    onRowsRendered={onRowsRendered}
                    ref={registerChild}
                    autoHeight // 设置高度为 WindowScroller 最终渲染的列表高度
                    width={width} // 视口的宽度
                    height={height} // 视口的高度
                    rowCount={count} // List 列表项的行数
                    rowHeight={120} // 每行高度
                    rowRenderer={this.renderHouseList} // 渲染列表项中的每一行
                    isScrolling={isScrolling}
                    scrollTop={scrollTop}
                  />
                )}
              </AutoSizer>
            )}
          </WindowScroller>
        )}
      </InfiniteLoader>
    )
  }

  render() {
    return (
      <div className={styles.root}>
        {/* 顶部搜索导航 */}
        <Flex className={styles.header}>
          <i
            className="iconfont icon-back"
            onClick={() => {
              this.props.history.go(-1)
            }}
          />
          <SearchHeader cityName={this.label} className={styles.searchHeader} />
        </Flex>

        {/* 条件筛选栏 */}
        <Sticky height={40}>
          <Filter onFilter={this.onFilter} />
        </Sticky>

        {/* 房屋列表 */}
        <div className={styles.houseItems}>
          {this.renderList()}
        </div>
      </div>
    )
  }
}
