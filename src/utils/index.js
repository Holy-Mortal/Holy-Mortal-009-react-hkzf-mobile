// 导入 axios
import axios from "axios"

// 1. 创建并导出获取定位城市的函数 getCurrentCity
export const getCurrentCity = () => {
  // 判断 localStorage 中是否有定位城市
  const localCity = JSON.parse(localStorage.getItem('hkzf_city'))
  if(!localCity) {
    // 如果没有，就使用首页中获取定位城市的代码来获取，并存储到本地存储中，然后返回该城市数据
    return new Promise((resolve, reject) => {
      const curCity = new window.BMapGL.LocalCity()
      curCity.get(async res => {
        try {
          const result = await axios.get(`http://localhost:8080/area/info?name=${res.name}`)
          // 存储到本地存储
          localStorage.setItem('hkzf_city', JSON.stringify(result.data.body))
          // 返回该城市数据
          resolve(result.data.body)
        } catch (error) {
          // 获取定位城市失败
          reject(error)
        }
      })
    })
  }
  return Promise.resolve(localCity)
}

export { API } from './api'
export { BASE_URL } from './url'
// 导出 auth 模块中的所有内容
export * from './auth'
export { getCity } from './city'
