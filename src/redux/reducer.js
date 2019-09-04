//一个根据老的state和指定的action计算处理后返回一个新的state的函数模块
import {combineReducers} from 'redux'

import {getUser} from '../untils/storageUtils'
import {
  SET_HEADER_TITLE,
  RECEIVE_USER,
  SHOW_MSG,
  RESET_USER
} from './action-types'

const initHeaderTitle = '首页'
function headerTitle(state = initHeaderTitle,action) {
  switch (action.type) {
    case SET_HEADER_TITLE:
      return action.headerTitle
    default:
      return state
  }
}
//管理登陆用户的reducer函数
const initUser = getUser()
function user(state = initUser, action) {
  switch (action.type) {
    case RECEIVE_USER:
      return action.data
    case SHOW_MSG:
      return {...state,msg:action.msg}
    case RESET_USER:
      return {msg:'已退出，请重新登录'}
    default:
      return state
  }
}

export default combineReducers({
  headerTitle:headerTitle,
  user: user
})