/* 
包含n个用于创建action的工厂函数(action creator)
同步action: 是一个对象, {type: xxx, data: 数据}
异步action: 是一个函数, dispatch => {1. 发异步ajax请求, 2. 根据结果分发同步action}
*/
import {
  SET_HEADER_TITLE,
  RECEIVE_USER,
  SHOW_MSG,
  RESET_USER
} from './action-types'
import { reqLogin } from '../api'
import {saveUser,removeUser } from '../untils/storageUtils'

//设置头部同步action
export const setHeaderTitle = (headerTitle) =>({type:SET_HEADER_TITLE,headerTitle})
//接收登录成功的用户
export const receiveUser = (user) =>({type:RECEIVE_USER,data:user})
//接收登录失败的用户
export const showMsg = (msg) => ({ type: SHOW_MSG, msg})
//登录异步的action
export function login(username,password) {
  return async dispatch => {
    //1.发异步ajax请求
    const result = await reqLogin({username,password})
    //2.根据结果分发action
    if (result.status === 0) {
      const user = result.user
      // 将user保存到local
      saveUser(user)
      // 将user保存到状态中
      dispatch(receiveUser(user))
    }else{
      //登录失败
      const msg = result.msg
       dispatch(showMsg(msg))
    }
  }
}
//退出登录的同步action
export const logout = () => {
  //清除local中保存的user
  removeUser()
  //重置状态中的user
  return {type:RESET_USER}
}
