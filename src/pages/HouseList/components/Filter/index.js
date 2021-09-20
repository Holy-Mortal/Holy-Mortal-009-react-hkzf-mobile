import React, { Component } from 'react'

// 导入 String组件
import {Spring} from 'react-spring'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

// 导入 自定义的 axios
import { API } from '../../../../utils/api'

import styles from './index.module.css'

// 标题高亮状态
// true 表示高亮； false 表示不高亮
const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false
}

// FilterPicker 和 FilterMore 组件的选中值
const selectedValues = {
  area: ['area', 'null'],
  mode: ['null'],
  price: ['null'],
  more: []
}

export default class Filter extends Component {
  state = {
    titleSelectedStatus,
    // 控制 FilterPicker 或 FilterMore 组件的展示或隐藏
    openType: '',
    // 所有筛选条件数据
    filtersData: {
      // FilterMore
      roomType: [],
      oriented: [],
      floor: [],
      characteristic: [],
      // FilterPicker
      area: {},
      subway: {},
      rentType: [],
      price: []
    },
    // 筛选条件的选中值
    selectedValues
  }

  componentDidMount() {
    // 获取到 body
    this.htmlBody = document.body
    this.getFiltersData()
  }

  // 封装获取所有筛选条件的方法
  async getFiltersData() {
    // 获取当前定位城市 id
    const { value } = JSON.parse(localStorage.getItem('hkzf_city'))
    const res = await API.get(`/houses/condition?id=${value}`)
    this.setState(() => {
      return {
        filtersData: res.data.body
      }
    })
  }

  // 点击标题菜单实现高亮 注意：this指向问题
  // 说明：要实现完整的功能，需要后续的组件配合完成
  onTitleClick = type => {
    // 给 body 添加样式
    this.htmlBody.className = 'body-fixed'

    const { titleSelectedStatus, selectedValues } = this.state

    // 创建新的标题选中状态对象
    const newTitleSelectedStatus = {...titleSelectedStatus}

    // 遍历标题选中状态对象 Object.keys() => ['area', 'mode', 'price', 'more']
    Object.keys(titleSelectedStatus).forEach(key => {
      // key 表示数组中的每一项，此处就是每个标题的 type 值
      if(key === type) {
        // 当前标题
        newTitleSelectedStatus[type] = true
        return
      }
      // 其他标题
      const selectedVal = selectedValues[key]
        
      
      if(key === 'area' && (selectedVal.length !== 2 || selectedVal[0] !== 'area')) {
        // 如果 type 为 area，此时，selectedVal.length !== 2 || selectedVal[0] !== 'area'，表示已有选中值
        newTitleSelectedStatus[key] = true // 高亮
      } else if(key === 'mode' && selectedVal[0] !== 'null') {
        // 如果 type 为 mode，此时，selectedVal[0] !== 'null'，表示已有选中值
        newTitleSelectedStatus[key] = true // 高亮
      } else if(key === 'price' && selectedVal[0] !== 'null') {
        // 如果 type 为 price，此时，selectedVal[0] !== 'null'，表示已有选中值
        newTitleSelectedStatus[key] = true // 高亮
      } else if(key === 'more' && selectedVal.length !== 0) {
        // 如果 type 为 price，此时，selectedVal.length !== 0，表示已有选中值
        newTitleSelectedStatus[key] = true // 高亮
      } else {
        newTitleSelectedStatus[key] = false
      }
    })

    this.setState(() => {
      return {
        // 展示对话框
        openType: type,
        // 使用新的标题选中状态对象来更新
        titleSelectedStatus: newTitleSelectedStatus
      }
    })
    // this.setState(prevState => {
    //   return {
    //     titleSelectedStatus: {
    //       // 获取当前对象中所有属性的值
    //       ...prevState.titleSelectedStatus,
    //       [type]: true
    //     },
    //     // 展示对话框
    //     openType: type
    //   }
    // })
  }

  // 取消（影藏对话框）
  onCancel = type => {
    this.htmlBody.className = ''

    const { titleSelectedStatus, selectedValues } = this.state
    // 创建新的标题选中状态对象
    const newTitleSelectedStatus = {...titleSelectedStatus}

    // 菜单高亮逻辑处理
    // 其他标题
    const selectedVal = selectedValues[type]
    if(type === 'area' && (selectedVal.length !== 2 || selectedVal[0] !== 'area')) {
      // 如果 type 为 area，此时，selectedVal.length !== 2 || selectedVal[0] !== 'area'，表示已有选中值
      newTitleSelectedStatus[type] = true // 高亮
    } else if(type === 'mode' && selectedVal[0] !== 'null') {
      // 如果 type 为 mode，此时，selectedVal[0] !== 'null'，表示已有选中值
      newTitleSelectedStatus[type] = true // 高亮
    } else if(type === 'price' && selectedVal[0] !== 'null') {
      // 如果 type 为 price，此时，selectedVal[0] !== 'null'，表示已有选中值
      newTitleSelectedStatus[type] = true // 高亮
    } else if(type === 'more' && selectedVal.length !== 0) {
      // 如果 type 为 price，此时，selectedVal.length !== 0，表示已有选中值
      newTitleSelectedStatus[type] = true // 高亮
    } else {
      newTitleSelectedStatus[type] = false
    }

    this.setState(() => {
      // 隐藏对话框
      return {
        openType: '',

        // 更改菜单高亮状态数据
        titleSelectedStatus: newTitleSelectedStatus,
      }
    })
  }

  // 确定（隐藏对话框）
  onSave = (type, value) => {
    this.htmlBody.className = ''

    const { titleSelectedStatus } = this.state
    // 创建新的标题选中状态对象
    const newTitleSelectedStatus = {...titleSelectedStatus}

    // 菜单高亮逻辑处理
    // 其他标题
    const selectedVal = value
    if(type === 'area' && (selectedVal.length !== 2 || selectedVal[0] !== 'area')) {
      // 如果 type 为 area，此时，selectedVal.length !== 2 || selectedVal[0] !== 'area'，表示已有选中值
      newTitleSelectedStatus[type] = true // 高亮
    } else if(type === 'mode' && selectedVal[0] !== 'null') {
      // 如果 type 为 mode，此时，selectedVal[0] !== 'null'，表示已有选中值
      newTitleSelectedStatus[type] = true // 高亮
    } else if(type === 'price' && selectedVal[0] !== 'null') {
      // 如果 type 为 price，此时，selectedVal[0] !== 'null'，表示已有选中值
      newTitleSelectedStatus[type] = true // 高亮
    } else if(type === 'more' && selectedVal.length !== 0) {
      // 如果 type 为 price，此时，selectedVal.length !== 0，表示已有选中值
      newTitleSelectedStatus[type] = true // 高亮
    } else {
      newTitleSelectedStatus[type] = false
    }

     /* 
      组装筛选条件：

      1 在 Filter 组件的 onSave 方法中，根据最新 selectedValues 组装筛选条件数据 filters。
      2 获取区域数据的参数名：area 或 subway（选中值数组的第一个元素）。
      3 获取区域数据的值（以最后一个 value 为准）。
      4 获取方式和租金的值（选中值的第一个元素）。
      5 获取筛选（more）的值（将选中值数组转化为以逗号分隔的字符串）。

      {
        area: 'AREA|67fad918-f2f8-59df', // 或 subway: '...'
        mode: 'true', // 或 'null'
        price: 'PRICE|2000',
        more: 'ORIEN|80795f1a-e32f-feb9,ROOM|d4a692e4-a177-37fd'
      }
    */

    const newSelectedValues = {
      ...this.state.selectedValues,
      // 只更新当前 type 对应的选中值
      [type]: value
    }

    const { area, mode, price, more } = newSelectedValues

    // 筛选条件数据
    const filters = {}

    // 区域
    const areaKey = area[0]
    let areaValue = 'null'
    if(area.length === 3) {
      areaValue = area[2] !== 'null' ? area[2] : area[1]
    }
    filters[areaKey] = areaValue

    // 方式和租金
    filters.mode = mode[0]
    filters.price = price[0]

    // 更多筛选条件 more
    filters.more = more.join(',')

    // 调用父组件中的方法，来将筛选数据传递给父组件
    this.props.onFilter(filters)

    this.setState(() => {
      // 隐藏对话框
      return {
        openType: '',

        // 更改菜单高亮状态数据
        titleSelectedStatus: newTitleSelectedStatus,

        selectedValues: newSelectedValues
      }
    })
  }

  // 渲染 FilterPicker 组件的方法
  renderFilterPicker() {
    const {
      openType,
      filtersData: { area, subway, rentType, price },
      selectedValues
    } = this.state

    if(openType !== 'area' && openType !== 'mode' && openType !== 'price') {
      return null
    }

    // 根据 openType 来拿到当前筛选条件数据
    let data = []
    let cols = 3
    let defaultValue = selectedValues[openType]
    switch (openType) {
      case 'area':
        // 获取到区域数据
        data = [area, subway]
        cols = 3
        break;
      case 'mode':
        data = rentType
        cols = 1
        break;
      case 'price':
        data = price
        cols = 1
        break;
      default:
        break;
    }

    return (
      <FilterPicker
        key={openType}
        onCancel={this.onCancel}
        onSave={this.onSave}
        data={data}
        cols={cols}
        type={openType}
        defaultValue={defaultValue}
      />
    )
  }


  renderFilterMore() {
    const {
      openType,
      selectedValues,
      filtersData: {
        roomType,
        oriented,
        floor,
        characteristic
      }
    } = this.state

    if(openType !== 'more') {
      return null
    }

    const data = {
      roomType,
      oriented,
      floor,
      characteristic
    }

    const defaultValue = selectedValues.more

    return (
      <FilterMore
        data={data}
        type={openType}
        onSave={this.onSave}
        onCancel={this.onCancel}
        defaultValue={defaultValue}
      />
    )
  }

  // 渲染遮罩层
  renderMask() {
    const { openType } = this.state
    // 遮罩层是否隐藏
    // const isHide = openType === 'more' || openType === ''

    if(openType === 'more' || openType === '') {
      return null
    }

    return (
      <Spring
        from={{ opacity: 0 }}
        to={{ opacity: 1 }}
        // to={{ opacity: isHide ? 0 : 1 }}
      >
        {props => {
          // 说明遮罩层已经完成动画效果
          if(props.opacity === 0) {
            return null
          }
          // props => {opacity: 0} 从 0 到 1 的中间值
          return (
            <div
              style={props}
              className={styles.mask}
              onClick={() =>
                this.onCancel(openType)
              }
            />
          )
        }}
      </Spring>
    )
  }

  render() {
    const { titleSelectedStatus } = this.state

    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {this.renderMask()}

        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle
            titleSelectedStatus={titleSelectedStatus}
            onClick={this.onTitleClick}
          />

          {/* 前三个菜单对应的内容： */}
          {this.renderFilterPicker()}

          {/* 最后一个菜单对应的内容： */}
          {this.renderFilterMore()}
        </div>
      </div>
    )
  }
}
