import store from 'store'

const USER_KEY = 'user_key'
//保存user
export const saveUser = (user) => store.set(USER_KEY,user)
//读取到user
export const getUser = () => store.get(USER_KEY) || {}
//删除user
export const removeUser = () => store.remove(USER_KEY)