import React, { Component } from 'react'

import { PickerView } from 'antd-mobile'

import FilterFooter from '../../../../components/FilterFooter'

export default class FilterPicker extends Component {
  // constructor(props) {
  //   super()

  //   this.state = {
  //     value: this.props.defaultValue
  //   }
  // }
  state = {
    value: this.props.defaultValue
  }

  render() {
    const { onCancel, onSave, data, cols, type } = this.props
    const { value } = this.state

    return (
      <>
        {/* 选择器组件： */}
        {/* 注意：必须设置组件 value 属性的值，为当前选中状态的值，否则无法实现切换选中项 */}
        <PickerView
          data={data}
          value={value}
          cols={cols}
          onChange={val => {
            this.setState(() => {
              return {
                value: val
              }
            })
          }}
        />

        {/* 底部按钮 */}
        <FilterFooter
          onCancel={() => onCancel(type)}
          onOk={() => onSave(type, value)}
        />
      </>
    )
  }
}
